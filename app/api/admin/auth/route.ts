import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    // Default credentials fallback if environment variables are not yet configured on the hosting platform
    const expectedUser = (process.env.ADMIN_EMAIL || process.env.ADMIN_USERNAME || 'yono@gameworld.com').trim();
    const expectedPass = (process.env.ADMIN_PASSWORD || 'Yono@game123').trim();

    if (
      username?.trim() === expectedUser &&
      password?.trim() === expectedPass
    ) {
      return NextResponse.json({ success: true, message: 'Authenticated' });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid Username or Password. Please try again.' },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'Server authentication error' },
      { status: 500 }
    );
  }
}
