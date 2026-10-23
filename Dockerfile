FROM python:3.11-slim

# Prevent Python from writing .pyc files and buffer stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONUTF8=1

# Install system dependencies required by WeasyPrint (libpango, cairo, fonts) and PyArrow/DuckDB
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libpangoft2-1.0-0 \
    libharfbuzz0b \
    libfontconfig1 \
    libfreetype6 \
    fonts-liberation \
    fonts-dejavu-core \
    libffi-dev \
    shared-mime-info \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements from backend/
COPY backend/requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy backend source code into /app
COPY backend/ .

# Railway sets $PORT dynamically
ENV PORT=8000
EXPOSE 8000

RUN chmod +x start.sh

# Start FastAPI with python main.py (handles PORT parsing reliably)
CMD ["python", "main.py"]
