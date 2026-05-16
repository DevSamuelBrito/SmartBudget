---
name: import-grouping
description: "Use when editing component files to keep imports grouped by theme, with one blank line between groups."
---

# Import Grouping

When editing React or TSX component files:

- Group imports by concern/theme.
- Keep one blank line between each group.
- Put the first import group at the top without extra spacing above it.
- Prefer a consistent order:
  - framework imports
  - external libraries
  - shared UI components
  - local components
  - types, icons, utilities
- Keep imports alphabetized inside each group when practical.
- Do not mix unrelated imports in the same block.

Apply this style whenever a component file is touched and imports need cleanup.