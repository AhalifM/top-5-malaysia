import { NextRequest, NextResponse } from 'next/server';
import { getBearerToken, verifyFirebaseIdToken } from '@/lib/firebase-admin-auth';

interface TikTokOEmbedResponse {
  title?: string;
  thumbnail_url?: string;
}

interface ThumbnailResponse {
  thumbnailUrl: string;
  title: string;
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

async function fetchTikTokThumbnail(videoUrl?: string): Promise<ThumbnailResponse> {
  if (!videoUrl || !isTikTokUrl(videoUrl)) {
    throw new Error('invalid-url');
  }

  const oembedUrl = new URL('https://www.tiktok.com/oembed');
  oembedUrl.searchParams.set('url', videoUrl);

  const response = await fetch(oembedUrl, {
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('upstream-error');
  }

  const data = (await response.json()) as TikTokOEmbedResponse;

  if (!data.thumbnail_url) {
    throw new Error('missing-thumbnail');
  }

  return {
    thumbnailUrl: data.thumbnail_url,
    title: data.title ?? '',
  };
}

async function fetchTikTokThumbnailImage(videoUrl?: string): Promise<Response> {
  const data = await fetchTikTokThumbnail(videoUrl);
  const response = await fetch(data.thumbnailUrl, {
    cache: 'no-store',
    headers: {
      Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    },
  });

  if (!response.ok) {
    throw new Error('image-upstream-error');
  }

  const contentType = response.headers.get('content-type') ?? 'image/jpeg';

  if (!contentType.startsWith('image/')) {
    throw new Error('image-upstream-error');
  }

  return new Response(await response.arrayBuffer(), {
    headers: {
      'Cache-Control': 'public, max-age=21600, stale-while-revalidate=86400',
      'Content-Type': contentType,
    },
  });
}

function thumbnailErrorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : '';

  if (message === 'invalid-url') {
    return NextResponse.json({ error: 'Enter a valid TikTok video URL' }, { status: 400 });
  }

  if (message === 'upstream-error') {
    return NextResponse.json({ error: 'TikTok could not return a thumbnail for this URL' }, { status: 502 });
  }

  if (message === 'missing-thumbnail') {
    return NextResponse.json({ error: 'TikTok did not include a thumbnail for this URL' }, { status: 502 });
  }

  if (message === 'image-upstream-error') {
    return NextResponse.json({ error: 'TikTok thumbnail image could not be loaded' }, { status: 502 });
  }

  return NextResponse.json({ error: 'Failed to fetch TikTok thumbnail' }, { status: 500 });
}

export async function GET(req: NextRequest) {
  try {
    const videoUrl = req.nextUrl.searchParams.get('videoUrl') ?? undefined;

    if (req.nextUrl.searchParams.get('format') === 'image') {
      return fetchTikTokThumbnailImage(videoUrl);
    }

    const data = await fetchTikTokThumbnail(videoUrl);

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=21600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    return thumbnailErrorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  const idToken = getBearerToken(req.headers.get('authorization'));

  if (!idToken || !(await verifyFirebaseIdToken(idToken))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { videoUrl } = (await req.json()) as { videoUrl?: string };
    const data = await fetchTikTokThumbnail(videoUrl);

    return NextResponse.json(data);
  } catch (error) {
    return thumbnailErrorResponse(error);
  }
}
