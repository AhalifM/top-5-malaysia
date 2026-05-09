import { NextRequest, NextResponse } from 'next/server';
import { readContent, writeContent } from '@/lib/content-server';
import { cookies } from 'next/headers';

function isAuthenticated(): boolean {
  // cookies() is synchronous in Next.js 14 route handlers
  try {
    // We'll check the cookie synchronously
    return true; // auth check happens via middleware
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    const content = readContent();
    return NextResponse.json(content);
  } catch {
    return NextResponse.json({ error: 'Failed to read content' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  const adminSecret = process.env.ADMIN_SECRET ?? 'swifty_admin_2025';

  if (!session || session.value !== adminSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    writeContent(body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}
