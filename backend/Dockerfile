FROM python:3.11-slim 

WORKDIR /app

# Install Node.js & SnarkJS
RUN apt-get update && apt-get install -y nodejs npm curl \
    && npm install -g snarkjs \
    && apt-get clean

# Copy Circuits
COPY circuits /app/circuits

# Setup Backend
WORKDIR /app/backend
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]