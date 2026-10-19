# 🌿 Smart Note Taking Application (Folio Notes)

A quiet, tactile, and responsive note-taking application designed for calm focus. Built with an organic, human-friendly aesthetic—completely free of cliché neon AI gradients.

---

## ✨ Features Overview

### 1. 📝 Full Note Management (CRUD)
- **Create**: One-click note creation via `+ New Note` button, keyboard shortcut (`Ctrl+Alt+N`), or smart templates.
- **Edit**: Split-screen live markdown editor, formatted rich preview, and instant source editing.
- **Delete**: Soft-delete into **Trash** (recycle bin) with safe restoration, or permanent deletion with confirmation.
- **Duplicate**: Clone any note in one click.

### 2. 🔍 Instant Title & Content Search
- Real-time search across note **titles**, **body content**, and **tags**.
- Live keyword highlighting in note cards.
- Quick match counter and one-click search clear (`Esc` or `✕`).

### 3. 📁 Organize with Folders & Tags
- **Folders**:
  - Organize notes into custom notebooks (e.g. *Personal*, *Work*, *Recipes*, *Ideas*).
  - Create new folders with custom accent colors.
  - Quick note count indicators in the sidebar.
  - Easily reassign any note to a folder from the editor.
- **Tags**:
  - Add multiple tags to notes via `#tag` chips.
  - Click any tag in the sidebar tag cloud to filter notes instantly.
  - Inline tag entry with autocomplete and instant removal.

### 4. 📌 Pin Important Notes
- Pin critical notes with one click (`Ctrl+P` or pin button).
- Pinned notes remain prominently at the top of the notes pane with a warm amber pin indicator.

### 5. 💾 Browser-Persistent Storage
- **Automatic Auto-save**: Debounced background persistence into `localStorage` with a live "Saved" status indicator.
- **JSON Backup & Restore**: Export all notes and folders as a timestamped JSON file to back up or migrate across devices.
- **Single Note Export**: Download any note as standard Markdown (`.md`) or Plain Text (`.txt`).
- **Print / PDF Friendly**: Built-in print stylesheet cleans away all UI chrome for crisp physical paper printing.

### 6. 🎨 Tactile, Non-AI Gradient Color Themes
Thoughtfully styled to look like physical paper, linen notebooks, and warm stationery:
- **Warm Linen & Terracotta** (Default): Cream parchment, warm earthy terracotta accents.
- **Forest Sage**: Soft muted moss green, relaxing and natural.
- **Nordic Slate**: Clean architectural denim-slate and warm bronze.
- **Warm Walnut Dark**: Deep espresso charcoal for cozy night reading without harsh neon purples.

### 7. 💡 Smart Note Features
- **Interactive Checklists**: Checkboxes inside the rendered markdown can be clicked directly to toggle `- [ ]` and `- [x]` in the raw markdown note!
- **Task Progress Meter**: Real-time progress bar showing task completion percentage (e.g. `4/7 done (57%)`).
- **Reading Time & Word Count**: Instant metrics for words, characters, and estimated read time.
- **Smart Note Templates**:
  - Meeting Minutes & Action Items (with tables)
  - Daily Reflection & Journal
  - Project Plan & Milestone Tracker
  - Book & Essay Summary
- **Note Color Accent Tabs**: Personalize notes with warm color badges (Terracotta, Sage, Slate, Ochre, Rust, Plum).
- **Distraction-Free Modes**: Toggle between **Edit Only**, **Split Screen**, and **Preview Only**.

---

## 🚀 How to Run

### Method 1: Direct File Open (Zero setup required)
Simply double-click [`index.html`](index.html) to open the app directly in your web browser (Google Chrome, Microsoft Edge, Firefox, Safari, etc.).

### Method 2: Python Local Server
If you prefer running a local server:
```powershell
py serve.py
```
This automatically starts a local server at `http://127.0.0.1:8000` and launches your default browser.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + Alt + N` | Create a new note |
| `Ctrl + F` | Focus the search bar |
| `Ctrl + S` | Force save active note |
| `Ctrl + P` | Pin / unpin active note |
| `Ctrl + Delete` | Move note to trash |
| `Ctrl + E` | Toggle split / edit view mode |
| `Ctrl + B` | Bold selected text |
| `Ctrl + I` | Italicize selected text |
| `?` | Open keyboard shortcuts guide |
| `Esc` | Close open dialog or clear search |

---

## 📂 Project Structure

```
SmartNoteTakingApplication/
├── index.html           # Main semantic HTML structure & modals
├── serve.py             # Optional Python static server with auto-launch
├── README.md            # Documentation and guide
├── css/
│   ├── styles.css       # Core layout, responsive styles, markdown typography
│   └── themes.css       # Non-AI earthy palettes (Linen, Sage, Slate, Walnut)
├── js/
│   ├── app.js           # Main application controller & event routing
│   ├── storage.js       # Persistent browser storage engine & export/import
│   ├── markdown.js      # GFM parser, interactive checklists & text metrics
│   ├── templates.js     # Structured templates (Meeting, Journal, etc.)
│   └── sampleNotes.js   # Initial warm seed notes showcasing features
└── assets/
    ├── favicon.svg      # Clean notebook SVG tab icon
    └── icons.js         # Crisp, self-contained SVG icon library
```
