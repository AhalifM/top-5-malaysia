'use client';

import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { firebaseApp } from './firebase';

export const firebaseAuth = getAuth(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);
