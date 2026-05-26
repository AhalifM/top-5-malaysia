import { firebaseConfig } from './firebase';

export async function verifyFirebaseIdToken(idToken: string): Promise<boolean> {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseConfig.apiKey}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    }
  );

  if (!response.ok) {
    return false;
  }

  const data = (await response.json()) as { users?: unknown[] };
  return Array.isArray(data.users) && data.users.length > 0;
}

export function getBearerToken(header: string | null): string | null {
  if (!header?.startsWith('Bearer ')) {
    return null;
  }

  return header.slice('Bearer '.length).trim() || null;
}
