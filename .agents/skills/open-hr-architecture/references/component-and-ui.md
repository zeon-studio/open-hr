# Component Architecture & UI Standards

Open HR uses a component structure built on **Base UI primitives** (`@base-ui/react`), **shadcn/ui conventions**, and **Tailwind CSS v4** with `tailwind-bootstrap-grid`.

> [!IMPORTANT]
> **Base UI, NOT Radix:** This project uses `@base-ui/react` primitives under the hood for shadcn/ui components. **Do NOT install or import `@radix-ui/*` packages.**

---

## 1. Component Placement Hierarchy

Components are organized into clear layers under `src/layouts/`:

```text
src/layouts/
├── components/
│   ├── ui/                    # Base UI / shadcn primitives (@/components/ui/*)
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   ├── toast.tsx
│   │   └── ...
│   ├── avatar.tsx             # Shared application components (@/components/*)
│   ├── confirmation-popup.tsx
│   ├── copy-text.tsx
│   ├── file-manager.tsx
│   ├── gravatar.tsx
│   ├── icons.tsx
│   ├── loader.tsx
│   ├── logo.tsx
│   ├── pagination.tsx
│   ├── search-box.tsx
│   └── user-info.tsx
├── partials/                  # Persistent layout chrome (@/partials/*)
│   ├── header.tsx             # Top navigation bar
│   ├── sidebar.tsx            # Left collapsable sidebar navigation
│   ├── providers.tsx          # Client context providers
│   └── edit-from.tsx          # Modal drawer form wrapper
└── helpers/                   # Developer and layout helpers (@/helpers/*)
    ├── clear-cache.tsx        # Cache-clearing utility button
    └── tw-size-indicator.tsx  # Responsive screen size indicator in dev
```

---

## 2. Base UI Primitives (`@/components/ui/*`)

All interactive elements must utilize the primitives in `@/components/ui/` to ensure consistent accessibility, keyboard navigation, and styling:

### Available Primitives

- **Layout & Structure:** `card`, `separator`, `sheet`, `table`, `tabs`, `accordion`
- **Inputs & Forms:** `input`, `textarea`, `select`, `multi-select`, `password-input`, `input-otp`, `switch`, `label`
- **Overlays & Dialogs:** `dialog`, `dropdown-menu`, `popover`
- **Feedback & Pickers:** `toast`, `badge`, `calendar`, `event-calendar`, `file-uploader`

### Composition Example

```tsx
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ConfirmActionModal({ onConfirm }: { onConfirm: () => void }) {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Open Modal</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Operation</DialogTitle>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="destructive" onClick={onConfirm}>
            Proceed
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 3. Styling & Theming (Tailwind CSS v4)

Open HR uses Tailwind CSS v4 CSS-first configuration:

### Entry Point (`src/styles/main.css`)

```css
@import "tailwindcss";
@plugin "@tailwindcss/forms";
@plugin "tailwindcss-animate";
@plugin "tailwind-bootstrap-grid";

@import "./theme.css";
@import "./variables.css";

@layer base {
  @import "./base.css";
}

@layer components {
  @import "./components.css";
}
```

### Grid System (`tailwind-bootstrap-grid`)

The project utilizes Bootstrap 5 grid utility classes seamlessly integrated into Tailwind CSS. When laying out forms, cards, and dashboards, use standard grid classes:

- **Rows:** `<div className="row gx-3">`
- **Columns:** `<div className="col-12 lg:col-6">`
- **Containers:** `<div className="container">`

### Semantic Variables (`src/styles/variables.css`)

Colors and radii are governed by semantic CSS tokens:

- Backgrounds: `bg-background`, `bg-light`, `bg-white`, `bg-card`
- Text: `text-dark`, `text-text-light`, `text-muted-foreground`
- Theme Accents: `bg-primary`, `text-primary`, `border-border`
