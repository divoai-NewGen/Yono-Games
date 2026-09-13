import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const expectedUser = (process.env.ADMIN_EMAIL || process.env.ADMIN_USERNAME || 'admin').trim();
    const expectedPass = (process.env.ADMIN_PASSWORD || '').trim();

    if (!expectedPass) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ADMIN_PASSWORD is not configured in .env file. Please define ADMIN_PASSWORD in .env' 
        },
        { status: 500 }
      );
    }

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
