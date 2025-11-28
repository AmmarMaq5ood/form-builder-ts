# Form Builder (React + TypeScript)

A polished drag-and-drop form builder built with React 19, TypeScript, Vite, Tailwind CSS utilities, `@dnd-kit`, and Framer Motion. It gives you a live, themeable workspace for composing forms, previewing their behavior, and exporting/importing JSON definitions you can wire up to any backend.

## Highlights

- **Drag-and-drop builder:** Rich element library with search, categories, click-to-add, and drag-and-drop powered by `@dnd-kit`.
- **Configurable cards:** Each field exposes contextual settings (labels, defaults, validation, helper text, option management, etc.) inside animated cards.
- **Live preview pane:** Resizable split view with zoom, fit-to-width controls, and instant validation feedback driven by the actual React form markup.
- **Save & load JSON:** Persist the entire configuration (including default responses) as a portable JSON file and reload it later.
- **Theme system:** 20+ curated themes stored in localStorage and driven by CSS custom properties, plus a UI picker for switching skins.
- **Modern UX details:** Keyboard shortcut (`Ctrl/Cmd + K`) to toggle the palette, hover tips, auto-scrolling during drag, and subtle animations throughout.

## Tech Stack

- React 19 + TypeScript, bundled with Vite 7
- Tailwind CSS for utility classes plus custom CSS tokens (`src/index.css`)
- `@dnd-kit` for drag-and-drop interactions
- Framer Motion for animations
- Lucide React icons
- FileSaver for JSON export
- ESLint + TypeScript ESLint for linting

## Getting Started

### Prerequisites

- Node.js **18.18+** (or any active LTS release) and npm.
- (Optional) pnpm or yarn if you prefer another package manager, but scripts assume npm.

### Installation & Local Development

```bash
npm install
npm run dev
```

Visit the URL printed by Vite (defaults to http://localhost:5173) to use the builder.

### Available Scripts

- `npm run dev` – start the Vite dev server with HMR.
- `npm run build` – type-check (`tsc -b`) then create a production bundle in `dist/`.
- `npm run preview` – serve the production build locally.
- `npm run lint` – run ESLint using the repo configuration.

## Project Structure

```
form-builder-ts/
├─ public/                 # Static assets served as-is
├─ src/
│  ├─ components/
│  │  ├─ FormBuilder/      # Main workspace shell + drag/drop logic
│  │  ├─ FormAddElements/  # Palette + filtering + drag handles
│  │  ├─ FormElements/     # Property editor cards
│  │  ├─ FormPreview/      # Live preview, save/load JSON actions
│  │  └─ ThemeSwitcher/    # Theme picker UI
│  ├─ context/ThemeContext.tsx # Theme registry + persistence
│  ├─ App.tsx              # Page layout + header
│  ├─ main.tsx             # React entry
│  └─ index.css            # Tailwind directives + design tokens
├─ vite.config.ts
└─ README.md
```

## Usage Guide

1. **Add elements:** Open the Element Library (left panel) and either click an item or drag it into the builder canvas. Use the category chips or search input to narrow the list. Shortcut: `Ctrl/Cmd + K` toggles the library.
2. **Reorder & group:** Grab the drag handle on any element card to reorder it. Auto-scroll keeps long forms manageable, and cards can collapse for a compact view.
3. **Configure fields:** Each card surfaces context-aware inputs for labels, placeholders, validation, helper copy, option sets, default values, etc. Checkbox/radio/select fields support dynamic option management with add/remove controls.
4. **Preview instantly:** The right-hand preview reflects every change, including validation logic and helper text. Use zoom controls or “Fit” to test responsiveness, and resize the split view via the center handle.
5. **Save or load JSON:** At the bottom of the preview pane you can:
   - **Save JSON:** Downloads `form.json` (or `{formName}.json` if you fill the “Form Name” field) containing both metadata and current default values.
   - **Load JSON:** Imports a previously exported file and repopulates both builder cards and preview values.
6. **Submit prototype form:** The previewed form fires `handleSubmit` (currently logging to the console and showing an alert). Replace this logic when wiring to an API or persistence layer.

## Theme System

- The theme picker (`src/components/ThemeSwitcher/ThemeSwitcher.tsx`) queries the registry defined in `src/context/ThemeContext.tsx`.
- Each theme carries semantic tokens (`--app-bg`, `--panel-bg`, `--accent`, etc.) that drive all surfaces via CSS custom properties declared in `src/index.css`.
- The chosen theme stores itself in `localStorage` under `form-builder-theme`, so the workspace opens exactly how the user left it.
- To add a new palette, append a `ThemeMeta` entry in `ThemeContext.tsx` and provide a swatch plus the color tokens. The UI will automatically render it.

## Extending the Builder

- **New element types:** Add a descriptor to `ELEMENT_LIBRARY` inside `FormAddElements.tsx`, then extend the logic in `FormBuilder.tsx`, `FormElements.tsx`, and `FormPreview.tsx` to describe how the element behaves, how it is configured, and how it is rendered.
- **Persisting forms remotely:** Replace the placeholder submit handler in `FormBuilder` or `FormPreview` with API calls (REST, GraphQL, etc.), and forward the `elements` array to your backend.
- **Styling changes:** Tailwind is available for quick iterations. For substantial theming, prefer editing/adding CSS custom properties so all components stay in sync.
- **Integrations:** The exported JSON structure mirrors the internal `FormElement` TypeScript types, making it straightforward to hydrate another React app or a server-rendered template.

## Deployment

1. Run `npm run build`.
2. Deploy the generated `dist/` folder to any static host (Vercel, Netlify, GitHub Pages, S3, etc.).
3. Optionally preview the production bundle locally via `npm run preview` before pushing live.

## Troubleshooting & Tips

- **Node/Dependency issues:** Delete `node_modules` and `package-lock.json`, reinstall, and ensure you are on Node 18+.
- **Drag-and-drop glitches:** Some browser extensions interfere with pointer events; try a private window if drag handles feel unresponsive.
- **JSON import errors:** Only `.json` files created by this app are supported. The loader validates top-level `elements` and will notify if the shape is invalid.
- **Lint warnings:** Run `npm run lint` regularly to keep TypeScript/React hooks rules satisfied before committing.

## License

Add your preferred open-source license (MIT is typical for frontend demos) before publishing the repository publicly.
