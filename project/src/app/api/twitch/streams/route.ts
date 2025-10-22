// app/api/twitch/streams/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getStreamsByGameName } from '@/lib/streams';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const gameName = searchParams.get('game');
  const limit = parseInt(searchParams.get('limit') || '6');

  if (!gameName) {
    return NextResponse.json({ error: 'Game name is required' }, { status: 400 });
  }

  try {
    const streams = await getStreamsByGameName(gameName, limit);
    return NextResponse.json({ streams });
  } catch (error) {
    console.error('Error in Twitch streams API:', error);
    return NextResponse.json({ error: 'Failed to fetch streams' }, { status: 500 });
  }
}