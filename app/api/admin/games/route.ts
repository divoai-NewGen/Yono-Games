import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getGames, createGame, updateGame, deleteGame } from '@/services/gameService';
import { Game } from '@/types/game';

function revalidateAllGamePaths(slug?: string) {
  try {
    revalidatePath('/');
    revalidatePath('/home');
    revalidatePath('/games');
    revalidatePath('/sitemap.xml');
    if (slug) {
      revalidatePath(`/games/${slug}`);
    }
    revalidatePath('/games/[slug]', 'page');
  } catch (err) {
    console.error('Revalidation error:', err);
  }
}

// GET all games
export async function GET() {
  try {
    const games = await getGames();
    return NextResponse.json({ success: true, games });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errMessage || 'Failed to fetch games' }, { status: 500 });
  }
}

// POST create new game
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Required fields check
    if (!body.name || !body.category) {
      return NextResponse.json(
        { error: 'Name and Category are required.' },
        { status: 400 }
      );
    }

    let downloadUrl: string | null = null;
    if (typeof body.downloadUrl === 'string' && body.downloadUrl.trim()) {
      const trimmed = body.downloadUrl.trim();
      try {
        const parsed = new URL(trimmed);
        if (['http:', 'https:'].includes(parsed.protocol)) {
          downloadUrl = trimmed;
        } else {
          return NextResponse.json(
            { error: 'Invalid download URL protocol. Only HTTP and HTTPS are allowed.' },
            { status: 400 }
          );
        }
      } catch {
        return NextResponse.json(
          { error: 'Invalid download URL format. Must be a valid absolute URL.' },
          { status: 400 }
        );
      }
    }

    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const id = body.id || slug;

    const newGame: Game = {
      id,
      slug,
      name: body.name,
      tagline: body.tagline || 'Experience Premium Online Gaming with Instant Rewards',
      logo: body.logo || '/images/hero-vibrant-3d.png',
      thumbnail: body.thumbnail || body.logo || '/images/hero-vibrant-3d.png',
      heroImage: body.heroImage || body.logo || '/images/hero-vibrant-3d.png',
      screenshots: body.screenshots && body.screenshots.length > 0 
        ? body.screenshots 
        : [body.logo || '/images/hero-vibrant-3d.png'],
      category: body.category,
      categories: body.categories || [body.category],
      rating: body.rating || 4.8,
      ratingCount: body.ratingCount || '24.5K reviews',
      players: body.players || '25,000+ Online',
      downloads: body.downloads || '1.2M+ Downloads',
      bonus: body.bonus || '₹1,000 Welcome Bonus',
      shortDescription: body.shortDescription || `${body.name} official APK download on Yono Games.`,
      description: body.description || `${body.name} is a high-octane casual gaming experience with instant cash withdrawals.`,
      features: body.features && body.features.length > 0 ? body.features : [
        'Certified Random Number Generator (RNG) fair play standard',
        'Instant withdrawal processing with round-the-clock support',
        'Daily login rewards and exclusive VIP loyalty perks'
      ],
      howToPlay: body.howToPlay && body.howToPlay.length > 0 ? body.howToPlay : [
        `Download and launch the ${body.name} application on your mobile device`,
        'Choose your preferred table room based on stakes',
        'Withdraw your earnings directly to your UPI ID'
      ],
      downloadUrl,
      version: body.version || 'v5.0.1',
      size: body.size || '42.0 MB',
      featured: Boolean(body.featured),
      newRelease: Boolean(body.newRelease),
      popular: Boolean(body.popular !== false),
      seoTitle: body.seoTitle || `${body.name} APK Download (Official 2026) | Yono Games`,
      seoDescription: body.seoDescription || `Download ${body.name} official APK. Enjoy instant withdrawals, free welcome bonus, and certified fair play.`,
    };

    const savedGame = await createGame(newGame);
    revalidateAllGamePaths(newGame.slug);

    return NextResponse.json({
      success: true,
      message: 'Game published successfully!',
      game: savedGame,
    });
  } catch (error: unknown) {
    console.error('Error creating game:', error);
    const errMessage = error instanceof Error ? error.message : 'Failed to create game';
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}

// PUT update existing game
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: 'Game ID is required to update.' }, { status: 400 });
    }

    const updates = { ...body };
    if (updates.downloadUrl !== undefined) {
      if (typeof updates.downloadUrl === 'string' && updates.downloadUrl.trim()) {
        const trimmed = updates.downloadUrl.trim();
        try {
          const parsed = new URL(trimmed);
          if (['http:', 'https:'].includes(parsed.protocol)) {
            updates.downloadUrl = trimmed;
          } else {
            return NextResponse.json(
              { error: 'Invalid download URL protocol. Only HTTP and HTTPS are allowed.' },
              { status: 400 }
            );
          }
        } catch {
          return NextResponse.json(
            { error: 'Invalid download URL format. Must be a valid absolute URL.' },
            { status: 400 }
          );
        }
      } else {
        updates.downloadUrl = null;
      }
    }

    const updated = await updateGame(body.id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Game not found.' }, { status: 404 });
    }

    revalidateAllGamePaths(updated.slug);

    return NextResponse.json({
      success: true,
      message: 'Game updated successfully!',
      game: updated,
    });
  } catch (error: unknown) {
    console.error('Error updating game:', error);
    const errMessage = error instanceof Error ? error.message : 'Failed to update game';
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}

// DELETE game by id
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Game ID is required.' }, { status: 400 });
    }

    const deleted = await deleteGame(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Game not found or already deleted.' }, { status: 404 });
    }

    revalidateAllGamePaths();

    return NextResponse.json({
      success: true,
      message: 'Game deleted successfully!',
    });
  } catch (error: unknown) {
    console.error('Error deleting game:', error);
    const errMessage = error instanceof Error ? error.message : 'Failed to delete game';
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
