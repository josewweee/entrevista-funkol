# Firebase Hosting Deployment Guide

This guide provides step-by-step instructions for deploying the Ionic/Angular application to Firebase Hosting.

## Prerequisites

- Node.js and npm installed
- Firebase account
- Firebase CLI tools

## Manual Deployment

1. **Install Firebase CLI tools globally (if not already installed)**

```bash
npm install -g firebase-tools
```

2. **Login to Firebase**

```bash
npm run firebase:login
```

3. **Initialize Firebase in your project (first time only)**

   If you haven't already set up the Firebase configuration:

```bash
npm run firebase:init
```

4. **Update Environment Variables**

   Update the `src/environments/environment.prod.ts` file with your production API URL:

```typescript
export const environment = {
  production: true,
  apiUrl: "https://your-backend-url.run.app/api",
  googleClientId: "your-google-client-id",
};
```

5. **Build and Deploy**

```bash
npm run deploy
```

## CI/CD Deployment with GitHub Actions

For automated deployments via GitHub Actions, you'll need to set up the following secrets in your GitHub repository:

- `API_URL`: Your backend API URL
- `FIREBASE_PROJECT_ID`: Your Firebase project ID
- `FIREBASE_SERVICE_ACCOUNT`: Firebase service account credentials JSON (as a secret)

The GitHub Actions workflow will automatically deploy to Firebase Hosting when you push to the main branch.

## Environment Variables

Create a `.env` file based on the `.env.example` template and fill in your specific values:

```
# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id

# API Configuration
API_URL=https://your-cloud-run-backend-url.run.app/api

# Google Auth
GOOGLE_CLIENT_ID=your-google-client-id
```

## Additional Configuration

For more advanced configurations:

1. **Custom Domains**

   Set up a custom domain in Firebase Hosting console.

2. **Caching Rules**

   Cache rules are already configured in `firebase.json` for optimal performance.

3. **Security Headers**

   Add additional security headers in `firebase.json` as needed.
