// Folio Notes Storage Engine - Persistent browser storage via localStorage
const StorageKeys = {
  NOTES: 'folio_notes_store_v2',
  FOLDERS: 'folio_folders_store_v2',
  SETTINGS: 'folio_settings_store_v2'
};

const Storage = {
  // Initialize storage with sample data if first time
  init() {
    try {
      if (!localStorage.getItem(StorageKeys.FOLDERS)) {
        localStorage.setItem(StorageKeys.FOLDERS, JSON.stringify(DEFAULT_FOLDERS));
      }
      if (!localStorage.getItem(StorageKeys.NOTES)) {
        localStorage.setItem(StorageKeys.NOTES, JSON.stringify(DEFAULT_NOTES));
      }
      if (!localStorage.getItem(StorageKeys.SETTINGS)) {
        const defaultSettings = {
          theme: 'linen',
          sortBy: 'updated',
          editorMode: 'split', // 'edit', 'split', 'preview'
          fontSize: 'medium'
        };
        localStorage.setItem(StorageKeys.SETTINGS, JSON.stringify(defaultSettings));
      }
    } catch (e) {
      console.error('Failed to initialize local storage:', e);
    }
  },

  // Notes operations
  getNotes(includeDeleted = false) {
    try {
      const raw = localStorage.getItem(StorageKeys.NOTES);
      const notes = raw ? JSON.parse(raw) : [];
      if (includeDeleted) return notes;
      return notes.filter(n => !n.isDeleted);
    } catch (e) {
      console.error('Failed to load notes:', e);
      return [];
    }
  },

  getTrashNotes() {
    try {
      const raw = localStorage.getItem(StorageKeys.NOTES);
      const notes = raw ? JSON.parse(raw) : [];
      return notes.filter(n => n.isDeleted);
    } catch (e) {
      console.error('Failed to load trash notes:', e);
      return [];
    }
  },

  getNoteById(id) {
    const notes = this.getNotes(true);
    return notes.find(n => n.id === id) || null;
  },

  saveNote(note) {
    try {
      const notes = this.getNotes(true);
      const index = notes.findIndex(n => n.id === note.id);
      const now = new Date().toISOString();

      if (index >= 0) {
        notes[index] = {
          ...notes[index],
          ...note,
          updatedAt: now
        };
      } else {
        const newNote = {
          id: note.id || 'note-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
          title: note.title !== undefined ? note.title : 'Untitled Note',
          content: note.content !== undefined ? note.content : '',
          folderId: note.folderId || null,
          tags: Array.isArray(note.tags) ? note.tags : [],
          isPinned: !!note.isPinned,
          color: note.color || '#D97736',
          createdAt: note.createdAt || now,
          updatedAt: now,
          isDeleted: false
        };
        notes.unshift(newNote);
        localStorage.setItem(StorageKeys.NOTES, JSON.stringify(notes));
        return newNote;
      }

      localStorage.setItem(StorageKeys.NOTES, JSON.stringify(notes));
      return notes[index];
    } catch (e) {
      console.error('Failed to save note:', e);
      return null;
    }
  },

  deleteNote(id, soft = true) {
    try {
      let notes = this.getNotes(true);
      if (soft) {
        notes = notes.map(n => {
          if (n.id === id) {
            return { ...n, isDeleted: true, deletedAt: new Date().toISOString() };
          }
          return n;
        });
      } else {
        notes = notes.filter(n => n.id !== id);
      }
      localStorage.setItem(StorageKeys.NOTES, JSON.stringify(notes));
      return true;
    } catch (e) {
      console.error('Failed to delete note:', e);
      return false;
    }
  },

  restoreNote(id) {
    try {
      let notes = this.getNotes(true);
      notes = notes.map(n => {
        if (n.id === id) {
          return { ...n, isDeleted: false, deletedAt: null };
        }
        return n;
      });
      localStorage.setItem(StorageKeys.NOTES, JSON.stringify(notes));
      return true;
    } catch (e) {
      console.error('Failed to restore note:', e);
      return false;
    }
  },

  emptyTrash() {
    try {
      let notes = this.getNotes(true);
      notes = notes.filter(n => !n.isDeleted);
      localStorage.setItem(StorageKeys.NOTES, JSON.stringify(notes));
      return true;
    } catch (e) {
      console.error('Failed to empty trash:', e);
      return false;
    }
  },

  togglePin(id) {
    const note = this.getNoteById(id);
    if (!note) return null;
    return this.saveNote({ ...note, isPinned: !note.isPinned });
  },

  // Folders operations
  getFolders() {
    try {
      const raw = localStorage.getItem(StorageKeys.FOLDERS);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Failed to load folders:', e);
      return [];
    }
  },

  saveFolder(folder) {
    try {
      const folders = this.getFolders();
      const index = folders.findIndex(f => f.id === folder.id);
      if (index >= 0) {
        folders[index] = { ...folders[index], ...folder };
      } else {
        folders.push({
          id: folder.id || 'folder-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
          name: folder.name || 'New Folder',
          icon: folder.icon || 'folder',
          color: folder.color || '#B3541E'
        });
      }
      localStorage.setItem(StorageKeys.FOLDERS, JSON.stringify(folders));
      return folders;
    } catch (e) {
      console.error('Failed to save folder:', e);
      return [];
    }
  },

  deleteFolder(id) {
    try {
      let folders = this.getFolders();
      folders = folders.filter(f => f.id !== id);
      localStorage.setItem(StorageKeys.FOLDERS, JSON.stringify(folders));

      // Reassign notes in this folder to Uncategorized
      let notes = this.getNotes(true);
      notes = notes.map(n => {
        if (n.folderId === id) {
          return { ...n, folderId: null };
        }
        return n;
      });
      localStorage.setItem(StorageKeys.NOTES, JSON.stringify(notes));
      return true;
    } catch (e) {
      console.error('Failed to delete folder:', e);
      return false;
    }
  },

  // Aggregated tags
  getAllTags() {
    const notes = this.getNotes(false);
    const tagCount = {};
    notes.forEach(note => {
      if (Array.isArray(note.tags)) {
        note.tags.forEach(tag => {
          const clean = tag.trim().toLowerCase();
          if (clean) {
            tagCount[clean] = (tagCount[clean] || 0) + 1;
          }
        });
      }
    });
    return Object.entries(tagCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  },

  // Settings
  getSettings() {
    try {
      const raw = localStorage.getItem(StorageKeys.SETTINGS);
      return raw ? JSON.parse(raw) : { theme: 'linen', sortBy: 'updated', editorMode: 'split' };
    } catch (e) {
      return { theme: 'linen', sortBy: 'updated', editorMode: 'split' };
    }
  },

  saveSettings(settings) {
    try {
      const current = this.getSettings();
      const updated = { ...current, ...settings };
      localStorage.setItem(StorageKeys.SETTINGS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error('Failed to save settings:', e);
      return null;
    }
  },

  // Backup & Export / Import
  exportBackup() {
    const payload = {
      folio_version: '2.0',
      export_date: new Date().toISOString(),
      folders: this.getFolders(),
      notes: this.getNotes(true)
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `folio-notes-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  importBackup(jsonString, replace = false) {
    try {
      const data = JSON.parse(jsonString);
      if (!data || !Array.isArray(data.notes)) {
        throw new Error('Invalid backup file format');
      }

      if (replace) {
        localStorage.setItem(StorageKeys.NOTES, JSON.stringify(data.notes));
        if (Array.isArray(data.folders)) {
          localStorage.setItem(StorageKeys.FOLDERS, JSON.stringify(data.folders));
        }
      } else {
        // Merge notes
        const currentNotes = this.getNotes(true);
        const currentIds = new Set(currentNotes.map(n => n.id));
        data.notes.forEach(importedNote => {
          if (!currentIds.has(importedNote.id)) {
            currentNotes.push(importedNote);
          } else {
            // Give it a new ID if conflict
            currentNotes.push({ ...importedNote, id: 'note-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4) });
          }
        });
        localStorage.setItem(StorageKeys.NOTES, JSON.stringify(currentNotes));

        // Merge folders
        if (Array.isArray(data.folders)) {
          const currentFolders = this.getFolders();
          const folderNames = new Set(currentFolders.map(f => f.name.toLowerCase()));
          data.folders.forEach(f => {
            if (!folderNames.has(f.name.toLowerCase())) {
              currentFolders.push(f);
            }
          });
          localStorage.setItem(StorageKeys.FOLDERS, JSON.stringify(currentFolders));
        }
      }
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      throw e;
    }
  },

  // Export single note
  exportNoteAsMarkdown(note) {
    if (!note) return;
    const content = `# ${note.title || 'Untitled'}\n\n` +
      (note.tags && note.tags.length ? `Tags: ${note.tags.map(t => '#' + t).join(' ')}\n\n` : '') +
      (note.content || '');
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeTitle = (note.title || 'note').replace(/[^a-z0-9_\-\u00C0-\u024F]/gi, '_').toLowerCase();
    a.href = url;
    a.download = `${safeTitle}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  exportNoteAsPlainText(note) {
    if (!note) return;
    const content = `${note.title || 'Untitled'}\n\n${note.content || ''}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeTitle = (note.title || 'note').replace(/[^a-z0-9_\-\u00C0-\u024F]/gi, '_').toLowerCase();
    a.href = url;
    a.download = `${safeTitle}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};
