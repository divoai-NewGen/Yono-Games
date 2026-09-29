import { NextRequest, NextResponse } from 'next/server';
import { getGames, searchGames } from '@/services/gameService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    if (query) {
      const results = await searchGames(query);
      return NextResponse.json(
        { success: true, games: results },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
          },
        }
      );
    }
    const games = await getGames();
    return NextResponse.json(
      { success: true, games },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch games';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
