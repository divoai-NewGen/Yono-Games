import { NextRequest, NextResponse } from 'next/server';
import { getGames, searchGames } from '@/services/gameService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    if (query) {
      const results = await searchGames(query);
      return NextResponse.json({ success: true, games: results });
    }
    const games = await getGames();
    return NextResponse.json({ success: true, games });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch games' }, { status: 500 });
  }
}
