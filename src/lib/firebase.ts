import { getApp, getApps, initializeApp } from 'firebase/app';
import type { Analytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

function requiredPublicEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const firebaseConfig = {
  apiKey: requiredPublicEnv('NEXT_PUBLIC_FIREBASE_API_KEY'),
  authDomain: requiredPublicEnv('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: requiredPublicEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: requiredPublicEnv('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: requiredPublicEnv('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: requiredPublicEnv('NEXT_PUBLIC_FIREBASE_APP_ID'),
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const firebaseDb = getFirestore(firebaseApp);

let analyticsPromise: Promise<Analytics | null> | undefined;

export function getFirebaseAnalytics() {
  if (typeof window === 'undefined') {
    return Promise.resolve(null);
  }

  analyticsPromise ??= import('firebase/analytics')
    .then(async ({ getAnalytics, isSupported }) => {
      if (!(await isSupported())) {
        return null;
      }

      return getAnalytics(firebaseApp);
    })
    .catch((error) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Firebase Analytics failed to initialize:', error);
      }

      return null;
    });

  return analyticsPromise;
}
