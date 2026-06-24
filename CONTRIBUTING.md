# Contributing to Langora

Thanks for your interest in contributing — bug reports, feature requests, documentation fixes, and pull requests are all welcome.

This project follows a [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you're expected to uphold it.

## Before you start

- For small fixes (typos, docs, obvious bugs), feel free to open a pull request directly.
- For larger changes (new features, schema changes, payment‑flow changes), please open an issue first to discuss the approach before investing time in an implementation.
- Check existing [issues](<REPO_URL>/issues) and [pull requests](<REPO_URL>/pulls) to avoid duplicate work.

## Development setup

### Prerequisites

- Node.js ≥ 20 and [pnpm](https://pnpm.io/)
- A [Supabase](https://supabase.com/) project (Postgres + Auth) for local development
- A [Creem](https://www.creem.io/) test account if you're working on payment flows

### Setup steps

1. Fork the repository and clone your fork:

   ```bash
   git clone https://github.com/<your-username>/langora.git
   cd langora
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Copy `.env.example` to `.env.local` and fill in your Supabase / Creem credentials.

4. Sync the database schema and seed the lesson data:

   ```bash
   pnpm db:push
   pnpm db:seed
   ```

5. Start the dev server:

   ```bash
   pnpm dev
   ```

## Making changes

1. Create a branch from `main`:

   ```bash
   git checkout -b feat/short-description
   ```

   Use a prefix that matches the change: `feat/`, `fix/`, `docs/`, `refactor/`, `chore/`.

2. Make your changes, keeping commits focused and descriptive.

3. Run the linter before committing:

   ```bash
   pnpm lint
   ```

4. If you changed the database schema in `lib/db/schema.ts`, generate a migration:

   ```bash
   pnpm db:generate
   ```

   Commit the generated migration files in `drizzle/` along with your change.

5. Test the affected flows manually (lesson player, auth, dashboard, or checkout/webhook, depending on what you touched). The project does not yet have an automated test suite — manual verification notes in your PR description are appreciated.

## Pull request guidelines

- Keep PRs focused on a single change; split unrelated changes into separate PRs.
- Write a clear description of **what** changed and **why**, and link any related issue (e.g. `Closes #123`).
- Include before/after screenshots or a short clip for any UI change.
- Make sure `pnpm lint` and `pnpm build` succeed before requesting review.
- Be responsive to review feedback — PRs that go stale without activity may be closed.

## Code style

- TypeScript throughout; avoid introducing `any` where a real type is available.
- Follow the existing patterns in `components/` (functional components, Tailwind utility classes, shadcn/ui primitives) and `lib/db/queries.ts` (typed query helpers rather than raw SQL scattered across routes).
- Keep payment‑related logic (`lib/creem.ts`, `app/api/payment/**`) defensive: validate webhook signatures, handle missing/partial metadata gracefully, and avoid double‑writing transactions.

## Reporting bugs

When filing a bug report, please include:

- Steps to reproduce the issue
- What you expected to happen vs. what actually happened
- Your environment (OS, Node.js version, browser)
- Relevant logs or screenshots, with any secrets/API keys redacted

## Reporting security issues

Please **do not** open a public issue for security vulnerabilities. Follow the process described in [SECURITY.md](./SECURITY.md) instead.

## Questions

If anything in this guide is unclear, open a [discussion or issue](<REPO_URL>/issues) and we'll help you get unblocked.
