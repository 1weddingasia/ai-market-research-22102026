import os
import shutil
import sys

wrapper_code = """#!/usr/bin/env python3
import sys
import os

# Intercept and sanitize any non-integer or literal '$PORT' argument
real_port = os.environ.get("PORT", "8000")
if not real_port or not real_port.isdigit():
    real_port = "8000"

sanitized_args = []
for i, arg in enumerate(sys.argv):
    if arg in ("$PORT", "\\$PORT", "${PORT}"):
        sanitized_args.append(real_port)
    elif i > 0 and sys.argv[i-1] == "--port" and not arg.isdigit():
        sanitized_args.append(real_port)
    else:
        sanitized_args.append(arg)

sys.argv = sanitized_args

from uvicorn.main import main
if __name__ == '__main__':
    sys.exit(main())
"""

uvicorn_path = shutil.which("uvicorn")
if uvicorn_path and os.path.exists(uvicorn_path):
    try:
        with open(uvicorn_path, "w", encoding="utf-8") as f:
            f.write(wrapper_code)
        os.chmod(uvicorn_path, 0o755)
        print(f"[Patch] Successfully patched uvicorn at {uvicorn_path}")
    except Exception as e:
        print(f"[Patch] Could not patch {uvicorn_path}: {e}")
else:
    print("[Patch] uvicorn not found in PATH")
