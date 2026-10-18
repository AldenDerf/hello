# Hello first production database setup

**Status: NO-GO until the gates below pass.** These files are preparation only. Do not run `02-hello-initial-schema.sql` or Prisma resolution from this review. The production database is shared with MVA.

## What was reviewed

`prisma/schema.prisma`, `prisma.config.ts`, and all four `prisma/migrations/*/migration.sql` files. `mva_dev` recorded the original migrations in application order: foundation, notification outbox, retry/rate limit, first attempt. The first-attempt history name was reconciled after a verified backup and fresh scratch rehearsal. All four remain successful; their checksums, timestamps, statuses, and logs were preserved.

The old directory names sorted **first attempt before outbox**, which failed on a fresh database. `20261015_invite_first_attempt` was renamed to `20261015_invite_notification_outbox_first_attempt`; the SQL text was preserved, and LF line endings now match the recorded `mva_dev` checksums. The corrected order is foundation, outbox, first attempt, retry/rate limit. All four applied successfully to an empty `hello_scratch`; Prisma schema diff was empty and migration status passed on both scratch and `mva_dev`. No already-applied SQL was rerun on `mva_dev`.

The development reconciliation was a single explicit transaction scoped to `private_app._prisma_migrations`. It guarded `current_database() = 'mva_dev'`, all four expected successful rows and checksums, and the absence of the new name. Exactly one row with checksum `04489f01fc0cef768531d63b9d741032842a0420bf6d1d407f84a48c7a547ac4` had **only** `migration_name` changed. This procedure is complete in development and must not be repeated in production. Prisma `migrate resolve` cannot rename a successful history row; production has no old Hello history to reconcile if the preflight confirms a first-time setup.

## Before opening the production SQL Editor

1. Explicitly confirm the intended Supabase **project ref** in the Dashboard and match it to the connection host for both production `DATABASE_URL` and `DIRECT_URL`. Record that confirmation with the deployment review. The database name must be `postgres`, never `mva_dev`, but `postgres` is not a unique project identifier. `prisma.config.ts` currently uses `DATABASE_URL` for Prisma commands and sets `schema=private_app`; configuring `DIRECT_URL` alone does not switch the CLI. Confirm the migration connection is suitable for Prisma's DDL and history operations.
2. Run [01-production-preflight.sql](01-production-preflight.sql) and save the results privately. Confirm `current_database() = 'postgres'` **and** the separately confirmed project identity, `private_app` is absent or empty, no target name conflicts, and no `private_app._prisma_migrations` row/table needs reconciliation. An MVA `public._prisma_migrations` table is not a Hello history table; leave it untouched. If a history table exists, inspect its rows separately before proceeding.
3. Check that the SQL Editor role can create a schema in the confirmed production database, or create objects in an existing empty `private_app` schema. Identify the resulting owner. For later Prisma use, the migration role needs schema `USAGE` and `CREATE`, ownership or suitable alteration rights on Hello objects, and permission to create/update `private_app._prisma_migrations`. The application role needs schema `USAGE` and appropriate table access; review default privileges and grants separately. This setup file deliberately changes no grants.
4. Confirm a recent Supabase backup/PITR restore point and test recovery to a **separate** project. A full in-place restore rewinds MVA too. Keep a protected logical backup if the Supabase plan does not provide a sufficiently recent restore point. Record the restore point and a rollback decision owner before SQL execution.
5. Use a reviewed commit containing the corrected migration order. Verify SQL output against `schema.prisma` and the repaired migration chain on an isolated scratch database. Only then request approval for production SQL.

## Approved-day procedure (not performed)

1. Repeat the project-ref and connection-host confirmation, database identity, object, and backup checks immediately before the change. Stop on any unexpected `private_app` object or history.
2. Run [02-hello-initial-schema.sql](02-hello-initial-schema.sql) **once** in the SQL Editor. It is one transaction; its guard rejects the wrong database and a nonempty `private_app`. An error rolls the transaction back. Do not rerun blindly after an uncertain result: inspect first.
3. Repeat the preflight inventory and compare columns, defaults, enums, indexes, and constraints with the list below. Confirm unrelated MVA object definitions are unchanged.
4. Before any `prisma migrate deploy`, baseline the four repaired migration directory names using Prisma's supported `pnpm exec prisma migrate resolve --applied <directory-name>` command, one at a time in dependency order. Use the verified production connection through `prisma.config.ts`. `resolve` **writes migration history** and requires its own production approval; it must not apply the SQL again. Never insert fabricated checksums manually. Require `pnpm exec prisma migrate status` to report no pending migrations afterward. [Prisma baselining](https://www.prisma.io/docs/orm/v7/prisma-migrate/workflows/baselining), [migrate resolve](https://docs.prisma.io/docs/cli/migrate/resolve).
5. If setup or baselining fails, stop rollout and preserve error output. Inspect committed database state before choosing a targeted forward fix. Do not drop `private_app` or restore the shared database without accounting for intervening MVA writes.

## Expected persistent Hello objects

- Schema: `private_app`.
- Enums: `InviteCodeType` (`TEST`, `INVITE`), `InviteStatus` (`UNUSED`, `ACTIVE`, `COMPLETED`), `InviteNotificationEvent` (`REDEEMED`, `COMPLETED`).
- Tables: `invite_access`, `invite_notification`, `invite_rate_limit`.
- Primary keys: `invite_access_pkey` on `id`; `invite_notification_pkey` on `id`; `invite_rate_limit_pkey` on `key`.
- Additional indexes: unique `invite_access_codeHash_key`; unique `invite_notification_inviteId_event_key`; `invite_notification_acceptedAt_nextAttemptAt_idx`; `invite_rate_limit_expiresAt_idx`.
- Foreign key: `invite_notification_inviteId_fkey` to `private_app.invite_access(id)`, with `ON DELETE CASCADE ON UPDATE CASCADE`.
- Defaults: `invite_access.status = 'UNUSED'`, `returnCount = 0`, `createdAt = CURRENT_TIMESTAMP`; `invite_notification.attempts = 0`, `nextAttemptAt = CURRENT_TIMESTAMP`, `createdAt = CURRENT_TIMESTAMP`; `invite_rate_limit.attempts = 0`. UUID IDs and `updatedAt` are supplied by Prisma/application logic, not database defaults.
- After approved Prisma baselining: `private_app._prisma_migrations` with four applied records. The schema setup SQL does not create this table.

No MVA business tables are referenced. `public` and other Supabase schemas are outside the setup SQL's persistent write set.
