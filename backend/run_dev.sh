#!/bin/bash

trap 'echo -e "\n🛑 Preparing infrastructure for shutdown..."; docker-compose -f docker-compose.yml down; exit 0' SIGINT SIGTERM

echo "⚙️  Building and starting the infrastructure..."

docker-compose -f docker-compose.yml up --build --force-recreate -d

echo "⏳ Waiting for the backend to initialize (this may take a few seconds)..."

sleep 6

echo "============================================================="
echo "✅ Application deployed successfully."
echo "📚 API documentation (Swagger): http://localhost:3000/docs"
echo "============================================================="
echo "👀 Showing real-time logs... (Press Ctrl+C to stop and clean)"

docker-compose -f docker-compose.yml logs -f