// Folio Notes Application Controller
// Orchestrates state, views, markdown parsing, and event handling

(function () {
  'use strict';

  // Application State
  const AppState = {
    notes: [],
    folders: [],
    activeNoteId: null,
    currentView: 'all', // 'all', 'pinned', 'trash', or 'folder:<id>', or 'tag:<tag>'
    searchQuery: '',
    sortBy: 'updated',  // 'updated', 'created', 'title'
    editorMode: 'split',// 'edit', 'split', 'preview'
    activeTheme: 'linen',
    autoSaveTimeout: null,
    confirmActionCallback: null
  };

  // DOM Elements Cache
  const UI = {};

  function cacheDOMElements() {
    UI.appContainer = document.getElementById('app');
    UI.sidebar = document.getElementById('app-sidebar');
    UI.sidebarBackdrop = document.getElementById('sidebar-backdrop');
    UI.btnToggleSidebar = document.getElementById('btn-toggle-sidebar');
    UI.btnCloseSidebarMobile = document.getElementById('btn-close-sidebar-mobile');
    UI.btnMobileBack = document.getElementById('btn-mobile-back');

    UI.btnNewNote = document.getElementById('btn-new-note');
    UI.navViewAll = document.getElementById('nav-view-all');
    UI.navViewPinned = document.getElementById('nav-view-pinned');
    UI.navViewTrash = document.getElementById('nav-view-trash');
    UI.badgeCountAll = document.getElementById('badge-count-all');
    UI.badgeCountPinned = document.getElementById('badge-count-pinned');
    UI.badgeCountTrash = document.getElementById('badge-count-trash');

    UI.foldersNavList = document.getElementById('folders-nav-list');
    UI.tagsCloudContainer = document.getElementById('tags-cloud-container');
    UI.btnModalNewFolder = document.getElementById('btn-modal-new-folder');

    // Search and Notes List
    UI.searchInput = document.getElementById('search-input');
    UI.btnClearSearch = document.getElementById('btn-clear-search');
    UI.currentViewTitle = document.getElementById('current-view-title');
    UI.viewNotesCount = document.getElementById('view-notes-count');
    UI.sortSelect = document.getElementById('sort-select');

    UI.pinnedNotesSection = document.getElementById('pinned-notes-section');
    UI.pinnedNotesList = document.getElementById('pinned-notes-list');
    UI.regularNotesSection = document.getElementById('regular-notes-section');
    UI.regularNotesLabel = document.getElementById('regular-notes-label');
    UI.regularNotesList = document.getElementById('regular-notes-list');
    UI.notesEmptyState = document.getElementById('notes-empty-state');
    UI.emptyStateTitle = document.getElementById('empty-state-title');
    UI.emptyStateDesc = document.getElementById('empty-state-desc');
    UI.btnEmptyCreateNote = document.getElementById('btn-empty-create-note');

    // Editor Header
    UI.noteEditorPane = document.getElementById('note-editor-pane');
    UI.noteFolderSelect = document.getElementById('note-folder-select');
    UI.btnNoteColorDot = document.getElementById('btn-note-color-dot');
    UI.colorPalettePopover = document.getElementById('color-palette-popover');
    UI.btnTogglePinEditor = document.getElementById('btn-toggle-pin-editor');

    UI.btnModeEdit = document.getElementById('btn-mode-edit');
    UI.btnModeSplit = document.getElementById('btn-mode-split');
    UI.btnModePreview = document.getElementById('btn-mode-preview');

    UI.btnMoreActions = document.getElementById('btn-more-actions');
    UI.dropdownMoreActions = document.getElementById('dropdown-more-actions');
    UI.btnActionExportMd = document.getElementById('btn-action-export-md');
    UI.btnActionExportTxt = document.getElementById('btn-action-export-txt');
    UI.btnActionDuplicate = document.getElementById('btn-action-duplicate');
    UI.btnActionDelete = document.getElementById('btn-action-delete');
    UI.textActionDelete = document.getElementById('text-action-delete');

    // Markdown Toolbar
    UI.markdownFormattingToolbar = document.getElementById('markdown-formatting-toolbar');

    // Note Meta & Editor Body
    UI.noteTitleInput = document.getElementById('note-title-input');
    UI.noteTagsContainer = document.getElementById('note-tags-container');
    UI.tagInputInline = document.getElementById('tag-input-inline');
    UI.noteBodyTextarea = document.getElementById('note-body-textarea');
    UI.markdownPreviewPane = document.getElementById('markdown-preview-pane');
    UI.markdownPreviewContent = document.getElementById('markdown-preview-content');

    // Status Footer
    UI.statWords = document.getElementById('stat-words');
    UI.statChars = document.getElementById('stat-chars');
    UI.statReadTime = document.getElementById('stat-read-time');
    UI.taskProgressContainer = document.getElementById('task-progress-container');
    UI.taskProgressFill = document.getElementById('task-progress-fill');
    UI.taskProgressText = document.getElementById('task-progress-text');
    UI.saveIndicator = document.getElementById('save-indicator');
    UI.saveIndicatorText = document.getElementById('save-indicator-text');

    // Modals
    UI.modalFolder = document.getElementById('modal-folder');
    UI.inputFolderName = document.getElementById('input-folder-name');
    UI.btnSaveFolder = document.getElementById('btn-save-folder');

    UI.modalTemplates = document.getElementById('modal-templates');
    UI.templatesListContainer = document.getElementById('templates-list-container');
    UI.btnOpenTemplatesModal = document.getElementById('btn-open-templates-modal');

    UI.modalBackup = document.getElementById('modal-backup');
    UI.btnOpenBackupModal = document.getElementById('btn-open-backup-modal');
    UI.btnExportBackupJson = document.getElementById('btn-export-backup-json');
    UI.btnTriggerImportFile = document.getElementById('btn-trigger-import-file');
    UI.inputImportBackupFile = document.getElementById('input-import-backup-file');
    UI.btnResetSampleData = document.getElementById('btn-reset-sample-data');

    UI.modalShortcuts = document.getElementById('modal-shortcuts');
    UI.btnOpenShortcutsModal = document.getElementById('btn-open-shortcuts-modal');

    UI.modalConfirm = document.getElementById('modal-confirm');
    UI.confirmModalTitle = document.getElementById('confirm-modal-title');
    UI.confirmModalMessage = document.getElementById('confirm-modal-message');
    UI.btnConfirmProceed = document.getElementById('btn-confirm-proceed');
  }

  function renderIcons() {
    // Populate all icons from the crisp SVG library
    const iconMap = {
      'brand-logo-icon': Icons.notebook,
      'icon-close-sidebar': Icons.x,
      'icon-new-note-plus': Icons.plus,
      'icon-nav-all': Icons.notebook,
      'icon-nav-pinned': Icons.pinFilled,
      'icon-nav-trash': Icons.trash,
      'icon-add-folder': Icons.plus,
      'icon-theme-linen': Icons.coffee,
      'icon-theme-sage': Icons.tree,
      'icon-theme-slate': Icons.columns,
      'icon-theme-espresso': Icons.moon,
      'icon-util-template': Icons.template,
      'icon-util-backup': Icons.download,
      'icon-util-keyboard': Icons.keyboard,
      'icon-search-pane': Icons.search,
      'icon-clear-search': Icons.x,
      'icon-pinned-header': Icons.pinFilled,
      'icon-empty-state': Icons.notebook,
      'icon-mobile-menu': Icons.menu,
      'icon-mobile-back': Icons.arrowLeft,
      'icon-pin-editor': Icons.pin,
      'icon-mode-edit': Icons.edit,
      'icon-mode-split': Icons.columns,
      'icon-mode-preview': Icons.eye,
      'icon-more-actions': Icons.moreHorizontal,
      'icon-action-export-md': Icons.download,
      'icon-action-export-txt': Icons.download,
      'icon-action-duplicate': Icons.copy,
      'icon-action-delete': Icons.trash,
      'icon-fmt-bold': Icons.bold,
      'icon-fmt-italic': Icons.italic,
      'icon-fmt-h1': Icons.heading,
      'icon-fmt-h2': Icons.heading,
      'icon-fmt-list': Icons.list,
      'icon-fmt-check': Icons.checkSquare,
      'icon-fmt-quote': Icons.quote,
      'icon-fmt-code': Icons.code,
      'icon-fmt-table': Icons.columns,
      'icon-save-check': Icons.check,
      'icon-modal-folder-title': Icons.folderPlus,
      'icon-close-folder-modal': Icons.x,
      'icon-modal-template-title': Icons.template,
      'icon-close-template-modal': Icons.x,
      'icon-modal-backup-title': Icons.download,
      'icon-close-backup-modal': Icons.x,
      'icon-export-backup-btn': Icons.download,
      'icon-import-backup-btn': Icons.upload,
      'icon-modal-shortcuts-title': Icons.keyboard,
      'icon-close-shortcuts-modal': Icons.x,
      'icon-close-confirm-modal': Icons.x
    };

    Object.entries(iconMap).forEach(([id, svg]) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = svg;
    });
  }

  // Application Initialization
  function init() {
    cacheDOMElements();
    renderIcons();
    Storage.init();

    // Load persisted settings
    const settings = Storage.getSettings();
    setTheme(settings.theme || 'linen');
    AppState.sortBy = settings.sortBy || 'updated';
    UI.sortSelect.value = AppState.sortBy;
    setEditorMode(settings.editorMode || 'split');

    loadData();

    // Select initial note
    const activeNotes = getFilteredNotes();
    if (activeNotes.length > 0) {
      selectNote(activeNotes[0].id);
    } else {
      showEmptyEditor();
    }

    bindEvents();
    renderTemplatesList();
  }

  function loadData() {
    AppState.folders = Storage.getFolders();
    AppState.notes = Storage.getNotes(true);
    renderSidebar();
    renderNotesList();
    populateFolderSelect();
  }

  // ============================================================
  // Themes & Editor Modes
  // ============================================================
  function setTheme(theme) {
    AppState.activeTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.classList.toggle('is-active', btn.getAttribute('data-set-theme') === theme);
    });
    Storage.saveSettings({ theme });
  }

  function setEditorMode(mode) {
    AppState.editorMode = mode;
    UI.noteEditorPane.setAttribute('data-mode', mode);
    [UI.btnModeEdit, UI.btnModeSplit, UI.btnModePreview].forEach(btn => {
      btn.classList.toggle('is-active', btn.getAttribute('data-mode') === mode);
    });
    Storage.saveSettings({ editorMode: mode });
  }

  // ============================================================
  // Navigation & Sidebar Rendering
  // ============================================================
  function renderSidebar() {
    const allNotes = Storage.getNotes(false);
    const pinnedNotes = allNotes.filter(n => n.isPinned);
    const trashNotes = Storage.getTrashNotes();

    UI.badgeCountAll.textContent = allNotes.length;
    UI.badgeCountPinned.textContent = pinnedNotes.length;
    UI.badgeCountTrash.textContent = trashNotes.length;

    // Highlight active nav item
    document.querySelectorAll('.app-sidebar .nav-item').forEach(el => el.classList.remove('is-active'));
    if (AppState.currentView === 'all') UI.navViewAll.classList.add('is-active');
    else if (AppState.currentView === 'pinned') UI.navViewPinned.classList.add('is-active');
    else if (AppState.currentView === 'trash') UI.navViewTrash.classList.add('is-active');

    // Render Folders
    UI.foldersNavList.innerHTML = '';
    AppState.folders.forEach(folder => {
      const count = allNotes.filter(n => n.folderId === folder.id).length;
      const isFolderActive = AppState.currentView === `folder:${folder.id}`;

      const item = document.createElement('div');
      item.className = `nav-item ${isFolderActive ? 'is-active' : ''}`;
      item.innerHTML = `
        <span class="nav-item-main">
          <span class="folder-color-dot" style="background-color: ${folder.color};"></span>
          <span>${Markdown.escapeHtml(folder.name)}</span>
        </span>
        <div style="display:flex; align-items:center; gap:6px;">
          <span class="nav-badge">${count}</span>
          <button class="nav-action-icon-btn btn-delete-folder" data-folder-id="${folder.id}" title="Delete folder" style="opacity:0.5;">
            ${Icons.x}
          </button>
        </div>
      `;

      item.addEventListener('click', (e) => {
        if (e.target.closest('.btn-delete-folder')) return;
        setView(`folder:${folder.id}`);
      });

      const delBtn = item.querySelector('.btn-delete-folder');
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        confirmAction(
          'Delete Folder',
          `Are you sure you want to delete folder "${folder.name}"? Notes inside will become uncategorized.`,
          () => {
            Storage.deleteFolder(folder.id);
            if (AppState.currentView === `folder:${folder.id}`) {
              setView('all');
            } else {
              loadData();
            }
          }
        );
      });

      UI.foldersNavList.appendChild(item);
    });

    // Render Tags Cloud
    const tags = Storage.getAllTags();
    UI.tagsCloudContainer.innerHTML = '';
    if (tags.length === 0) {
      UI.tagsCloudContainer.innerHTML = '<span style="font-size:0.75rem; color:var(--text-subtle);">No tags yet</span>';
    } else {
      tags.forEach(({ name, count }) => {
        const isTagActive = AppState.currentView === `tag:${name}`;
        const pill = document.createElement('button');
        pill.className = `tag-pill ${isTagActive ? 'is-active' : ''}`;
        pill.innerHTML = `
          <span>#${Markdown.escapeHtml(name)}</span>
          <span class="tag-pill-count">${count}</span>
        `;
        pill.addEventListener('click', () => {
          setView(isTagActive ? 'all' : `tag:${name}`);
        });
        UI.tagsCloudContainer.appendChild(pill);
      });
    }
  }

  function setView(view) {
    AppState.currentView = view;
    renderSidebar();
    renderNotesList();

    const filtered = getFilteredNotes();
    if (filtered.length > 0) {
      if (!filtered.some(n => n.id === AppState.activeNoteId)) {
        selectNote(filtered[0].id);
      }
    } else {
      showEmptyEditor();
    }

    // Close mobile sidebar if open
    closeMobileSidebar();
  }

  function populateFolderSelect() {
    UI.noteFolderSelect.innerHTML = '<option value="">📁 Uncategorized</option>';
    AppState.folders.forEach(f => {
      const opt = document.createElement('option');
      opt.value = f.id;
      opt.textContent = `📁 ${f.name}`;
      UI.noteFolderSelect.appendChild(opt);
    });
  }

  // ============================================================
  // Filtering, Searching, and Sorting Notes
  // ============================================================
  function getFilteredNotes() {
    let list = [];
    const isTrash = AppState.currentView === 'trash';

    if (isTrash) {
      list = Storage.getTrashNotes();
    } else {
      list = Storage.getNotes(false);

      if (AppState.currentView === 'pinned') {
        list = list.filter(n => n.isPinned);
      } else if (AppState.currentView.startsWith('folder:')) {
        const fId = AppState.currentView.replace('folder:', '');
        list = list.filter(n => n.folderId === fId);
      } else if (AppState.currentView.startsWith('tag:')) {
        const tagName = AppState.currentView.replace('tag:', '').toLowerCase();
        list = list.filter(n => n.tags && n.tags.map(t => t.toLowerCase()).includes(tagName));
      }
    }

    // Search Query Filtering (Title & Content)
    if (AppState.searchQuery.trim()) {
      const q = AppState.searchQuery.trim().toLowerCase();
      list = list.filter(n => {
        const inTitle = (n.title || '').toLowerCase().includes(q);
        const inContent = (n.content || '').toLowerCase().includes(q);
        const inTags = (n.tags || []).some(t => t.toLowerCase().includes(q));
        return inTitle || inContent || inTags;
      });
    }

    // Sorting
    list.sort((a, b) => {
      if (AppState.sortBy === 'title') {
        return (a.title || '').localeCompare(b.title || '');
      } else if (AppState.sortBy === 'created') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        // default: updated
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      }
    });

    return list;
  }

  function highlightMatches(text, query) {
    if (!query || !text) return Markdown.escapeHtml(text);
    const escapedText = Markdown.escapeHtml(text);
    const escapedQuery = query.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    return escapedText.replace(regex, '<span class="search-highlight">$1</span>');
  }

  function formatRelativeDate(isoDate) {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  }

  // ============================================================
  // Middle Notes List Rendering
  // ============================================================
  function renderNotesList() {
    const isTrash = AppState.currentView === 'trash';
    const notes = getFilteredNotes();

    // Update Toolbar Title
    let titleText = 'All Notes';
    if (isTrash) titleText = 'Trash';
    else if (AppState.currentView === 'pinned') titleText = 'Pinned Notes';
    else if (AppState.currentView.startsWith('folder:')) {
      const f = AppState.folders.find(x => x.id === AppState.currentView.replace('folder:', ''));
      titleText = f ? f.name : 'Folder';
    } else if (AppState.currentView.startsWith('tag:')) {
      titleText = '#' + AppState.currentView.replace('tag:', '');
    }

    UI.currentViewTitle.querySelector('span').textContent = titleText;
    UI.viewNotesCount.textContent = `(${notes.length})`;

    // Check empty state
    if (notes.length === 0) {
      UI.pinnedNotesSection.style.display = 'none';
      UI.regularNotesSection.style.display = 'none';
      UI.notesEmptyState.style.display = 'flex';

      if (AppState.searchQuery) {
        UI.emptyStateTitle.textContent = 'No matching notes';
        UI.emptyStateDesc.textContent = `No notes matched "${AppState.searchQuery}". Try a different search term.`;
        UI.btnEmptyCreateNote.style.display = 'none';
      } else if (isTrash) {
        UI.emptyStateTitle.textContent = 'Trash is empty';
        UI.emptyStateDesc.textContent = 'Deleted notes will appear here.';
        UI.btnEmptyCreateNote.style.display = 'none';
      } else {
        UI.emptyStateTitle.textContent = 'No notes here yet';
        UI.emptyStateDesc.textContent = 'Create your first note to begin capturing your ideas.';
        UI.btnEmptyCreateNote.style.display = 'inline-block';
      }
      return;
    }

    UI.notesEmptyState.style.display = 'none';

    // Separate Pinned and Regular notes (only when not in Trash or Pinned-only view)
    let pinnedList = [];
    let regularList = [];

    if (!isTrash && AppState.currentView !== 'pinned') {
      pinnedList = notes.filter(n => n.isPinned);
      regularList = notes.filter(n => !n.isPinned);
    } else {
      regularList = notes;
    }

    // Render Pinned Section
    if (pinnedList.length > 0) {
      UI.pinnedNotesSection.style.display = 'block';
      UI.pinnedNotesList.innerHTML = '';
      pinnedList.forEach(note => {
        UI.pinnedNotesList.appendChild(createNoteCardElement(note));
      });
    } else {
      UI.pinnedNotesSection.style.display = 'none';
      UI.pinnedNotesList.innerHTML = '';
    }

    // Render Regular Section
    UI.regularNotesSection.style.display = 'block';
    UI.regularNotesLabel.style.display = pinnedList.length > 0 ? 'flex' : 'none';
    UI.regularNotesList.innerHTML = '';
    regularList.forEach(note => {
      UI.regularNotesList.appendChild(createNoteCardElement(note));
    });
  }

  function createNoteCardElement(note) {
    const card = document.createElement('div');
    card.className = `note-card ${note.id === AppState.activeNoteId ? 'is-selected' : ''}`;
    card.setAttribute('data-id', note.id);
    if (note.color) {
      card.style.borderLeftColor = note.color;
    }

    // Extract plain snippet without markdown syntax
    const cleanSnippet = (note.content || '')
      .replace(/^#+\s+/gm, '')
      .replace(/[-*]\s+(\[[ xX]\])?/g, '')
      .replace(/[`>|]/g, '')
      .trim();

    const titleHtml = highlightMatches(note.title || 'Untitled Note', AppState.searchQuery);
    const snippetHtml = highlightMatches(cleanSnippet.slice(0, 110), AppState.searchQuery) || '<em style="color:var(--text-subtle)">No content yet</em>';

    // Tags preview (up to 3)
    let tagsHtml = '';
    if (Array.isArray(note.tags) && note.tags.length > 0) {
      tagsHtml = note.tags.slice(0, 3).map(t => `<span class="note-card-tag">#${Markdown.escapeHtml(t)}</span>`).join('');
      if (note.tags.length > 3) {
        tagsHtml += `<span class="note-card-tag">+${note.tags.length - 3}</span>`;
      }
    }

    card.innerHTML = `
      <div class="note-card-header">
        <h3 class="note-card-title">${titleHtml}</h3>
        <div class="note-card-actions">
          <button class="card-action-btn btn-card-pin ${note.isPinned ? 'is-pinned' : ''}" title="${note.isPinned ? 'Unpin Note' : 'Pin Note'}">
            ${note.isPinned ? Icons.pinFilled : Icons.pin}
          </button>
        </div>
      </div>
      <p class="note-card-snippet">${snippetHtml}</p>
      <div class="note-card-footer">
        <span class="note-card-date">${Icons.clock} ${formatRelativeDate(note.updatedAt)}</span>
        <div class="note-card-tags">${tagsHtml}</div>
      </div>
    `;

    // Click to select
    card.addEventListener('click', (e) => {
      if (e.target.closest('.btn-card-pin')) return;
      selectNote(note.id);
    });

    // Pin toggle button inside card
    const pinBtn = card.querySelector('.btn-card-pin');
    pinBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      Storage.togglePin(note.id);
      loadData();
      if (AppState.activeNoteId === note.id) {
        updateEditorPinButton(!note.isPinned);
      }
    });

    return card;
  }

  // ============================================================
  // Note Selection & Editor Management
  // ============================================================
  function selectNote(noteId) {
    flushAutoSave();

    const note = Storage.getNoteById(noteId);
    if (!note) {
      showEmptyEditor();
      return;
    }

    AppState.activeNoteId = note.id;

    // Highlight selected card
    document.querySelectorAll('.note-card').forEach(el => {
      el.classList.toggle('is-selected', el.getAttribute('data-id') === note.id);
    });

    // Populate Editor fields
    UI.noteTitleInput.value = note.title || '';
    UI.noteBodyTextarea.value = note.content || '';
    UI.noteFolderSelect.value = note.folderId || '';

    // Set accent color
    const noteColor = note.color || '#D97736';
    UI.btnNoteColorDot.style.backgroundColor = noteColor;

    // Set pin state
    updateEditorPinButton(!!note.isPinned);

    // Render tags
    renderNoteTags(note.tags || []);

    // Update delete button text if in trash
    if (note.isDeleted) {
      UI.textActionDelete.textContent = 'Permanently Delete';
    } else {
      UI.textActionDelete.textContent = 'Move to Trash';
    }

    // Render Markdown preview & compute stats
    renderPreview();
    updateStats();

    // Reset save indicator
    UI.saveIndicatorText.textContent = `Saved ${formatRelativeDate(note.updatedAt)}`;
    UI.saveIndicator.classList.remove('is-saving');

    // On mobile screens, transition to show editor
    UI.appContainer.classList.add('show-editor');
  }

  function showEmptyEditor() {
    AppState.activeNoteId = null;
    UI.noteTitleInput.value = '';
    UI.noteBodyTextarea.value = '';
    UI.noteFolderSelect.value = '';
    UI.btnNoteColorDot.style.backgroundColor = '#D97736';
    updateEditorPinButton(false);
    renderNoteTags([]);
    UI.markdownPreviewContent.innerHTML = '<p class="placeholder-text">Select or create a note to view.</p>';
    updateStats();
    UI.saveIndicatorText.textContent = '';
  }

  function updateEditorPinButton(isPinned) {
    UI.btnTogglePinEditor.classList.toggle('is-pinned', isPinned);
    UI.btnTogglePinEditor.innerHTML = isPinned ? Icons.pinFilled : Icons.pin;
    UI.btnTogglePinEditor.title = isPinned ? 'Unpin Note (Ctrl+P)' : 'Pin Note (Ctrl+P)';
  }

  function renderNoteTags(tags) {
    // Clear existing tag badges (keep the input)
    const badges = UI.noteTagsContainer.querySelectorAll('.tag-badge');
    badges.forEach(b => b.remove());

    tags.forEach(tag => {
      const badge = document.createElement('span');
      badge.className = 'tag-badge';
      badge.innerHTML = `
        <span>#${Markdown.escapeHtml(tag)}</span>
        <button class="tag-remove-btn" data-tag="${Markdown.escapeHtml(tag)}" title="Remove tag">
          ${Icons.x}
        </button>
      `;

      badge.querySelector('.tag-remove-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        removeTagFromActiveNote(tag);
      });

      UI.noteTagsContainer.insertBefore(badge, UI.tagInputInline);
    });
  }

  function addTagToActiveNote(tagText) {
    if (!AppState.activeNoteId) return;
    const clean = tagText.replace(/^#+/, '').trim().toLowerCase();
    if (!clean) return;

    const note = Storage.getNoteById(AppState.activeNoteId);
    if (!note) return;

    const currentTags = Array.isArray(note.tags) ? [...note.tags] : [];
    if (!currentTags.includes(clean)) {
      currentTags.push(clean);
      Storage.saveNote({ ...note, tags: currentTags });
      renderNoteTags(currentTags);
      renderSidebar();
      renderNotesList();
    }
  }

  function removeTagFromActiveNote(tagToRemove) {
    if (!AppState.activeNoteId) return;
    const note = Storage.getNoteById(AppState.activeNoteId);
    if (!note) return;

    const updatedTags = (note.tags || []).filter(t => t !== tagToRemove);
    Storage.saveNote({ ...note, tags: updatedTags });
    renderNoteTags(updatedTags);
    renderSidebar();
    renderNotesList();
  }

  // ============================================================
  // Live Markdown Rendering & Interactive Tasks
  // ============================================================
  function renderPreview() {
    const rawContent = UI.noteBodyTextarea.value;
    UI.markdownPreviewContent.innerHTML = Markdown.render(rawContent);

    // Attach interactive task list checkbox listeners
    const checkboxes = UI.markdownPreviewContent.querySelectorAll('.interactive-checkbox');
    checkboxes.forEach(cb => {
      cb.addEventListener('change', (e) => {
        const taskIndex = parseInt(cb.getAttribute('data-task-index'), 10);
        handleTaskCheckboxToggle(taskIndex);
      });
    });
  }

  function handleTaskCheckboxToggle(taskIndex) {
    if (!AppState.activeNoteId) return;
    const currentText = UI.noteBodyTextarea.value;
    const updatedText = Markdown.toggleCheckboxAt(currentText, taskIndex);
    UI.noteBodyTextarea.value = updatedText;

    // Trigger immediate save & re-render
    scheduleAutoSave(true);
    renderPreview();
    updateStats();
  }

  function updateStats() {
    const title = UI.noteTitleInput.value;
    const content = UI.noteBodyTextarea.value;
    const stats = Markdown.getStats(content, title);

    UI.statWords.textContent = `${stats.words} ${stats.words === 1 ? 'word' : 'words'}`;
    UI.statChars.textContent = `${stats.chars} chars`;
    UI.statReadTime.textContent = stats.readTime;

    if (stats.tasks.total > 0) {
      UI.taskProgressContainer.style.display = 'flex';
      UI.taskProgressFill.style.width = `${stats.tasks.percent}%`;
      UI.taskProgressText.textContent = `${stats.tasks.completed}/${stats.tasks.total} done (${stats.tasks.percent}%)`;
    } else {
      UI.taskProgressContainer.style.display = 'none';
    }
  }

  // ============================================================
  // Auto-Save Mechanism
  // ============================================================
  function scheduleAutoSave(immediate = false) {
    if (AppState.autoSaveTimeout) {
      clearTimeout(AppState.autoSaveTimeout);
      AppState.autoSaveTimeout = null;
    }

    UI.saveIndicator.classList.add('is-saving');
    UI.saveIndicatorText.textContent = 'Saving...';

    if (immediate) {
      performSave();
    } else {
      AppState.autoSaveTimeout = setTimeout(performSave, 350);
    }
  }

  function flushAutoSave() {
    if (AppState.autoSaveTimeout) {
      clearTimeout(AppState.autoSaveTimeout);
      AppState.autoSaveTimeout = null;
      performSave();
    }
  }

  function performSave() {
    if (!AppState.activeNoteId) return;

    const note = Storage.getNoteById(AppState.activeNoteId);
    if (!note) return;

    const title = UI.noteTitleInput.value.trim() || 'Untitled Note';
    const content = UI.noteBodyTextarea.value;
    const folderId = UI.noteFolderSelect.value || null;

    const saved = Storage.saveNote({
      ...note,
      title,
      content,
      folderId
    });

    if (saved) {
      UI.saveIndicator.classList.remove('is-saving');
      UI.saveIndicatorText.textContent = 'Saved just now';

      // Update sidebar counts & active note card preview in middle pane
      renderSidebar();
      renderNotesList();
    }
  }

  // ============================================================
  // CRUD Actions
  // ============================================================
  function createNewNote(template = null) {
    flushAutoSave();

    let initialTitle = 'Untitled Note';
    let initialContent = '';
    let initialFolder = null;
    let initialTags = [];

    // Pre-select current folder if viewing a specific folder
    if (AppState.currentView.startsWith('folder:')) {
      initialFolder = AppState.currentView.replace('folder:', '');
    }

    if (template) {
      initialTitle = template.title || 'Untitled';
      initialContent = template.content || '';
      initialFolder = template.folderId || initialFolder;
      initialTags = template.tags || [];
    }

    const newNote = Storage.saveNote({
      title: initialTitle,
      content: initialContent,
      folderId: initialFolder,
      tags: initialTags,
      isPinned: false,
      color: '#D97736'
    });

    if (newNote) {
      // If currently in trash or filtered by something else, switch to all notes
      if (AppState.currentView === 'trash') {
        AppState.currentView = 'all';
      }

      loadData();
      selectNote(newNote.id);
      UI.noteTitleInput.focus();
      UI.noteTitleInput.select();
    }
  }

  function deleteActiveNote() {
    if (!AppState.activeNoteId) return;

    const note = Storage.getNoteById(AppState.activeNoteId);
    if (!note) return;

    if (note.isDeleted) {
      // Permanent delete confirmation
      confirmAction(
        'Permanently Delete Note',
        `Are you sure you want to permanently delete "${note.title}"? This cannot be undone.`,
        () => {
          Storage.deleteNote(note.id, false);
          loadData();
          const remaining = getFilteredNotes();
          if (remaining.length > 0) selectNote(remaining[0].id);
          else showEmptyEditor();
        }
      );
    } else {
      // Soft delete to Trash
      Storage.deleteNote(note.id, true);
      loadData();
      const remaining = getFilteredNotes();
      if (remaining.length > 0) selectNote(remaining[0].id);
      else showEmptyEditor();
    }
  }

  function duplicateActiveNote() {
    if (!AppState.activeNoteId) return;
    const note = Storage.getNoteById(AppState.activeNoteId);
    if (!note) return;

    const duplicated = Storage.saveNote({
      title: `${note.title} (Copy)`,
      content: note.content,
      folderId: note.folderId,
      tags: [...(note.tags || [])],
      color: note.color,
      isPinned: false
    });

    if (duplicated) {
      loadData();
      selectNote(duplicated.id);
    }
  }

  function toggleActiveNotePin() {
    if (!AppState.activeNoteId) return;
    const updated = Storage.togglePin(AppState.activeNoteId);
    if (updated) {
      updateEditorPinButton(updated.isPinned);
      loadData();
    }
  }

  // ============================================================
  // Markdown Toolbar Formatting Injection
  // ============================================================
  function insertFormatting(type) {
    const textarea = UI.noteBodyTextarea;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selText = textarea.value.substring(start, end);

    let replacement = '';
    let cursorOffset = 0;

    switch (type) {
      case 'bold':
        replacement = `**${selText || 'bold text'}**`;
        cursorOffset = selText ? replacement.length : 2;
        break;
      case 'italic':
        replacement = `*${selText || 'italic text'}*`;
        cursorOffset = selText ? replacement.length : 1;
        break;
      case 'h1':
        replacement = `\n# ${selText || 'Heading 1'}\n`;
        cursorOffset = replacement.length;
        break;
      case 'h2':
        replacement = `\n## ${selText || 'Heading 2'}\n`;
        cursorOffset = replacement.length;
        break;
      case 'bullet':
        replacement = `\n- ${selText || 'List item'}\n`;
        cursorOffset = replacement.length;
        break;
      case 'todo':
        replacement = `\n- [ ] ${selText || 'New task item'}\n`;
        cursorOffset = replacement.length;
        break;
      case 'quote':
        replacement = `\n> ${selText || 'Quote'}\n`;
        cursorOffset = replacement.length;
        break;
      case 'code':
        replacement = selText ? `\n\`\`\`\n${selText}\n\`\`\`\n` : `\n\`\`\`javascript\n// Write code here\n\`\`\`\n`;
        cursorOffset = replacement.length;
        break;
      case 'table':
        replacement = `\n| Column 1 | Column 2 |\n| :--- | :--- |\n| Item A | Item B |\n`;
        cursorOffset = replacement.length;
        break;
      default:
        return;
    }

    textarea.focus();
    textarea.setRangeText(replacement, start, end, 'end');
    renderPreview();
    updateStats();
    scheduleAutoSave();
  }

  // ============================================================
  // Modals & Dialogs
  // ============================================================
  function openModal(modalEl) {
    if (modalEl) modalEl.classList.add('is-visible');
  }

  function closeModal(modalEl) {
    if (modalEl) modalEl.classList.remove('is-visible');
  }

  function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('is-visible'));
  }

  function confirmAction(title, message, onProceed) {
    UI.confirmModalTitle.textContent = title;
    UI.confirmModalMessage.textContent = message;
    AppState.confirmActionCallback = onProceed;
    openModal(UI.modalConfirm);
  }

  function renderTemplatesList() {
    UI.templatesListContainer.innerHTML = '';
    NOTE_TEMPLATES.forEach(tpl => {
      const card = document.createElement('div');
      card.className = 'template-card';
      card.innerHTML = `
        <div class="template-icon-circle">${Icons[tpl.icon] || Icons.template}</div>
        <div class="template-card-info">
          <h4>${Markdown.escapeHtml(tpl.name)}</h4>
          <p>${Markdown.escapeHtml(tpl.description)}</p>
        </div>
      `;
      card.addEventListener('click', () => {
        closeModal(UI.modalTemplates);
        createNewNote(tpl);
      });
      UI.templatesListContainer.appendChild(card);
    });
  }

  function openMobileSidebar() {
    UI.sidebar.classList.add('is-open');
    UI.sidebarBackdrop.classList.add('is-visible');
  }

  function closeMobileSidebar() {
    UI.sidebar.classList.remove('is-open');
    UI.sidebarBackdrop.classList.remove('is-visible');
  }

  // ============================================================
  // Event Listeners Binding
  // ============================================================
  function bindEvents() {
    // Mobile navigation
    UI.btnToggleSidebar.addEventListener('click', openMobileSidebar);
    UI.btnCloseSidebarMobile.addEventListener('click', closeMobileSidebar);
    UI.sidebarBackdrop.addEventListener('click', closeMobileSidebar);

    UI.btnMobileBack.addEventListener('click', () => {
      UI.appContainer.classList.remove('show-editor');
    });

    // Navigation Views
    UI.navViewAll.addEventListener('click', () => setView('all'));
    UI.navViewPinned.addEventListener('click', () => setView('pinned'));
    UI.navViewTrash.addEventListener('click', () => setView('trash'));

    // Create New Note
    UI.btnNewNote.addEventListener('click', () => createNewNote());
    UI.btnEmptyCreateNote.addEventListener('click', () => createNewNote());

    // Search Input
    UI.searchInput.addEventListener('input', (e) => {
      AppState.searchQuery = e.target.value;
      UI.btnClearSearch.style.display = AppState.searchQuery ? 'flex' : 'none';
      renderNotesList();
    });

    UI.btnClearSearch.addEventListener('click', () => {
      AppState.searchQuery = '';
      UI.searchInput.value = '';
      UI.btnClearSearch.style.display = 'none';
      renderNotesList();
      UI.searchInput.focus();
    });

    // Sort select
    UI.sortSelect.addEventListener('change', (e) => {
      AppState.sortBy = e.target.value;
      Storage.saveSettings({ sortBy: AppState.sortBy });
      renderNotesList();
    });

    // Editor inputs (Title & Body)
    UI.noteTitleInput.addEventListener('input', () => {
      scheduleAutoSave();
    });

    UI.noteBodyTextarea.addEventListener('input', () => {
      renderPreview();
      updateStats();
      scheduleAutoSave();
    });

    // Folder select in editor
    UI.noteFolderSelect.addEventListener('change', () => {
      scheduleAutoSave(true);
    });

    // Color picker
    UI.btnNoteColorDot.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = UI.colorPalettePopover.style.display === 'flex';
      UI.colorPalettePopover.style.display = isOpen ? 'none' : 'flex';
    });

    UI.colorPalettePopover.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.addEventListener('click', (e) => {
        const color = swatch.getAttribute('data-color');
        UI.btnNoteColorDot.style.backgroundColor = color;
        UI.colorPalettePopover.style.display = 'none';

        if (AppState.activeNoteId) {
          const note = Storage.getNoteById(AppState.activeNoteId);
          if (note) {
            Storage.saveNote({ ...note, color });
            loadData();
          }
        }
      });
    });

    // Pin Toggle in Editor
    UI.btnTogglePinEditor.addEventListener('click', toggleActiveNotePin);

    // Editor Mode Buttons
    UI.btnModeEdit.addEventListener('click', () => setEditorMode('edit'));
    UI.btnModeSplit.addEventListener('click', () => setEditorMode('split'));
    UI.btnModePreview.addEventListener('click', () => setEditorMode('preview'));

    // More Actions Dropdown
    UI.btnMoreActions.addEventListener('click', (e) => {
      e.stopPropagation();
      UI.dropdownMoreActions.classList.toggle('is-open');
    });

    UI.btnActionExportMd.addEventListener('click', () => {
      UI.dropdownMoreActions.classList.remove('is-open');
      if (AppState.activeNoteId) {
        Storage.exportNoteAsMarkdown(Storage.getNoteById(AppState.activeNoteId));
      }
    });

    UI.btnActionExportTxt.addEventListener('click', () => {
      UI.dropdownMoreActions.classList.remove('is-open');
      if (AppState.activeNoteId) {
        Storage.exportNoteAsPlainText(Storage.getNoteById(AppState.activeNoteId));
      }
    });

    UI.btnActionDuplicate.addEventListener('click', () => {
      UI.dropdownMoreActions.classList.remove('is-open');
      duplicateActiveNote();
    });

    UI.btnActionDelete.addEventListener('click', () => {
      UI.dropdownMoreActions.classList.remove('is-open');
      deleteActiveNote();
    });

    // Markdown Formatting Toolbar
    UI.markdownFormattingToolbar.querySelectorAll('.fmt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const fmt = btn.getAttribute('data-fmt');
        insertFormatting(fmt);
      });
    });

    // Inline Tag Input
    UI.tagInputInline.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        const val = UI.tagInputInline.value.trim();
        if (val) {
          addTagToActiveNote(val);
          UI.tagInputInline.value = '';
        }
      }
    });

    // Theme Switcher Buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const theme = btn.getAttribute('data-set-theme');
        setTheme(theme);
      });
    });

    // Modals Triggers
    UI.btnModalNewFolder.addEventListener('click', () => {
      UI.inputFolderName.value = '';
      openModal(UI.modalFolder);
      setTimeout(() => UI.inputFolderName.focus(), 50);
    });

    UI.btnSaveFolder.addEventListener('click', () => {
      const name = UI.inputFolderName.value.trim();
      if (!name) return;
      const colorRadio = document.querySelector('input[name="folder-color"]:checked');
      const color = colorRadio ? colorRadio.value : '#B3541E';

      Storage.saveFolder({ name, color });
      closeModal(UI.modalFolder);
      loadData();
    });

    UI.inputFolderName.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') UI.btnSaveFolder.click();
    });

    UI.btnOpenTemplatesModal.addEventListener('click', () => openModal(UI.modalTemplates));
    UI.btnOpenBackupModal.addEventListener('click', () => openModal(UI.modalBackup));
    UI.btnOpenShortcutsModal.addEventListener('click', () => openModal(UI.modalShortcuts));

    // Backup & Restore
    UI.btnExportBackupJson.addEventListener('click', () => Storage.exportBackup());
    UI.btnTriggerImportFile.addEventListener('click', () => UI.inputImportBackupFile.click());

    UI.inputImportBackupFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          Storage.importBackup(event.target.result, false);
          closeModal(UI.modalBackup);
          loadData();
          alert('Backup successfully imported and merged with existing notes!');
        } catch (err) {
          alert('Failed to parse backup JSON: ' + err.message);
        }
      };
      reader.readAsText(file);
    });

    UI.btnResetSampleData.addEventListener('click', () => {
      confirmAction(
        'Reload Sample Notes',
        'This will restore the initial guide notes alongside your existing notes.',
        () => {
          DEFAULT_NOTES.forEach(note => Storage.saveNote(note));
          DEFAULT_FOLDERS.forEach(folder => Storage.saveFolder(folder));
          closeModal(UI.modalBackup);
          loadData();
        }
      );
    });

    // Confirm Modal Proceed
    UI.btnConfirmProceed.addEventListener('click', () => {
      if (typeof AppState.confirmActionCallback === 'function') {
        AppState.confirmActionCallback();
        AppState.confirmActionCallback = null;
      }
      closeModal(UI.modalConfirm);
    });

    // Close Modals buttons (data-close-modal)
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-close-modal');
        closeModal(document.getElementById(modalId));
      });
    });

    // Close popovers on click outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.note-color-picker-dropdown')) {
        UI.colorPalettePopover.style.display = 'none';
      }
      if (!e.target.closest('#btn-more-actions') && !e.target.closest('#dropdown-more-actions')) {
        UI.dropdownMoreActions.classList.remove('is-open');
      }
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const mod = isMac ? e.metaKey : e.ctrlKey;

      if (e.key === 'Escape') {
        closeAllModals();
        UI.dropdownMoreActions.classList.remove('is-open');
        UI.colorPalettePopover.style.display = 'none';
        if (AppState.searchQuery) {
          UI.btnClearSearch.click();
        }
        return;
      }

      // Ctrl + Alt + N : New note
      if (mod && e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        createNewNote();
        return;
      }

      // Ctrl + F : Focus search
      if (mod && e.key.toLowerCase() === 'f' && !e.shiftKey) {
        // Only override if not already in textarea
        if (document.activeElement !== UI.noteBodyTextarea) {
          e.preventDefault();
          UI.searchInput.focus();
          UI.searchInput.select();
          return;
        }
      }

      // Ctrl + S : Save note
      if (mod && e.key.toLowerCase() === 's') {
        e.preventDefault();
        flushAutoSave();
        return;
      }

      // Ctrl + P : Toggle Pin
      if (mod && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        toggleActiveNotePin();
        return;
      }

      // Ctrl + Delete : Delete note
      if (mod && e.key === 'Delete') {
        e.preventDefault();
        deleteActiveNote();
        return;
      }

      // Ctrl + E : Toggle editor mode
      if (mod && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        const nextMode = AppState.editorMode === 'split' ? 'edit' : 'split';
        setEditorMode(nextMode);
        return;
      }

      // '?' key when not in an input: Open shortcuts
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        openModal(UI.modalShortcuts);
      }
    });
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
