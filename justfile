# Variables
POSTGRES_CONTAINER := "myapp-postgres"
POSTGRES_PORT := "5434"

# Start services (PostgreSQL, install, migrate, dev)
start:
    #!/bin/bash
    set -e

    # Start PostgreSQL if not running
    if docker ps -q -f name={{ POSTGRES_CONTAINER }} | grep -q .; then
        echo "PostgreSQL already running"
    elif docker ps -a -q -f name={{ POSTGRES_CONTAINER }} | grep -q .; then
        docker start {{ POSTGRES_CONTAINER }}
        echo "PostgreSQL started"
    else
        docker run --name {{ POSTGRES_CONTAINER }} \
            -e POSTGRES_USER=postgres \
            -e POSTGRES_PASSWORD=localpassword \
            -e POSTGRES_DB=myapp \
            -d -p {{ POSTGRES_PORT }}:5432 postgres:15
        echo "PostgreSQL container created and started"
    fi

    bun install
    cd packages/backend && bun run db:migrate
    bun run dev

# Stop services
stop:
    docker stop {{ POSTGRES_CONTAINER }} 2>/dev/null || true

# Remove PostgreSQL container completely
reset-db:
    docker stop {{ POSTGRES_CONTAINER }} 2>/dev/null || true
    docker rm {{ POSTGRES_CONTAINER }} 2>/dev/null || true
