import { getApp, getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import type { Analytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
} satisfies Partial<FirebaseOptions>;

export function getFirebaseConfig(): FirebaseOptions {
  const missingFirebaseConfig = Object.entries(firebaseConfig)
    .filter(([key, value]) => key !== 'measurementId' && !value)
    .map(([key]) => key);

  if (missingFirebaseConfig.length > 0) {
    throw new Error(`Missing Firebase environment config: ${missingFirebaseConfig.join(', ')}`);
  }

  return firebaseConfig as FirebaseOptions;
}

export function getFirebaseApp(): FirebaseApp {
  return getApps().length > 0 ? getApp() : initializeApp(getFirebaseConfig());
}

export function getFirebaseDb() {
  return getFirestore(getFirebaseApp());
}

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

      return getAnalytics(getFirebaseApp());
    })
    .catch((error) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Firebase Analytics failed to initialize:', error);
      }

      return null;
    });

  return analyticsPromise;
}
