#!/bin/bash

# Deployment script for WinHire Backend
set -e

echo "Starting deployment..."

# Navigate to project directory
cd WinHire.Backend

# Restore and publish
echo "Building project..."
dotnet publish -c Release -o $DEPLOYMENT_TARGET

echo "Deployment completed successfully!"
