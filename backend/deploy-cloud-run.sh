#!/bin/bash

# Deployment script for Google Cloud Run

echo "🚀 Starting deployment to Google Cloud Run..."

# Exit on error
set -e

# Set default variables
PROJECT_ID=""
SERVICE_NAME="entrevista-funkol-api"
REGION="us-central1"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  key="$1"
  case $key in
    --project-id)
      PROJECT_ID="$2"
      shift
      shift
      ;;
    --service-name)
      SERVICE_NAME="$2"
      shift
      shift
      ;;
    --region)
      REGION="$2"
      shift
      shift
      ;;
    *)
      shift
      ;;
  esac
done

# Check if required tools are installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Error: Google Cloud SDK (gcloud) is not installed."
    echo "Please install it: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if project ID is provided
if [ -z "$PROJECT_ID" ]; then
    # Try to get the default project
    PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
    
    if [ -z "$PROJECT_ID" ]; then
        echo "❌ Error: Please provide a Google Cloud project ID."
        echo "Usage: ./deploy-cloud-run.sh --project-id=your-project-id"
        exit 1
    else
        read -p "🔍 Using project ID: $PROJECT_ID. Continue? (y/n) " confirm
        if [[ $confirm != "y" && $confirm != "Y" ]]; then
            echo "Please specify a project ID with --project-id=your-project-id"
            exit 1
        fi
    fi
fi

echo "🔑 Authenticating with Google Cloud..."
gcloud auth login

# Set the current project
echo "🔧 Setting project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

# Enable required services
echo "🔧 Enabling required services..."
gcloud services enable cloudbuild.googleapis.com run.googleapis.com artifactregistry.googleapis.com

# Check if serviceAccountKey.json exists
if [ ! -f "serviceAccountKey.json" ]; then
    echo "❌ Error: serviceAccountKey.json file not found."
    echo "Please place your Firebase service account key in the current directory."
    exit 1
fi

# Encode service account key as a base64 string
echo "🔒 Preparing service account key..."
SERVICE_ACCOUNT_B64=$(base64 -i serviceAccountKey.json | tr -d '\n')

# Build and push the Docker image
echo "🏗️ Building and pushing Docker image..."
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME:$(date +%Y%m%d-%H%M%S)"
gcloud builds submit --tag $IMAGE_NAME

# Deploy to Cloud Run with service account as environment variable
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --memory 256Mi \
  --min-instances 0 \
  --max-instances 10 \
  --set-env-vars "NODE_ENV=production,FIREBASE_SERVICE_ACCOUNT_BASE64=$SERVICE_ACCOUNT_B64"

# Get the deployed service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --platform managed --region $REGION --format 'value(status.url)')

if [ -z "$SERVICE_URL" ]; then
  echo "❌ Deployment might have failed. Please check the error messages above."
  exit 1
fi

echo "✅ Deployment completed successfully!"
echo "🌐 Your API is now live at: $SERVICE_URL"
echo ""
echo "Don't forget to update your frontend environment configuration with the new API URL:"
echo "API_URL=${SERVICE_URL}/api" 