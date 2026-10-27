# UCLA SQL playground

This repository owns the **website, query API, final PostgreSQL schema, import tooling and PostgreSQL runtime configuration**.

The sibling UCLA_Neuropsychiatric_data project owns the dataset, local dimensional model, Python pipeline, quality checks and portable handoff. No website files or deployed PostgreSQL DDL are generated there.

## Locations

| Concern | Source of truth |
| --- | --- |
| Query interface | case-studies/ucla-playground.html |
| Page behavior and styling | assets/js/ucla-playground.js, assets/css/ucla-playground.css |
| Existing data-story dashboard | case-studies/ucla-warehouse.html |
| Public API | api/ucla.js, server/ucla.cjs |
| Final PostgreSQL tables | projects/ucla/postgres/schema.sql |
| Final PostgreSQL analytical views | projects/ucla/postgres/marts.sql |
| Public database account | projects/ucla/postgres/reader.sql |
| CSV handoff importer | scripts/ucla-import.cjs |
| Local static/API server | scripts/ucla-dev.cjs |
| Catalog and dashboard snapshots | assets/data/ucla-catalog.json, assets/data/ucla-warehouse.json |

The frontend remains HTML, CSS and vanilla JavaScript. Node dependencies are limited to pg, pg-copy-streams and pgsql-ast-parser for the requested backend.

## Local setup

Install Node 22+ and the locked dependencies:

~~~powershell
npm ci
~~~

Use a fresh local PostgreSQL database or a fresh Neon project. For local Docker, set a private UCLA_LOCAL_ADMIN_PASSWORD in .env.local and start:

~~~powershell
docker compose --env-file .env.local -f projects/ucla/compose.yaml up -d
~~~

The service binds to 127.0.0.1:55432 and creates ucla_demo. Set UCLA_ADMIN_DATABASE_URL privately in .env.local to the owner connection for that database. Never commit credentials. For Neon use an owner connection only for import; the public API gets a separate reader connection.

Build the portable handoff from the data project, then import it here:

~~~powershell
python ../UCLA_Neuropsychiatric_data/warehouse/build.py
npm run ucla:import -- ../UCLA_Neuropsychiatric_data/build/warehouse/handoff
npm run test:ucla
npm run ucla:dev
~~~

Open http://127.0.0.1:8002/case-studies/ucla-playground.html.

The importer verifies checksums, table/column contracts and loaded row counts. Schema creation, data loading, view creation and reader-role creation run in a transaction. Existing schemas or an existing reader role cause a failure; nothing is dropped or truncated. The importer is an initial-load tool, not an incremental updater.

A generated reader password and URL are written privately to build/ucla/reader.env. Local dev/test scripts read that file. The owner URL never serves public queries. If a later filesystem write fails after database commit, the database remains loaded; reset the reader password privately instead of rerunning schema creation.

## Vercel / Neon

Import into the selected Neon database using this project's schema and importer. Set **UCLA_DATABASE_URL** in Vercel to the SELECT-only ucla_reader connection. A Neon pooled connection is suitable for serverless use. Do not configure the owner connection as the public reader.

The API uses real PostgreSQL results and introspection. It refuses an owner/superuser or a reader with write/schema-create privileges. Missing configuration produces an unavailable state; the schema snapshot remains browsable and the page never fabricates query results. No hosted database or Vercel deployment is created automatically.

## Read-only behavior and limits

- Published ucla_raw, ucla_core and ucla_mart relations are queryable, including row-level open data.
- One parsed SELECT statement, read-only CTE or UNION is accepted. Writes, writable CTEs, row locks, arbitrary functions and unrelated/system relations are rejected.
- Common aggregates, joins, CASE, casts and the documented examples are supported. The parser intentionally supports a PostgreSQL subset; unsupported syntax returns an explanation.
- The API connects as a non-owner SELECT-only role and runs every request in a read-only transaction. The database also enforces a 2.5-second statement timeout and four reader connections.
- Results are limited to 200 rows and approximately 1 MB; SQL input is capped at 8,000 characters.
- The in-memory limit is 30 requests/minute per IP **per function instance**. It is not a distributed quota. Add a Vercel/shared rate limit for substantial traffic.
- Database URLs stay server-side. The local dev server serves only public routes and blocks private build/configuration paths.

## Data handoff and migration

The portable handoff contains a versioned manifest, checksummed CSVs, column/key metadata and a quality profile. This importer owns mapping that data into the final PostgreSQL schema.

The earlier mixed-repository website artifacts, including the generated legacy SQL import, were copied with SHA-256 verification into the ignored build/ucla/migrated folder before removal from the data project. Active website sources and final schema are versioned here. Dataset binaries are not copied to this repository or PostgreSQL.

References: [PostgreSQL read-only transactions](https://www.postgresql.org/docs/current/sql-set-transaction.html), [PostgreSQL privileges](https://www.postgresql.org/docs/current/sql-grant.html), [node-postgres client configuration](https://node-postgres.com/apis/client), [Vercel Node functions](https://vercel.com/docs/functions/runtimes/node-js).


## Existing local preview in this workspace

The verified local PostgreSQL 17 cluster lives in the ignored build/ucla/postgres-data folder, with binaries under build/ucla/native. It listens only on 127.0.0.1:55432. No WSL or Windows service configuration was changed.

If that cluster is stopped, restart it from this repository:

~~~powershell
& ./build/ucla/native/bin/pg_ctl.exe -D ./build/ucla/postgres-data -l ./build/ucla/postgres.log -o "-h 127.0.0.1 -p 55432" -w start
npm run ucla:dev
~~~

Do not rerun the initial importer against the already-loaded database. Use the existing reader configuration for the local preview.
