'use client';

import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirebaseApp } from './firebase';

export const firebaseAuth = getAuth(getFirebaseApp());
export const firebaseStorage = getStorage(getFirebaseApp());
