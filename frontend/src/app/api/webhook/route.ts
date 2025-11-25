import { NextRequest, NextResponse } from 'next/server';
import { invalidateCache } from '@/lib/strapi';

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRAPI_WEBHOOK_SECRET;
  const signature = request.headers.get('X-Strapi-Webhook-Signature');

  if (!webhookSecret || signature !== webhookSecret) {
    console.log('[Webhook] Verification failed');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { event, model, entry } = body;

  console.log(`[Webhook] ${event} on ${model}${entry?.slug ? `:${entry.slug}` : ''}${entry?.locale ? ` (${entry.locale})` : ''}`);

  // Invalidate cache based on model/slug/locale
  invalidateCache(model, entry?.slug, entry?.locale);

  return NextResponse.json({ received: true });
}
