import { NextRequest, NextResponse } from 'next/server';
import { readContent, writeContent } from '@/lib/content-server';
import { getBearerToken, verifyFirebaseIdToken } from '@/lib/firebase-admin-auth';

export async function GET() {
  try {
    const content = await readContent();
    return NextResponse.json(content);
  } catch {
    return NextResponse.json({ error: 'Failed to read content' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const idToken = getBearerToken(req.headers.get('authorization'));

  if (!idToken || !(await verifyFirebaseIdToken(idToken))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    await writeContent(body, idToken);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}
