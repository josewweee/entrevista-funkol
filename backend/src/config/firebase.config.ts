import dotenv from 'dotenv';
import * as admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

// Load environment variables - first try .env.development, then .env
dotenv.config({ path: path.resolve(process.cwd(), '.env.development') });
dotenv.config();

// Check if Firebase is already initialized
if (!admin.apps.length) {
  try {
    let credential;

    // Check for base64 encoded service account (for Cloud Run)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
      try {
        // Decode the base64 string to JSON
        const serviceAccountJson = Buffer.from(
          process.env.FIREBASE_SERVICE_ACCOUNT_BASE64,
          'base64'
        ).toString('utf8');

        const serviceAccount = JSON.parse(serviceAccountJson);
        credential = admin.credential.cert(serviceAccount);
        console.log('Using Firebase service account from environment variable');
      } catch (error) {
        console.error('Error parsing service account from environment:', error);
        throw error;
      }
    } else {
      // Traditional file path for local development
      const serviceAccountPath =
        process.env.GOOGLE_APPLICATION_CREDENTIALS ||
        path.join(process.cwd(), 'serviceAccountKey.json');

      console.log(`Using service account from file: ${serviceAccountPath}`);
      credential = admin.credential.cert(serviceAccountPath);
    }

    admin.initializeApp({
      credential,
      // For Firestore in native mode with a custom URL
      databaseURL: 'https://entrevista-funkol.firebaseio.com',
    });

    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    throw error;
  }
}

export const db = admin.firestore();
export const auth = admin.auth();

export default admin;
