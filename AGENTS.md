# Repository Guidelines

## Project Structure & Module Organization
- `src/` – React + TypeScript source. Key dirs: `components/`, `pages/`, `hooks/`, `lib/`, `locales/` (i18n JSON), optional `assets/`.
- Entry points: `index.html`, `src/main.tsx`, `src/App.tsx`. Build output: `dist/`. Static files: `public/`.
- Path alias: `@` → `src`. Example: `import Button from "@/components/Button"`.

## Build, Test, and Development Commands
- `npm run dev` – Start Vite dev server with HMR.
- `npm run build` – Type-check (`tsc -b`) and build production assets.
- `npm run preview` – Serve the built app from `dist/`.
- `npm run lint` – Run ESLint over the project.

## Coding Style & Naming Conventions
- Language: TypeScript, React function components.
- Indentation: 2 spaces; keep lines concise and readable.
- Components: PascalCase filenames (e.g., `RestartButton.tsx`), default export if single component per file.
- Hooks: `useX` naming (e.g., `useTyping.ts`).
- Styling: Tailwind CSS utilities; prefer `clsx`/`class-variance-authority` when composing classes.
- Imports: Use `@` alias for intra-src paths; keep relative depth minimal.
- Linting: ESLint v9 (see `eslint.config.js`). Fix warnings before PRs.

## Testing Guidelines
- No formal tests configured yet. Recommended: Vitest + React Testing Library.
- Proposed pattern: colocate tests as `*.test.ts(x)` near source (e.g., `src/components/WordList.test.tsx`).
- Aim for coverage on core logic (hooks in `src/hooks/`) and critical UI states.

## Commit & Pull Request Guidelines
- Commit messages: Present-tense, imperative, concise. Examples:
  - `add timer logic`
  - `enhance WordList caret behavior`
  - `fix layout shift on GamePage`
- PRs should include:
  - Clear description, scope, and rationale; link related issues.
  - Screenshots/GIFs for UI changes.
  - Checklist: `npm run lint` clean, `npm run build` passes, i18n keys updated in `src/locales/` if applicable.

## i18n & Configuration Tips
- Add translations in `src/locales/*.json`; keep keys consistent across languages.
- Vite config sets `@` alias and dev server `allowedHosts`. Use `.env.local` for local secrets; prefix variables with `VITE_` to expose to the client.
