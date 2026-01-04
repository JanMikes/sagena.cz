import { NextRequest, NextResponse } from 'next/server';
import { getCacheStatus } from '@/lib/strapi';

export async function GET(request: NextRequest) {
  const webhookSecret = process.env.STRAPI_WEBHOOK_SECRET;
  const querySecret = request.nextUrl.searchParams.get('secret');

  if (!webhookSecret || querySecret !== webhookSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const status = getCacheStatus();

  return NextResponse.json(status, { status: 200 });
}
