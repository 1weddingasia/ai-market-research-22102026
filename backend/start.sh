#!/bin/sh
set -e

# Handle literal "$PORT" or empty PORT from container environments
if [ -z "$PORT" ] || [ "$PORT" = '$PORT' ] || [ "$PORT" = "\$PORT" ]; then
    PORT=8000
fi

echo "Starting AI Market Research Backend on 0.0.0.0:$PORT..."
exec python -m uvicorn main:app --host 0.0.0.0 --port "$PORT"
