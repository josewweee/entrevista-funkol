import dotenv from 'dotenv';
import * as admin from 'firebase-admin';

dotenv.config();

// Check if Firebase is already initialized
if (!admin.apps.length) {
  // For local development with service account key
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(
      Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT, 'base64').toString()
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
  } else {
    // For production in Google Cloud (uses default credentials)
    admin.initializeApp();
  }
}

export const db = admin.firestore();
export const auth = admin.auth();

export default admin;
