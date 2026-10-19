// Note Templates for quick structured writing
const NOTE_TEMPLATES = [
  {
    id: 'meeting',
    name: 'Meeting Minutes & Action Items',
    icon: 'notebook',
    description: 'Attendees, discussion topics, decisions made, and assigned next steps.',
    folderId: 'folder-work',
    tags: ['meeting', 'work', 'action-items'],
    title: '🤝 Meeting: [Topic / Project Name]',
    content: `# Meeting: [Topic / Project Name]

**Date:** ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}  
**Attendees:** [Name 1], [Name 2], [Name 3]  
**Goal:** [One-sentence objective of this meeting]

---

### Key Discussion Points
- **Point 1:** Context and background details.
- **Point 2:** Trade-offs, risks, and alternatives discussed.
- **Point 3:** Open questions requiring follow-up.

### Decisions Made
- [x] Agreed on target timeline and scope for next milestone.
- [x] Confirmed technical approach.

### Action Items & Deliverables

| Task | Owner | Due Date | Status |
| :--- | :--- | :--- | :--- |
| Draft documentation specs | Alex | Friday | ⏳ In Progress |
| Review PR feedback | Jordan | Wednesday | ⏳ Pending |
| Schedule follow-up sync | Team | Next Monday | ⏳ Planned |

---

### Notes & Freeform Thoughts
> Write any additional context or rough notes here during the conversation.`
  },
  {
    id: 'journal',
    name: 'Daily Reflection & Journal',
    icon: 'coffee',
    description: 'Morning intentions, gratefulness, highlights, and evening thoughts.',
    folderId: 'folder-personal',
    tags: ['journal', 'daily', 'reflection'],
    title: `📖 Daily Journal — ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
    content: `# Daily Reflection: ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}

### ☀️ Morning Mindset
- **Three Things I am Grateful For:**
  1. 
  2. 
  3. 
- **Top Priority Today:** [The single thing that would make today a success]

---

### 🌿 Daily Flow & Habits
- [ ] 20-minute morning walk or movement
- [ ] 2 liters of water
- [ ] Deep focus block (no notifications)
- [ ] Evening reading

---

### 🌙 Evening Wind-down
- **What went well today?**
  
- **What was an unexpected spark or moment of joy?**
  
- **Note for tomorrow:**
  > Remember to take deep breaths and give yourself time to think.`
  },
  {
    id: 'project',
    name: 'Project Plan & Milestone Tracker',
    icon: 'template',
    description: 'Scope, objectives, tech stack, milestones, and release checklist.',
    folderId: 'folder-work',
    tags: ['project', 'planning', 'milestones'],
    title: '🚀 Project: [Project Title]',
    content: `# Project: [Project Title]

### 🎯 Purpose & Overview
Brief explanation of what this project accomplishes, who it helps, and why it matters.

---

### 📌 Core Specifications
- **Target Platform:** Browser / Desktop / Mobile
- **Key Constraints:** Fast load time, offline-first, zero clutter
- **Success Metric:** [Quantifiable metric or feeling of accomplishment]

### 🛠️ Execution Checklist
- [ ] Phase 1: Research and structural layout
- [ ] Phase 2: Core feature implementation
- [ ] Phase 3: Stress testing and edge cases
- [ ] Phase 4: Polish typography, colors, and responsive views
- [ ] Phase 5: Documentation & deployment

### 💡 Unsorted Ideas & Brain Dump
- Idea 1...
- Idea 2...`
  },
  {
    id: 'book',
    name: 'Book & Essay Summary',
    icon: 'tree',
    description: 'Summary, key takeaways, memorable quotes, and practical application.',
    folderId: 'folder-ideas',
    tags: ['reading', 'books', 'notes'],
    title: '📚 Book Notes: [Book Title]',
    content: `# Book Notes: [Book Title]

**Author:** [Author Name]  
**Genre:** Non-fiction / Craft / Philosophy  
**Rating:** ⭐⭐⭐⭐⭐  
**Date Finished:** ${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}

---

### 🧠 The Big Idea (in 1-2 Sentences)
What is the core thesis of this work?

### 🔑 Key Takeaways
1. **Core Concept 1:** Explanation and personal reaction.
2. **Core Concept 2:** Explanation and personal reaction.
3. **Core Concept 3:** Explanation and personal reaction.

---

### 💬 Favorite Quotes & Passages
> *"Type an unforgettable passage from the book here."*  
> — Page XX

### 🛠️ How I Will Apply This
- [ ] Change this specific daily habit
- [ ] Experiment with this concept in my next project`
  }
];
