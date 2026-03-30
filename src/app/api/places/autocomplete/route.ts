import { NextResponse } from 'next/server';

const GOOGLE_PLACES_URL =
  'https://places.googleapis.com/v1/places:autocomplete';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const input = searchParams.get('input') || '';
  const sessionToken = searchParams.get('sessionToken') || '';
  const country = searchParams.get('country') || 'ZA';

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    // Graceful fallback for local/dev without a key
    return NextResponse.json(
      {
        data: [
          { description: `${input} Farm Road, Limpopo`, placeId: 'mock-1' },
          { description: `${input} Main Street, Gauteng`, placeId: 'mock-2' },
        ],
        source: 'mock',
      },
      { status: 200 },
    );
  }

  const body = {
    input,
    sessionToken,
    includedPrimaryTypes: ['street_address', 'route', 'geocode'],
    regionCode: country,
  };

  const res = await fetch(GOOGLE_PLACES_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask':
        'places.id,places.displayName,places.formattedAddress,places.location',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { error: 'places autocomplete failed', detail: text },
      { status: 500 },
    );
  }

  const json = await res.json();
  const predictions =
    json.places?.map((p: any) => ({
      description: p.formattedAddress || p.displayName?.text || '',
      placeId: p.id,
    })) ?? [];

  return NextResponse.json({ data: predictions, source: 'google' });
}
