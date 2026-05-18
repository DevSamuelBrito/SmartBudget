---
name: import-grouping
description: "Use when editing component files to keep imports grouped by theme, with one blank line between groups."
---

# Import Grouping

When editing React or TSX component files:

- Group imports by concern/theme.
- Always keep one blank line between each group, no exceptions.
- Put the first import group at the top without extra spacing above it.
- Add a single-line comment label before each group following this exact order:
  1. `// react` — React core imports (react, react-dom)
  2. `// next` — Next.js imports (next, next/navigation, next/image, etc)
  3. `// libs` — Third-party libraries (react-query, zod, axios, date-fns, etc)
  4. `// components` — Local and shared components
  5. `// hooks` — Custom hooks
  6. `// apis` — API calls and service functions
  7. `// types` — Types, interfaces and enums
  8. `// utils` — Utility functions and constants

- Skip a group entirely if there are no imports for it, do not add an empty comment.
- Keep imports alphabetized inside each group when practical.
- Do not mix unrelated imports in the same block.
- Always apply one blank line between groups, even if only one import exists in a group.

Apply this style whenever a component file is touched and imports need cleanup.
