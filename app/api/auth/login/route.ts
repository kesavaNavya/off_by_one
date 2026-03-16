import { NextRequest, NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { getDb } from '@/lib/db-init';
import { generateToken } from '@/lib/auth';
import { AuthResponse } from '@/lib/types';
import { ensureInitialized } from '@/lib/init-service';

export async function POST(request: NextRequest): Promise<NextResponse<AuthResponse>> {
  try {
    // Ensure database is initialized
    await ensureInitialized();

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password required' },
        { status: 400 }
      );
    }

    const db = getDb();
    const user = db
      .prepare('SELECT id, email, name, role, password_hash FROM users WHERE email = ?')
      .get(email) as any;
    db.close();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const passwordMatch = await compare(password, user.password_hash);
    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json(
      {
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        },
      },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('[API] Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
