import { NextRequest, NextResponse } from 'next/server';
import { invalidateCache } from '@/lib/strapi';

/**
 * Normalize Strapi model name from UID format
 * Strapi 5 sends model as "api::page.page", we need just "page"
 */
function normalizeModelName(model: string): string {
  // Handle Strapi 5 UID format: "api::page.page" -> "page"
  if (model.includes('::')) {
    const parts = model.split('::');
    if (parts.length === 2) {
      // Handle "page.page" -> "page"
      return parts[1].split('.')[0];
    }
  }
  return model;
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRAPI_WEBHOOK_SECRET;
  const signature = request.headers.get('X-Strapi-Webhook-Signature');

  console.log('[Webhook] Received request');
  console.log('[Webhook] Secret configured:', !!webhookSecret);
  console.log('[Webhook] Signature received:', !!signature);

  if (!webhookSecret || signature !== webhookSecret) {
    console.log('[Webhook] Verification failed - secret mismatch or missing');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { event, model: rawModel, entry } = body;

    // Normalize model name from Strapi 5 UID format
    const model = normalizeModelName(rawModel);

    console.log(`[Webhook] Processing: ${event} on ${rawModel} (normalized: ${model})${entry?.slug ? ` slug:${entry.slug}` : ''}${entry?.locale ? ` locale:${entry.locale}` : ''}`);

    // Invalidate cache based on model/slug/locale
    await invalidateCache(model, entry?.slug, entry?.locale);

    return NextResponse.json({
      received: true,
      processed: {
        event,
        model,
        slug: entry?.slug,
        locale: entry?.locale,
      },
    });
  } catch (error) {
    console.error('[Webhook] Error processing payload:', error);
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
