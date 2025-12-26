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
start: postgres-start deps-install migrate
    #!/bin/bash
    set -e
    
    # Get backend port from env variable or default to 3001
    BACKEND_PORT=${PORT:-3001}
    if [ -f packages/backend/.env ]; then
        ENV_PORT=$(grep -E "^PORT=" packages/backend/.env 2>/dev/null | cut -d'=' -f2 | tr -d '"' | tr -d "'" || echo "")
        if [ -n "$ENV_PORT" ]; then
            BACKEND_PORT=$ENV_PORT
        fi
    fi
    
    # Get web port from package.json (extract from "dev": "vite --port X")
    WEB_PORT=$(grep -E '"dev":\s*"vite --port' packages/web/package.json 2>/dev/null | sed -n 's/.*--port \([0-9]*\).*/\1/p' || echo "3000")
    
    echo "✓ PostgreSQL is running"
    echo "✓ Dependencies installed"
    echo "✓ Migrations completed"
    echo ""
    echo "Starting backend and web app..."
    echo ""
    
    # Start backend in background
    cd packages/backend
    bun run src/index.ts > /tmp/backend.log 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > /tmp/backend.pid
    cd ../..
    
    # Start web in background
    cd packages/web
    bun run dev > /tmp/web.log 2>&1 &
    WEB_PID=$!
    echo $WEB_PID > /tmp/web.pid
    cd ../..
    
    # Wait a moment for servers to start and detect actual ports from logs
    sleep 2
    
    # Try to detect actual backend port from log output
    if [ -f /tmp/backend.log ]; then
        DETECTED_BACKEND=$(grep -oE 'running at [^:]+:([0-9]+)' /tmp/backend.log 2>/dev/null | grep -oE '[0-9]+' | head -1 || echo "")
        if [ -n "$DETECTED_BACKEND" ]; then
            BACKEND_PORT=$DETECTED_BACKEND
        fi
    fi
    
    # Try to detect actual web port from log output
    if [ -f /tmp/web.log ]; then
        DETECTED_WEB=$(grep -oE 'Local:\s+http://[^:]+:([0-9]+)' /tmp/web.log 2>/dev/null | grep -oE '[0-9]+' | head -1 || echo "")
        if [ -z "$DETECTED_WEB" ]; then
            DETECTED_WEB=$(grep -oE 'http://[^:]+:([0-9]+)' /tmp/web.log 2>/dev/null | grep -oE '[0-9]+' | head -1 || echo "")
        fi
        if [ -n "$DETECTED_WEB" ]; then
            WEB_PORT=$DETECTED_WEB
        fi
    fi
    
    echo "✓ Backend started (PID: $BACKEND_PID) - http://localhost:$BACKEND_PORT"
    echo "✓ Web app started (PID: $WEB_PID) - http://localhost:$WEB_PORT"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📋 Live logs (Press Ctrl+C to stop all services):"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    # Function to cleanup on exit
    cleanup() {
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "Stopping services..."
        if [ -f /tmp/backend.pid ]; then
            kill $(cat /tmp/backend.pid) 2>/dev/null || true
            rm /tmp/backend.pid
        fi
        if [ -f /tmp/web.pid ]; then
            kill $(cat /tmp/web.pid) 2>/dev/null || true
            rm /tmp/web.pid
        fi
        # Kill tail processes
        pkill -P $$ tail 2>/dev/null || true
        echo "✓ All services stopped"
        exit 0
    }
    
    trap cleanup SIGINT SIGTERM
    
    # Display logs with prefixes - tail both files in parallel
    tail -f /tmp/backend.log 2>/dev/null | sed 's/^/[BACKEND] /' &
    TAIL_BACKEND_PID=$!
    tail -f /tmp/web.log 2>/dev/null | sed 's/^/[WEB]     /' &
    TAIL_WEB_PID=$!
    
    # Wait for either tail process to exit (they shouldn't, but handle it)
    wait $TAIL_BACKEND_PID $TAIL_WEB_PID

# Stop everything
stop: postgres-stop
    #!/bin/bash
    set -e
    
    # Stop backend if running
    if [ -f /tmp/backend.pid ]; then
        BACKEND_PID=$(cat /tmp/backend.pid)
        if ps -p $BACKEND_PID > /dev/null 2>&1; then
            echo "→ Stopping backend (PID: $BACKEND_PID)..."
            kill $BACKEND_PID 2>/dev/null || true
            rm /tmp/backend.pid
            echo "✓ Backend stopped"
        else
            rm /tmp/backend.pid
        fi
    fi
    
    # Stop web if running
    if [ -f /tmp/web.pid ]; then
        WEB_PID=$(cat /tmp/web.pid)
        if ps -p $WEB_PID > /dev/null 2>&1; then
            echo "→ Stopping web app (PID: $WEB_PID)..."
            kill $WEB_PID 2>/dev/null || true
            rm /tmp/web.pid
            echo "✓ Web app stopped"
        else
            rm /tmp/web.pid
        fi
    fi
    
    echo "✓ All services stopped"

# Install dependencies
deps-install:
    @echo "→ Installing dependencies..."
    bun install
    @echo "✓ Dependencies installed"

# Run database migrations
migrate:
    @echo "→ Running database migrations..."
    cd packages/backend && bun run db:migrate
    @echo "✓ Migrations completed"

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
