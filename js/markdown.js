// Lightweight, robust Markdown Parser for Folio Notes
// Supports GFM elements, syntax highlighting containers, and interactive checkboxes
const Markdown = {
  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  // Parse markdown text into sanitized HTML
  render(md) {
    if (!md) return '<p class="placeholder-text">Empty note. Start typing...</p>';

    // First preserve code blocks
    const codeBlocks = [];
    let text = md.replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/gi, (match, lang, code) => {
      const id = `__CODE_BLOCK_${codeBlocks.length}__`;
      codeBlocks.push({ lang: lang.trim(), code: this.escapeHtml(code) });
      return id;
    });

    // Preserve inline code
    const inlineCodes = [];
    text = text.replace(/`([^`\n]+)`/g, (match, code) => {
      const id = `__INLINE_CODE_${inlineCodes.length}__`;
      inlineCodes.push(this.escapeHtml(code));
      return id;
    });

    // Escape remaining HTML for security
    text = this.escapeHtml(text);

    // Headers
    text = text.replace(/^###### (.*$)/gim, '<h6>$1</h6>');
    text = text.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
    text = text.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    text = text.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    text = text.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    text = text.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Horizontal Rule
    text = text.replace(/^(-{3,}|\*{3,}|_{3,})$/gim, '<hr class="markdown-divider">');

    // Blockquotes
    text = text.replace(/^\&gt;\s?(.*)$/gim, '<blockquote>$1</blockquote>');

    // Clean consecutive blockquotes into one
    text = text.replace(/<\/blockquote>\n<blockquote>/g, '<br>');

    // Interactive Checklists (To-do lists)
    let taskCounter = 0;
    text = text.replace(/^(\s*)[-*]\s+\[([ xX])\]\s+(.*)$/gim, (match, indent, checked, label) => {
      const isChecked = checked.toLowerCase() === 'x';
      const index = taskCounter++;
      return `<li class="task-item ${isChecked ? 'is-completed' : ''}" data-task-index="${index}">
        <label class="task-checkbox-label">
          <input type="checkbox" class="interactive-checkbox" data-task-index="${index}" ${isChecked ? 'checked' : ''}>
          <span class="task-text">${label}</span>
        </label>
      </li>`;
    });

    // Unordered lists (- or *)
    text = text.replace(/^(\s*)[-*]\s+([^\n]+)$/gim, (match, indent, content) => {
      // Don't match if it's already a task-item
      if (content.startsWith('<label class="task-checkbox-label"')) {
        return match;
      }
      return `<li>${content}</li>`;
    });

    // Ordered lists (1. 2. 3.)
    text = text.replace(/^\d+\.\s+([^\n]+)$/gim, '<li class="ordered-item">$1</li>');

    // Wrap consecutive <li> into <ul> or <ol>
    text = text.replace(/(<li class="task-item[\s\S]*?<\/li>\n?)+/g, '<ul class="task-list">$&</ul>');
    text = text.replace(/(<li class="ordered-item">[\s\S]*?<\/li>\n?)+/g, '<ol class="markdown-ol">$&</ol>');
    text = text.replace(/(<li>[^\n]+<\/li>\n?)+/g, '<ul class="markdown-ul">$&</ul>');

    // Clean up internal tags
    text = text.replace(/class="ordered-item"/g, '');

    // Tables
    text = text.replace(/((?:\|[^\n]+\|\r?\n)+)/g, (tableMatch) => {
      const rows = tableMatch.trim().split(/\r?\n/).filter(r => r.trim());
      if (rows.length < 2) return tableMatch;

      // Check if row 1 is delimiter: |---|---|
      const isDelimiter = (row) => /^\|(\s*:?-+:?\s*\|)+$/.test(row);
      if (!isDelimiter(rows[1])) return tableMatch;

      const parseRow = (row) => row.split('|').slice(1, -1).map(cell => cell.trim());
      const headers = parseRow(rows[0]);
      const dataRows = rows.slice(2);

      let tableHtml = '<div class="table-wrapper"><table class="markdown-table"><thead><tr>';
      headers.forEach(h => {
        tableHtml += `<th>${h}</th>`;
      });
      tableHtml += '</tr></thead><tbody>';

      dataRows.forEach(row => {
        const cells = parseRow(row);
        tableHtml += '<tr>';
        cells.forEach(c => {
          tableHtml += `<td>${c}</td>`;
        });
        tableHtml += '</tr>';
      });
      tableHtml += '</tbody></table></div>';
      return tableHtml;
    });

    // Bold, Italic, Strikethrough
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__(.*?)__/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    text = text.replace(/_(.*?)_/g, '<em>$1</em>');
    text = text.replace(/~~(.*?)~~/g, '<del>$1</del>');

    // Markdown Links: [label](url)
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="markdown-link">$1</a>');

    // Paragraphs: Wrap standalone lines not already wrapped in block elements
    const lines = text.split(/\n\n+/);
    text = lines.map(block => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (/^<(h[1-6]|ul|ol|blockquote|div|hr|table|pre)/i.test(trimmed)) {
        return trimmed;
      }
      return `<p>${trimmed.replace(/\n/g, '<br>')}</p>`;
    }).join('\n');

    // Restore inline codes
    inlineCodes.forEach((code, idx) => {
      text = text.replace(`__INLINE_CODE_${idx}__`, `<code class="inline-code">${code}</code>`);
    });

    // Restore code blocks
    codeBlocks.forEach((b, idx) => {
      const langClass = b.lang ? `language-${b.lang}` : '';
      const langBadge = b.lang ? `<span class="code-badge">${b.lang}</span>` : '';
      text = text.replace(`__CODE_BLOCK_${idx}__`,
        `<div class="code-block-wrapper">${langBadge}<pre class="code-block"><code class="${langClass}">${b.code}</code></pre></div>`);
    });

    return text;
  },

  // Toggle a checkbox in the raw markdown at given index
  toggleCheckboxAt(markdown, targetIndex) {
    let currentIndex = 0;
    return markdown.replace(/^(\s*[-*]\s+\[)([ xX])(\]\s+.*)$/gm, (match, prefix, state, suffix) => {
      if (currentIndex === targetIndex) {
        currentIndex++;
        const newState = state.toLowerCase() === 'x' ? ' ' : 'x';
        return `${prefix}${newState}${suffix}`;
      }
      currentIndex++;
      return match;
    });
  },

  // Calculate stats: words, chars, lines, read time, tasks
  getStats(content = '', title = '') {
    const fullText = `${title}\n${content}`;
    const cleanText = fullText.replace(/[#*`~>\[\]\(\)\-_|]/g, ' ').trim();
    const words = cleanText ? cleanText.split(/\s+/).filter(Boolean).length : 0;
    const chars = fullText.length;
    const lines = fullText ? fullText.split(/\r?\n/).length : 0;
    const readMinutes = Math.max(1, Math.ceil(words / 200));

    // Tasks calculation
    const taskMatches = content.match(/^(\s*[-*]\s+\[[ xX]\]\s+.*)$/gm) || [];
    const totalTasks = taskMatches.length;
    const completedTasks = (content.match(/^(\s*[-*]\s+\[[xX]\]\s+.*)$/gm) || []).length;
    const taskPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      words,
      chars,
      lines,
      readTime: words === 0 ? '0 min' : `${readMinutes} min read`,
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        percent: taskPercent
      }
    };
  }
};
