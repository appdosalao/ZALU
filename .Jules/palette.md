## 2024-10-27 - Icon-only buttons lacking ARIA labels
**Learning:** Found several icon-only buttons using shadcn/ui `size="icon"` across the application (e.g., in FornecedoresList, CompraForm, VendaForm, AuditoriaProblemasTable) that lack descriptive `aria-label` or `title` attributes, which harms accessibility.
**Action:** When adding or reviewing icon-only buttons, always ensure they have descriptive `aria-label` and `title` attributes in Portuguese.
