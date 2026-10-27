import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getGames, createGame, updateGame, deleteGame, moveGameToTop } from '@/services/gameService';
import { Game } from '@/types/game';
import { validateExternalDownloadUrl, generateAutoSeo } from '@/utils/seoGenerator';

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

    const urlValidation = validateExternalDownloadUrl(body.downloadUrl);
    if (!urlValidation.isValid) {
      return NextResponse.json(
        { error: urlValidation.error || 'Invalid external download URL. Only secure HTTPS URLs are permitted.' },
        { status: 400 }
      );
    }
    const downloadUrl = urlValidation.normalizedUrl;

    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const id = body.id || slug;

    const autoSeo = generateAutoSeo({
      name: body.name,
      category: body.category,
      bonus: body.bonus,
      version: body.version,
      size: body.size,
      downloadUrl,
      existingDescription: body.description,
    });

    const newGame: Game = {
      id,
      slug,
      name: body.name,
      tagline: body.tagline || 'Explore Popular Mobile Games & Player Resources',
      logo: body.logo || '/images/hero-vibrant-3d.png',
      thumbnail: body.thumbnail || body.logo || '/images/hero-vibrant-3d.png',
      heroImage: body.heroImage || body.logo || '/images/hero-vibrant-3d.png',
      screenshots: body.screenshots && body.screenshots.length > 0 
        ? body.screenshots 
        : [body.logo || '/images/hero-vibrant-3d.png'],
      category: body.category,
      categories: body.categories || [body.category],
      rating: body.rating || 4.5,
      ratingCount: body.ratingCount || '',
      players: body.players || '',
      downloads: body.downloads || '',
      bonus: body.bonus || '',
      shortDescription: body.shortDescription || `${body.name} mobile game overview and guide on Real Yono Games.`,
      description: body.description || `${body.name} is a mobile game available in the ${body.category} category. Read game specifications and instructions before downloading.`,
      features: body.features && body.features.length > 0 ? body.features : [
        'Mobile-optimized interactive gameplay',
        'Intuitive lobby and multiplayer game modes',
        'Regular gameplay challenges and rewards'
      ],
      howToPlay: body.howToPlay && body.howToPlay.length > 0 ? body.howToPlay : [
        `Download and install ${body.name} on your compatible device`,
        'Complete registration or continue via guest access',
        'Select your preferred game table to begin'
      ],
      downloadUrl,
      version: body.version || '',
      size: body.size || '',
      featured: Boolean(body.featured),
      newRelease: Boolean(body.newRelease),
      popular: Boolean(body.popular !== false),
      pinned: Boolean(body.pinned),
      order: body.order !== undefined && body.order !== '' ? Number(body.order) : undefined,
      seoTitle: body.seoTitle || autoSeo.seoTitle,
      seoDescription: body.seoDescription || autoSeo.seoDescription,
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

    // Quick action: Move game to #1 Top position
    if (body.action === 'moveToTop') {
      const moved = await moveGameToTop(body.id);
      if (!moved) {
        return NextResponse.json({ error: 'Game not found.' }, { status: 404 });
      }
      revalidateAllGamePaths(moved.slug);
      return NextResponse.json({
        success: true,
        message: `${moved.name} moved to #1 Top position!`,
        game: moved,
      });
    }

    const updates = { ...body };
    if (updates.downloadUrl !== undefined) {
      const urlValidation = validateExternalDownloadUrl(updates.downloadUrl);
      if (!urlValidation.isValid) {
        return NextResponse.json(
          { error: urlValidation.error || 'Invalid external download URL. Only secure HTTPS URLs are permitted.' },
          { status: 400 }
        );
      }
      updates.downloadUrl = urlValidation.normalizedUrl;
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
