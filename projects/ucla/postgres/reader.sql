-- The importer assigns a generated password without committing it.
CREATE ROLE ucla_reader LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE
    NOINHERIT NOREPLICATION NOBYPASSRLS CONNECTION LIMIT 4;
ALTER ROLE ucla_reader SET default_transaction_read_only = on;
ALTER ROLE ucla_reader SET statement_timeout = '2500ms';
ALTER ROLE ucla_reader SET lock_timeout = '250ms';
ALTER ROLE ucla_reader SET search_path = pg_catalog;
GRANT USAGE ON SCHEMA ucla_raw, ucla_core, ucla_mart TO ucla_reader;
GRANT SELECT ON ALL TABLES IN SCHEMA ucla_raw, ucla_core, ucla_mart TO ucla_reader;
