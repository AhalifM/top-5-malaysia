import { doc, getDoc } from 'firebase/firestore';
import { getFirebaseConfig, getFirebaseDb } from './firebase';
import {
  getWhatsappPhoneFromLink,
  normalizeImageAdjustments,
  normalizeSettings,
  normalizeTheme,
  type SiteContent,
} from './content';

const contentDocumentPath = 'siteContent/main';

type FirestoreValue =
  | { nullValue: null }
  | { stringValue: string }
  | { booleanValue: boolean }
  | { integerValue: string }
  | { doubleValue: number }
  | { arrayValue: { values?: FirestoreValue[] } }
  | { mapValue: { fields?: Record<string, FirestoreValue> } };

type FirestoreDocument = {
  fields?: Record<string, FirestoreValue>;
};

export class FirebaseContentError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = 'FirebaseContentError';
  }
}

function normalizeContent(content: SiteContent): SiteContent {
  return {
    ...content,
    settings: normalizeSettings(content.settings, getWhatsappPhoneFromLink(content.hero?.ctaLink)),
    theme: normalizeTheme(content.theme),
    hero: {
      ...content.hero,
      imageAdjustments: normalizeImageAdjustments(content.hero.imageAdjustments),
    },
  };
}

function encodeFirestoreValue(value: unknown): FirestoreValue {
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
            Object.entries(value as Record<string, unknown>).map(([key, item]) => [
              key,
              encodeFirestoreValue(item),
            ])
          ),
        },
      };
    default:
      return { nullValue: null };
  }
}

function encodeFirestoreDocument(data: SiteContent): FirestoreDocument {
  return {
    fields: Object.fromEntries(
      Object.entries(normalizeContent(data)).map(([key, value]) => [key, encodeFirestoreValue(value)])
    ),
  };
}

function getDocumentUrl() {
  const firebaseConfig = getFirebaseConfig();
  const firestoreBaseUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;

  return `${firestoreBaseUrl}/${contentDocumentPath}?key=${firebaseConfig.apiKey}`;
}

export async function readContent(): Promise<SiteContent> {
  try {
    const snapshot = await getDoc(doc(getFirebaseDb(), contentDocumentPath));

    if (!snapshot.exists()) {
      throw new FirebaseContentError('Firebase content document siteContent/main was not found.', 404);
    }

    return normalizeContent(snapshot.data() as SiteContent);
  } catch (error) {
    if (error instanceof FirebaseContentError) {
      throw error;
    }

    const code = typeof error === 'object' && error !== null && 'code' in error
      ? String(error.code)
      : '';
    const status = code === 'permission-denied' ? 403 : 500;

    throw new FirebaseContentError(
      `Firebase content read failed${code ? `: ${code}` : ''}.`,
      status
    );
  }
}

export async function writeContent(data: SiteContent, idToken: string): Promise<void> {
  const response = await fetch(getDocumentUrl(), {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(encodeFirestoreDocument(data)),
  });

  if (!response.ok) {
    throw new Error(`Firebase content write failed with status ${response.status}.`);
  }
}
