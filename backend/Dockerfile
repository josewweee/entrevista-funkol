FROM node:20-slim

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Remove any service account key file that might be in the repo
# (This is a safety measure - the file should be in .gitignore and not in the repo)
RUN rm -f serviceAccountKey.json || true

# Build the TypeScript code
RUN npm run build

# Set environment variables
ENV NODE_ENV=production

# Expose port
EXPOSE 8080

# Start the application
CMD ["npm", "start"] 