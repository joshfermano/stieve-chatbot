#!/bin/bash

# Debugging info
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "Current directory: $(pwd)"
echo "Directory contents:"
ls -la

# Install all dependencies including dev dependencies
npm install

# Create types directory if it doesn't exist
mkdir -p src/types/express

# Ensure typescript is installed globally on Render
npm install -g typescript

# Run the TypeScript compiler
npx tsc

# Verify build output
echo "Build completed. Contents of dist directory:"
ls -la dist 