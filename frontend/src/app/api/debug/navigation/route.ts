import { NextRequest, NextResponse } from 'next/server';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export async function GET(request: NextRequest) {
  const webhookSecret = process.env.STRAPI_WEBHOOK_SECRET;
  const querySecret = request.nextUrl.searchParams.get('secret');

  if (!webhookSecret || querySecret !== webhookSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const locale = request.nextUrl.searchParams.get('locale') || 'cs';

  try {
    // Fetch raw navigation data from Strapi
    const url = new URL('/api/navigations', STRAPI_URL);
    url.searchParams.set('locale', locale);
    url.searchParams.set('populate[link][populate]', 'page,file');

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      cache: 'no-store',
    });

    const data = await response.json();

    // Return debug info
    return NextResponse.json({
      strapiUrl: STRAPI_URL,
      locale,
      totalItems: data.data?.length || 0,
      items: data.data?.map((item: any) => ({
        id: item.id,
        title: item.title,
        navbar: item.navbar,
        footer: item.footer,
        linkType: item.link?.type,
        linkPage: item.link?.page?.slug || null,
        linkUrl: item.link?.url || null,
      })),
      rawResponse: data,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to fetch navigation',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
