import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

interface TikTokOEmbedResponse {
  title?: string;
  thumbnail_url?: string;
}

function isTikTokUrl(value: string): boolean {
  try {
    const url = new URL(value);
    const hostname = url.hostname.replace(/^www\./, '');
    return hostname === 'tiktok.com' || hostname.endsWith('.tiktok.com');
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  const adminSecret = process.env.ADMIN_SECRET ?? 'swifty_admin_2025';

  if (!session || session.value !== adminSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { videoUrl } = (await req.json()) as { videoUrl?: string };

  if (!videoUrl || !isTikTokUrl(videoUrl)) {
    return NextResponse.json({ error: 'Enter a valid TikTok video URL' }, { status: 400 });
  }

  const oembedUrl = new URL('https://www.tiktok.com/oembed');
  oembedUrl.searchParams.set('url', videoUrl);

  try {
    const response = await fetch(oembedUrl, {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'TikTok could not return a thumbnail for this URL' }, { status: 502 });
    }

    const data = (await response.json()) as TikTokOEmbedResponse;

    if (!data.thumbnail_url) {
      return NextResponse.json({ error: 'TikTok did not include a thumbnail for this URL' }, { status: 502 });
    }

    return NextResponse.json({
      thumbnailUrl: data.thumbnail_url,
      title: data.title ?? '',
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch TikTok thumbnail' }, { status: 500 });
  }
}
