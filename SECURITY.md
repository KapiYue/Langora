# Security Policy

## Supported Versions

Langora is currently developed on a single rolling `main` branch. Security
fixes are applied to `main` and released as soon as possible; there are no
older major versions receiving separate security support at this time.

| Version | Supported |
| ------- | --------- |
| `main`  | ✅        |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, **please do not
open a public GitHub issue or pull request**. Public disclosure before a fix
is available can put users and their data at risk.

Instead, report it privately by emailing:

📧 **ellnazhang520@gmail.com**

Please include as much of the following as you can:

- A description of the vulnerability and its potential impact
- Steps to reproduce it, or a proof‑of‑concept if available
- Affected component(s) — for example, authentication (`lib/supabase/`),
  the payment webhook (`app/api/payment/webhook`), database access
  (`lib/db/`), or middleware/session handling
- Any suggested mitigation, if you have one

### What to expect

- **Acknowledgement**: we aim to acknowledge new reports within **3 business
  days**.
- **Triage**: we'll assess severity and impact, and may follow up with
  questions.
- **Fix & disclosure**: once a fix is ready, we'll coordinate with you on
  timing before any public disclosure, and credit you (unless you prefer to
  remain anonymous).

We currently do not operate a paid bug bounty program, but we sincerely
appreciate responsible disclosure and will credit researchers in release
notes where appropriate.

## Scope & Areas of Particular Concern

Given the nature of this project, reports involving the following areas are
especially appreciated:

- **Authentication & sessions** — Supabase Auth integration, cookie/SSR
  session handling in `middleware.ts` and `lib/supabase/`.
- **Payment webhook integrity** — signature verification, replay protection,
  or metadata trust issues in `app/api/payment/webhook`.
- **Access control** — any way to access paid lesson content
  (`app/lesson/[lessonId]`) without an active subscription or purchase.
- **Data exposure** — leakage of another user's profile, progress, or
  payment data through API routes (`app/api/**`).
- **Injection or unsafe queries** — anywhere user input reaches the database
  via `lib/db/queries.ts` outside of Drizzle's parameterized query builder.

## Out of Scope

- Vulnerabilities in third‑party services this project depends on (Supabase,
  Creem, Vercel, etc.) — please report those directly to the respective
  vendor.
- Issues that require physical access to a user's device, or that rely on a
  user's own machine already being compromised.
- Missing security headers or best‑practice suggestions without a
  demonstrated, concrete impact (these are still welcome as regular GitHub
  issues, just not under this private process).

## Managing Secrets

If you believe a secret (API key, webhook secret, database credential) has
been accidentally committed or exposed, please report it through the same
private channel above so it can be rotated immediately.

Thank you for helping keep Langora and its users safe.
