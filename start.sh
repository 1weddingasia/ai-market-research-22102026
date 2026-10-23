#!/bin/sh
set -e

# Handle literal "$PORT" or empty PORT from container environments
if [ -z "$PORT" ] || [ "$PORT" = '$PORT' ] || [ "$PORT" = "\$PORT" ]; then
    PORT=8000
fi

if [ -f "main.py" ]; then
    exec python -m uvicorn main:app --host 0.0.0.0 --port "$PORT"
elif [ -d "backend" ]; then
    cd backend
    exec python -m uvicorn main:app --host 0.0.0.0 --port "$PORT"
else
    exec python -m uvicorn main:app --host 0.0.0.0 --port "$PORT"
fi
