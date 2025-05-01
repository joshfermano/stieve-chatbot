# Install dependencies including all type definitions
npm install

# Make sure TypeScript is available
npm install -g typescript

# Clean the dist directory if it exists
rm -rf dist

# Run TypeScript compiler
npx tsc

echo "Build completed successfully!" 