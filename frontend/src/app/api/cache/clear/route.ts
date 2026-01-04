import { NextRequest, NextResponse } from 'next/server';
import { clearAllCaches } from '@/lib/strapi';

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRAPI_WEBHOOK_SECRET;
  const signature = request.headers.get('X-Strapi-Webhook-Signature');

  if (!webhookSecret || signature !== webhookSecret) {
    console.log('[Cache Clear] Verification failed');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  clearAllCaches();

  return NextResponse.json({
    success: true,
    message: 'All caches cleared',
    timestamp: new Date().toISOString()
  });
}

export async function GET(request: NextRequest) {
  const webhookSecret = process.env.STRAPI_WEBHOOK_SECRET;
  const signature = request.headers.get('X-Strapi-Webhook-Signature');
  const querySecret = request.nextUrl.searchParams.get('secret');

  if (!webhookSecret || (signature !== webhookSecret && querySecret !== webhookSecret)) {
    console.log('[Cache Clear] Verification failed');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  clearAllCaches();

  return NextResponse.json({
    success: true,
    message: 'All caches cleared',
    timestamp: new Date().toISOString()
  });
}
