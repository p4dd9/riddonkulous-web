#!/bin/bash

# Script to setup riddonkulous-web project
set -e  # Exit on error

echo "Removing existing riddonkulous-web directory..."
rm -rf riddonkulous-web

echo "Stopping Docker container..."
docker stop riddonkulous-web_riddonkulous-web_1 || true

echo "Cloning riddonkulous-web repository..."
git clone git@github.com:p4dd9/riddonkulous-web.git

echo "Copying environment file..."
cp ./config/env/.env-riddonkulous-web ./riddonkulous-web/.env

echo "Changing to riddonkulous-web directory..."
cd riddonkulous-web

echo "Stopping existing containers..."
docker compose down --remove-orphans

echo "Building and starting containers..."
docker compose up -d --build

echo "Setup complete!"

