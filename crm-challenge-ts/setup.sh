#!/bin/bash

PG_USER="postgres"
PG_CONTAINER="postgres"  
docker compose up -d

# Wait for PostgreSQL to be ready
until docker compose exec -T $PG_CONTAINER pg_isready -U "$PG_USER"; do
  echo "Waiting for PostgreSQL to be ready..."
  sleep 2
done

# Run the SQL scripts
docker compose exec -T $PG_CONTAINER psql -U "$PG_USER" -f /postgres/createTable.sql
docker compose exec -T $PG_CONTAINER psql -U "$PG_USER" -f /postgres/importCustomers.sql
