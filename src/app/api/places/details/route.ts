import { NextResponse } from 'next/server';

const GOOGLE_PLACES_DETAILS =
  'https://places.googleapis.com/v1/places/';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get('placeId');

  if (!placeId) {
    return NextResponse.json({ error: 'placeId required' }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      data: {
        placeId,
        formattedAddress: 'Mock address',
        location: { lat: -26.2041, lng: 28.0473 },
      },
      source: 'mock',
    });
  }

  const res = await fetch(
    `${GOOGLE_PLACES_DETAILS}${encodeURIComponent(placeId)}`,
    {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask':
          'id,formattedAddress,location,displayName',
      },
    },
  );

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { error: 'place details failed', detail: text },
      { status: 500 },
    );
  }

  const json = await res.json();
  return NextResponse.json({
    data: {
      placeId: json.id,
      formattedAddress: json.formattedAddress || json.displayName?.text,
      location: json.location,
    },
    source: 'google',
  });
}
