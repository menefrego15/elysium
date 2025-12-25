# Variables
POSTGRES_CONTAINER := "myapp-postgres"
POSTGRES_PORT := "5434"
POSTGRES_PASSWORD := "localpassword"
POSTGRES_USER := "postgres"
POSTGRES_DB := "myapp"
POSTGRES_IMAGE := "postgres:15"

# Default recipe
default:
    @echo "🚀 Available commands:"
    @just --list

# Start everything (postgres, backend, web)
start: postgres-start deps-install
    @echo "✓ PostgreSQL is running"
    @echo "✓ Dependencies installed"
    @echo ""
    @echo "Starting backend and web app..."
    @echo ""
    @echo "In separate terminals, run:"
    @echo "  just backend - Start Elysia backend (http://localhost:3000)"
    @echo "  just web     - Start Vite dev server (http://localhost:5173)"
    @echo ""
    @echo "To view postgres connection string:"
    @echo "  just postgres-url"

# Stop everything
stop: postgres-stop
    @echo "✓ All services stopped"

# Install dependencies
deps-install:
    @echo "→ Installing dependencies..."
    bun install
    @echo "✓ Dependencies installed"

# ============================================================================
# POSTGRES TASKS
# ============================================================================

# Start PostgreSQL container
postgres-start:
    #!/bin/bash
    set -e
    CONTAINER="{{ POSTGRES_CONTAINER }}"
    PORT="{{ POSTGRES_PORT }}"
    USER="{{ POSTGRES_USER }}"
    PASSWORD="{{ POSTGRES_PASSWORD }}"
    DB="{{ POSTGRES_DB }}"
    IMAGE="{{ POSTGRES_IMAGE }}"
    
    # Check if container is running
    if docker ps -q -f name=$CONTAINER | grep -q .; then
        echo "→ PostgreSQL container already running"
    else
        # Check if container exists but is stopped
        if docker ps -a -q -f name=$CONTAINER | grep -q .; then
            echo "→ Starting existing PostgreSQL container..."
            docker start $CONTAINER
        else
            echo "→ Creating and starting PostgreSQL container..."
            docker run \
                --name $CONTAINER \
                -e POSTGRES_USER=$USER \
                -e POSTGRES_PASSWORD=$PASSWORD \
                -e POSTGRES_DB=$DB \
                -d \
                -p $PORT:5432 \
                $IMAGE
            
            echo "→ Waiting for PostgreSQL to be ready..."
            sleep 3
        fi
        echo "✓ PostgreSQL is running on port $PORT"
    fi

# Stop PostgreSQL container
postgres-stop:
    #!/bin/bash
    CONTAINER="{{ POSTGRES_CONTAINER }}"
    if docker ps -q -f name=$CONTAINER | grep -q .; then
        echo "→ Stopping PostgreSQL container..."
        docker stop $CONTAINER
        echo "✓ PostgreSQL stopped"
    else
        echo "→ PostgreSQL container not running"
    fi

# Remove PostgreSQL container completely
postgres-remove: postgres-stop
    #!/bin/bash
    CONTAINER="{{ POSTGRES_CONTAINER }}"
    if docker ps -a -q -f name=$CONTAINER | grep -q .; then
        echo "→ Removing PostgreSQL container..."
        docker rm $CONTAINER
        echo "✓ PostgreSQL container removed"
    else
        echo "→ PostgreSQL container not found"
    fi

# View PostgreSQL connection URL
postgres-url:
    @echo "PostgreSQL Connection URL:"
    @echo "postgres://{{ POSTGRES_USER }}:{{ POSTGRES_PASSWORD }}@localhost:{{ POSTGRES_PORT }}/{{ POSTGRES_DB }}"

# Check PostgreSQL status
postgres-status:
    #!/bin/bash
    CONTAINER="{{ POSTGRES_CONTAINER }}"
    if docker ps -q -f name=$CONTAINER | grep -q .; then
        echo "✓ PostgreSQL is running"
        docker ps -f name=$CONTAINER
    else
        echo "✗ PostgreSQL is not running"
    fi

# Access PostgreSQL shell
postgres-shell:
    docker exec -it {{ POSTGRES_CONTAINER }} psql -U {{ POSTGRES_USER }} -d {{ POSTGRES_DB }}

# ============================================================================
# BACKEND TASKS
# ============================================================================

# Start Elysia backend server
backend:
    @echo "→ Starting Elysia backend server..."
    @echo "Database URL: postgres://{{ POSTGRES_USER }}:{{ POSTGRES_PASSWORD }}@localhost:{{ POSTGRES_PORT }}/{{ POSTGRES_DB }}"
    cd packages/backend && bun run src/index.ts

# Build backend
backend-build:
    @echo "→ Building backend..."
    cd packages/backend && bun run build

# ============================================================================
# WEB APP TASKS
# ============================================================================

# Start Vite dev server
web:
    @echo "→ Starting Vite dev server..."
    cd packages/web && bun run dev

# Build web app
web-build:
    @echo "→ Building web app..."
    cd packages/web && bun run build


# ============================================================================
# UTILITY TASKS
# ============================================================================

# Show environment info
env-info:
    @echo "Environment Information:"
    @echo "Bun version: $(bun --version)"
    @echo "Node version: $(node --version)"
    @echo "Docker version: $(docker --version)"
    @echo ""
    @echo "Database Configuration:"
    @echo "Container: {{ POSTGRES_CONTAINER }}"
    @echo "Port: {{ POSTGRES_PORT }}"
    @echo "User: {{ POSTGRES_USER }}"
    @echo "Database: {{ POSTGRES_DB }}"

# Clean all (remove node_modules, build artifacts)
clean:
    @echo "→ Cleaning..."
    rm -rf packages/backend/node_modules packages/web/node_modules
    rm -rf packages/backend/dist packages/web/dist
    rm -rf node_modules
    @echo "✓ Cleaned"

# Full reset (clean + remove postgres container)
reset: clean postgres-remove
    @echo "✓ Full reset complete"
    @echo "Run 'just start' to begin fresh"

# ============================================================================
# DOCKER UTILITIES
# ============================================================================

# View postgres container logs
postgres-logs:
    docker logs {{ POSTGRES_CONTAINER }} -f

# Check if port is available
check-port:
    #!/bin/bash
    PORT="{{ POSTGRES_PORT }}"
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo "✗ Port $PORT is already in use"
        lsof -i :$PORT
    else
        echo "✓ Port $PORT is available"
    fi
