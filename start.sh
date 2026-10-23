#!/bin/sh
set -e

# Handle literal "$PORT" or empty PORT from container environments
if [ -z "$PORT" ] || [ "$PORT" = '$PORT' ] || [ "$PORT" = "\$PORT" ]; then
    PORT=8000
fi
export PORT="$PORT"

echo "Starting AI Market Research Backend on port $PORT..."
if [ -f "main.py" ]; then
    exec python main.py
elif [ -d "backend" ]; then
    cd backend
    exec python main.py
else
    exec python main.py
fi
