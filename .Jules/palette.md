## 2024-07-24 - Missing Accessibility Attributes on Icon-Only Buttons
**Learning:** Found multiple instances across the components (e.g., `FornecedoresList.tsx`, `CompraForm.tsx`, `VendaForm.tsx`) where icon-only buttons lack `aria-label` and `title` attributes. This pattern suggests a systemic omission in the usage of the shadcn/ui button component when it renders just an icon.
**Action:** Always add descriptive `aria-label` (for screen readers) and `title` (for native tooltips) attributes in Portuguese to any button that uses `size="icon"` or only contains an icon.
