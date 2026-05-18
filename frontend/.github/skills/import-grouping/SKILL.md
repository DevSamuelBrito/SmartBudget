---
name: import-grouping
description: "Use when editing component files to keep imports grouped by theme, with one blank line between groups."
---
# Import Grouping
When editing React or TSX component files:
- Group imports by concern/theme.
- Keep one blank line between each group.
- Put the first import group at the top without extra spacing above it.
- Add a single-line comment label before each group, for example:
  - `// next` for Next.js imports
  - `// external` for third-party libraries
  - `// ui` for shadcn/ui components
  - `// components` for local shared components
  - `// types | icons | utils` for types, icons and utilities
- Prefer a consistent order:
  1. framework imports (next)
  2. external libraries
  3. shared UI components (shadcn)
  4. local components
  5. types, icons, utilities
- Keep imports alphabetized inside each group when practical.
- Do not mix unrelated imports in the same block.

Apply this style whenever a component file is touched and imports need cleanup.