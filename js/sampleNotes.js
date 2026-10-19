// Initial sample data to provide immediate value and demonstrate all features
const DEFAULT_FOLDERS = [
  { id: 'folder-personal', name: 'Personal & Life', icon: 'coffee', color: '#B3541E' },
  { id: 'folder-work', name: 'Work & Projects', icon: 'notebook', color: '#3E6B89' },
  { id: 'folder-ideas', name: 'Ideas & Reading', icon: 'tree', color: '#4D7C5D' },
  { id: 'folder-recipes', name: 'Journal & Recipes', icon: 'template', color: '#9B5A36' }
];

const DEFAULT_NOTES = [
  {
    id: 'note-welcome',
    title: '🌿 Welcome to Folio Notes',
    content: `# Welcome to Folio Notes

A quiet, tactile, and human-friendly space for your thoughts, plans, and discoveries. Designed without loud neon gradients, distractions, or clutter.

### ✨ What you can do here:

- **Create, Edit & Delete**: Quick notes with live auto-save and rich markdown.
- **Pin Important Notes**: Keep your daily priorities or core reference notes pinned at the very top.
- **Organize with Folders & Tags**: Categorize into notebooks or tag freely with \`#planning\`, \`#recipes\`, \`#ideas\`.
- **Fast Search**: Search across both titles and note contents in real-time.
- **Interactive Checklists**: Click on the checkboxes directly in the preview to check them off!
- **Persistent Storage**: All notes stay securely right here in your browser's local storage.
- **Export & Backup**: One-click download as Markdown (\`.md\`), Plain text, or a complete JSON backup to restore anytime.

---

### 📝 Interactive To-Do List

- [x] Explore the sidebar folders and tags
- [x] Notice the warm paper & earthy theme
- [ ] Try creating your first new note (\`Ctrl + Alt + N\` or the **+ New Note** button)
- [ ] Switch between **Edit**, **Split**, and **Preview** modes using the toolbar
- [ ] Try searching for *"sourdough"* or *"strategy"* in the search bar above

> *"Writing is thinking on paper. When you write things down, the mind becomes calm and focused."*

Feel free to edit this note or delete it when you are ready!`,
    folderId: 'folder-personal',
    tags: ['welcome', 'guide', 'quickstart'],
    isPinned: true,
    color: '#D97736',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    isDeleted: false
  },
  {
    id: 'note-strategy',
    title: '📐 Q4 Product Architecture & Roadmap',
    content: `# Q4 Product Architecture & Roadmap

**Lead:** Design & Engineering Guild  
**Status:** In Progress 🚀  
**Target Window:** Oct 24 – Dec 15

---

### Core Objectives
1. Build a zero-latency, offline-first notes engine.
2. Maintain tactile, distraction-free typography with responsive split editing.
3. Guarantee user privacy with local-only storage.

### Priority Milestones

| Milestone | Target | Owner | Status |
| :--- | :--- | :--- | :--- |
| **Search Engine** | Oct 28 | Sarah | ✅ Completed |
| **Folder & Tags Tree** | Nov 04 | Alex | 🟡 Review |
| **JSON Backup & Restore** | Nov 12 | Chris | ⏳ Next Up |
| **Print & Markdown Export** | Nov 20 | Jordan | ⏳ Planned |

### Key Architectural Decision
\`\`\`javascript
// Single source of truth with debounced persistence
const autoSaveEngine = {
  debounceMs: 300,
  storageKey: 'folio_notes_store_v1',
  persist: (snapshot) => {
    localStorage.setItem(storageKey, JSON.stringify(snapshot));
  }
};
\`\`\`

### Open Discussion Points
- [x] Finalize warm earthy color palette (no artificial AI purples)
- [ ] Conduct tablet & mobile layout responsiveness verification
- [ ] Test large data export (1000+ notes benchmark)`,
    folderId: 'folder-work',
    tags: ['work', 'strategy', 'roadmap'],
    isPinned: true,
    color: '#3E6B89',
    createdAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    isDeleted: false
  },
  {
    id: 'note-sourdough',
    title: '🍞 Country Sourdough Loaf (75% Hydration)',
    content: `# Country Sourdough Loaf

A dependable weekend country bread recipe with a deep blistered crust and open, custardy crumb.

### Baker's Formula (2 Loaves)
- **Bread Flour (Unbleached):** 800g (80%)
- **Whole Wheat Flour:** 200g (20%)
- **Water (Room temp ~24°C):** 750g (75%)
- **Active Sourdough Starter (Levain):** 200g (20%)
- **Fine Sea Salt:** 20g (2%)

---

### Schedule & Process Checklist

- [x] **08:00 AM** – Feed starter (1:2:2 ratio, warm spot)
- [x] **12:30 PM** – Autolyse flour + water for 45 minutes
- [x] **01:15 PM** – Add active starter & salt; dimple and fold
- [ ] **01:45 PM** – First stretch and fold (bulk fermentation starts)
- [ ] **02:30 PM** – Second coil fold
- [ ] **03:15 PM** – Third coil fold (observe dough volume +30%)
- [ ] **05:30 PM** – Preshape into rounds; rest on bench 20 min
- [ ] **06:00 PM** – Final shape into bannetons & overnight cold retard in fridge
- [ ] **Next Morning** – Bake in Dutch oven at 240°C (20 min lid on, 20 min lid off)

> *Baker's Tip: Don't rush bulk fermentation. Look for rounded domed edges and bubbly aerated texture rather than just watching the clock.*`,
    folderId: 'folder-recipes',
    tags: ['recipes', 'baking', 'weekend'],
    isPinned: false,
    color: '#E09F3E',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    isDeleted: false
  },
  {
    id: 'note-reading-list',
    title: '📚 Autumn Reading & Ideas Journal',
    content: `# Autumn Reading & Ideas Journal

Notes on essays, books, and craft articles gathered throughout the season.

### Current Reading Stack
1. **The Nature of Order** by *Christopher Alexander*
   - Deep insights into how physical architecture creates feeling of life.
   - Quotable: *"Wholeness is not the absence of complexity, but harmony among parts."*
2. **Draft No. 4: On the Writing Process** by *John McPhee*
   - Remarkable breakdown of structural outlines and revisions.
3. **Designing Design** by *Kenya Hara*
   - The philosophy of white space, emptiness, and tactile warmth.

---

### Ideas for Future Projects
- [x] Build an offline, browser-native note app with zero friction
- [ ] Write a 1,000-word essay on physical paper stationery vs digital apps
- [ ] Create a personal recipe book printed on textured linen cardstock

### Quick Note Snippet
> *"Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away."*  
> — Antoine de Saint-Exupéry`,
    folderId: 'folder-ideas',
    tags: ['reading', 'books', 'philosophy'],
    isPinned: false,
    color: '#4D7C5D',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    isDeleted: false
  }
];
