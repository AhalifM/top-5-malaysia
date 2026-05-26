import fs from 'node:fs/promises';
import path from 'node:path';

const firebaseConfig = {
  apiKey: 'AIzaSyC1fbP8IO1cbg0SN--1hHiM4EiwzzQWaI4',
  projectId: 'fidz-media-service',
};

const email = process.env.FIREBASE_ADMIN_EMAIL;
const password = process.env.FIREBASE_ADMIN_PASSWORD;
const allowUnauthenticatedSeed = process.env.FIREBASE_ALLOW_UNAUTHENTICATED_SEED === '1';

if (!allowUnauthenticatedSeed && (!email || !password)) {
  console.error('Set FIREBASE_ADMIN_EMAIL and FIREBASE_ADMIN_PASSWORD before running this script.');
  process.exit(1);
}

function encodeFirestoreValue(value) {
  if (value === null || value === undefined) {
    return { nullValue: null };
  }

  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(encodeFirestoreValue) } };
  }

  switch (typeof value) {
    case 'string':
      return { stringValue: value };
    case 'boolean':
      return { booleanValue: value };
    case 'number':
      return Number.isInteger(value)
        ? { integerValue: String(value) }
        : { doubleValue: value };
    case 'object':
      return {
        mapValue: {
          fields: Object.fromEntries(
            Object.entries(value).map(([key, item]) => [key, encodeFirestoreValue(item)])
          ),
        },
      };
    default:
      return { nullValue: null };
  }
}

async function signIn() {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    }
  );

  if (!response.ok) {
    throw new Error(`Firebase sign-in failed with status ${response.status}.`);
  }

  const data = await response.json();
  return data.idToken;
}

async function main() {
  const contentPath = path.join(process.cwd(), 'data', 'content.json');
  const content = JSON.parse(await fs.readFile(contentPath, 'utf-8'));
  const idToken = allowUnauthenticatedSeed ? null : await signIn();
  const document = {
    fields: Object.fromEntries(
      Object.entries(content).map(([key, value]) => [key, encodeFirestoreValue(value)])
    ),
  };

  const response = await fetch(
    `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/siteContent/main?key=${firebaseConfig.apiKey}`,
    {
      method: 'PATCH',
      headers: {
        ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(document),
    }
  );

  if (!response.ok) {
    throw new Error(`Firestore write failed with status ${response.status}.`);
  }

  console.log('Seeded Firestore document: siteContent/main');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
