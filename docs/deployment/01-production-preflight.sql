-- Read-only. Run in the production Supabase SQL Editor before any setup SQL.
-- Expected database: mva. Save results privately; do not paste credentials.
BEGIN READ ONLY;

SELECT current_database() AS database_name, current_user AS role_name,
       session_user AS session_role, inet_server_addr() AS server_address,
       inet_server_port() AS server_port, current_setting('search_path') AS search_path,
       current_setting('server_version') AS server_version;

SELECT n.oid AS schema_oid, n.nspname AS schema_name,
       pg_get_userbyid(n.nspowner) AS owner, n.nspacl AS acl,
       has_database_privilege(current_user, current_database(), 'CREATE') AS can_create_schema,
       has_schema_privilege(current_user, n.oid, 'USAGE') AS can_use_schema,
       has_schema_privilege(current_user, n.oid, 'CREATE') AS can_create_in_schema
FROM pg_namespace n WHERE n.nspname = 'private_app';

-- Includes relations, indexes, sequences, views, and Prisma history if present.
SELECT n.nspname AS schema_name, c.relname AS object_name, c.relkind,
       pg_get_userbyid(c.relowner) AS owner, c.relacl AS acl,
       CASE WHEN c.relkind IN ('r', 'p', 'v', 'm', 'f')
            THEN has_table_privilege(current_user, c.oid, 'SELECT') END AS can_select,
       CASE WHEN c.relkind IN ('r', 'p', 'v', 'm', 'f')
            THEN has_table_privilege(current_user, c.oid, 'INSERT') END AS can_insert,
       CASE WHEN c.relkind IN ('r', 'p', 'v', 'm', 'f')
            THEN has_table_privilege(current_user, c.oid, 'UPDATE') END AS can_update
FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'private_app'
ORDER BY c.relname;

-- Find migration-history tables in every schema; do not assume which one Prisma used.
SELECT n.nspname AS schema_name, c.relname AS table_name,
       pg_get_userbyid(c.relowner) AS owner
FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE c.relname = '_prisma_migrations' AND c.relkind IN ('r', 'p')
ORDER BY n.nspname;

-- Target names that could conflict even if their object kind is unexpected.
SELECT n.nspname AS schema_name, c.relname AS object_name, c.relkind
FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'private_app'
  AND c.relname IN ('invite_access', 'invite_notification', 'invite_rate_limit',
                    'invite_access_pkey', 'invite_access_codeHash_key',
                    'invite_notification_pkey', 'invite_notification_inviteId_event_key',
                    'invite_notification_acceptedAt_nextAttemptAt_idx',
                    'invite_rate_limit_pkey', 'invite_rate_limit_expiresAt_idx',
                    '_prisma_migrations')
ORDER BY c.relname;

SELECT n.nspname AS schema_name, c.relname AS table_name, a.attname AS column_name,
       format_type(a.atttypid, a.atttypmod) AS data_type, a.attnotnull AS not_null,
       pg_get_expr(d.adbin, d.adrelid) AS column_default
FROM pg_attribute a
JOIN pg_class c ON c.oid = a.attrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
LEFT JOIN pg_attrdef d ON d.adrelid = a.attrelid AND d.adnum = a.attnum
WHERE n.nspname = 'private_app'
  AND c.relname IN ('invite_access', 'invite_notification', 'invite_rate_limit')
  AND a.attnum > 0 AND NOT a.attisdropped
ORDER BY c.relname, a.attnum;

SELECT n.nspname AS schema_name, t.typname AS enum_name,
       e.enumlabel, e.enumsortorder, pg_get_userbyid(t.typowner) AS owner
FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace
LEFT JOIN pg_enum e ON e.enumtypid = t.oid
WHERE n.nspname = 'private_app'
  AND t.typname IN ('InviteCodeType', 'InviteStatus', 'InviteNotificationEvent')
ORDER BY t.typname, e.enumsortorder;

SELECT n.nspname AS schema_name, c.relname AS table_name,
       con.conname AS constraint_name, con.contype,
       pg_get_constraintdef(con.oid) AS definition
FROM pg_constraint con JOIN pg_class c ON c.oid = con.conrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'private_app'
ORDER BY c.relname, con.conname;

SELECT schemaname, tablename, indexname, indexdef
FROM pg_indexes WHERE schemaname = 'private_app'
ORDER BY tablename, indexname;

SELECT n.nspname AS schema_name, p.proname AS routine_name, p.prokind
FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'private_app' ORDER BY p.proname;

SELECT defaclrole::regrole AS owner_role, defaclnamespace::regnamespace AS schema_name,
       defaclobjtype AS object_kind, defaclacl AS default_acl
FROM pg_default_acl
WHERE defaclnamespace = to_regnamespace('private_app');

ROLLBACK;

-- If a history table was found, inspect its migration_name, checksum, started_at,
-- finished_at, rolled_back_at, and logs separately after confirming its schema.
-- This script avoids querying an absent table, so it works before first setup.
