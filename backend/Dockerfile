# Use an official lightweight Python image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# 1. Install Node.js and NPM (Required for SnarkJS)
RUN apt-get update && apt-get install -y nodejs npm

# 2. Install SnarkJS globally
RUN npm install -g snarkjs

# 3. Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copy the rest of the backend code
COPY . .

# Expose port
EXPOSE 8000

# Command to run the app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]