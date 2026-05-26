import { getApp, getApps, initializeApp } from 'firebase/app';
import type { Analytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: 'AIzaSyC1fbP8IO1cbg0SN--1hHiM4EiwzzQWaI4',
  authDomain: 'fidz-media-service.firebaseapp.com',
  projectId: 'fidz-media-service',
  storageBucket: 'fidz-media-service.firebasestorage.app',
  messagingSenderId: '585510155419',
  appId: '1:585510155419:web:e4c443b8fc41d35947423e',
  measurementId: 'G-Q0B9N30P1W',
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
