#!/bin/bash

# Deployment script for Firebase Hosting

echo "🚀 Starting deployment to Firebase Hosting..."

# Check if firebase-tools is installed
if ! command -v firebase &> /dev/null; then
    echo "⚙️ Installing Firebase CLI tools..."
    npm install -g firebase-tools
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Login to Firebase
echo "🔑 Logging in to Firebase..."
firebase login

# Check if Firebase is initialized
if [ ! -f ".firebaserc" ] || [ ! -f "firebase.json" ]; then
    echo "🔧 Initializing Firebase project..."

    # Ask for Firebase project ID
    read -p "Enter your Firebase project ID: " project_id

    # Update .firebaserc file
    echo '{
  "projects": {
    "default": "'$project_id'"
  }
}' > .firebaserc
fi

# Set environment variables
echo "⚙️ Setting up environment variables..."
read -p "Enter your API URL (e.g., https://your-backend.run.app/api): " api_url

# Update environment.prod.ts file
sed -i '' "s|https://YOUR_CLOUD_RUN_URL/api|$api_url|g" src/environments/environment.prod.ts

# Build for production
echo "🏗️ Building application for production..."
npm run build:prod

# Deploy to Firebase
echo "🚀 Deploying to Firebase Hosting..."

if firebase deploy --only hosting --token "$FIREBASE_TOKEN"; then
  echo "✅ Deployment completed successfully!"
  echo "🌐 Your application is now live at https://$project_id.web.app"
else
  echo "❌ Deployment failed. Please check the error message above."
  exit 1
fi
