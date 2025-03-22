# Backend Deployment Guide for Google Cloud Run

This guide provides step-by-step instructions for deploying the Node.js/Express backend to Google Cloud Run.

## Prerequisites

- Google Cloud account with billing enabled
- Google Cloud SDK (gcloud) installed locally
- Docker installed (for local testing)
- Firebase project configured (for Firestore database)

## Environment Variables

Before deploying, make sure you have the following environment variables set up:

```
# Server Configuration
PORT=8080
NODE_ENV=production

# Authentication
JWT_SECRET=your-jwt-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
```

## Service Account Key (Secure Handling)

Our deployment approach securely handles the Firebase service account key:

1. The script encodes your serviceAccountKey.json file to base64
2. The encoded string is passed as an environment variable to Cloud Run
3. Your application decodes and uses the service account credentials at runtime

For local development, place your serviceAccountKey.json in the backend directory.

## Manual Deployment

### 1. Install Google Cloud SDK

Follow the instructions at https://cloud.google.com/sdk/docs/install to install the Google Cloud SDK.

### 2. Prepare your service account key

Download your Firebase service account key from the Firebase console:

1. Go to Firebase Console > Project Settings > Service Accounts
2. Click "Generate New Private Key"
3. Save the file as `serviceAccountKey.json` in your backend directory

### 3. Run the deployment script

Make the script executable:

```bash
chmod +x deploy-cloud-run.sh
```

Then run it, specifying your Google Cloud project ID:

```bash
./deploy-cloud-run.sh --project-id=your-project-id
```

You can also customize the service name and region:

```bash
./deploy-cloud-run.sh --project-id=your-project-id --service-name=my-api --region=us-west1
```

The script will:

- Encode your service account key to base64
- Build and deploy your application
- Pass the encoded key as an environment variable

### 4. Update frontend configuration

After deployment, update your frontend's environment.prod.ts file with the new API URL provided by the deployment script.

## Manual Steps (without script)

If you prefer to deploy without using the script, follow these steps:

### 1. Encode the service account key

```bash
# Set your Google Cloud project ID
export PROJECT_ID=your-project-id

# Encode service account key as base64
SERVICE_ACCOUNT_B64=$(base64 -i serviceAccountKey.json | tr -d '\n')
```

### 2. Build and push the Docker image

```bash
# Build and push the image
gcloud builds submit --tag gcr.io/$PROJECT_ID/entrevista-funkol-api
```

### 3. Deploy to Cloud Run with environment variable

```bash
gcloud run deploy entrevista-funkol-api \
  --image gcr.io/$PROJECT_ID/entrevista-funkol-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 256Mi \
  --min-instances 0 \
  --max-instances 10 \
  --set-env-vars "NODE_ENV=production,FIREBASE_SERVICE_ACCOUNT_BASE64=$SERVICE_ACCOUNT_B64"
```

## Handling Additional Secrets

For other sensitive information like API keys and JWT secrets, you can pass them as environment variables:

```bash
gcloud run deploy entrevista-funkol-api \
  --image gcr.io/$PROJECT_ID/entrevista-funkol-api \
  --platform managed \
  --region us-central1 \
  --set-env-vars "NODE_ENV=production,FIREBASE_SERVICE_ACCOUNT_BASE64=$SERVICE_ACCOUNT_B64,JWT_SECRET=your-jwt-secret"
```

## CI/CD Setup (Optional)

For continuous deployment, consider setting up a Cloud Build trigger that:

1. Builds your Docker image
2. Deploys to Cloud Run with environment variables securely set
3. Updates your frontend configuration

A sample cloudbuild.yaml file is included in the repository.
