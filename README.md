# 👋 Hello.

**A small interactive experience. A different way to say hello.**

Hello is a private, invitation-only web experience built with modern web technologies.

Instead of presenting everything at once, it lets visitors discover a story through a carefully designed, interactive journey.

Some things are better experienced than explained.

**Live Website:** https://hello.aldenderf.com

---

## About the Project

Hello is a personal side project exploring how technology, storytelling, and interaction can create a more meaningful digital experience.

The project focuses on minimalist design, intentional interactions, privacy, and a smooth user experience.

## Features

- **Invitation-only access** — Visitors enter a unique access code.
- **Interactive storytelling** — A guided experience with animated transitions.
- **Private sessions** — Server-side session management and expiration.
- **One-time invitations** — Controlled access for designated recipients.
- **Email notifications** — Event-driven notifications with retry handling.
- **Responsive design** — Built for both mobile and desktop.
- **Security controls** — Hashed invitation codes, rate limiting, and protected administrative operations.

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 |
| Language | TypeScript |
| UI | React 19, Material UI |
| Animation | Motion |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma 7 |
| Email | Resend |
| Deployment | Vercel |
| Package Manager | pnpm |

## Development

This project uses pnpm.

```bash
pnpm install
pnpm exec prisma generate
pnpm dev
```

Local development requires the appropriate environment variables and database configuration.

Build and quality checks:

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

For production database preparation and migration guidance, see `docs/deployment/README.md`.

## Privacy & Security

Hello is designed around limited, intentional access.

Invitation codes are not stored in plaintext, private sessions are managed server-side, and sensitive application settings remain outside version control.

The source code is public for portfolio and learning purposes, but access to the interactive experience is restricted.

## Project Philosophy

Not every project needs to solve a big problem.

Sometimes, building something meaningful is reason enough.

**Made with curiosity, code, and a little courage.**

---

Created by [Alden Derf](https://aldenderf.com).