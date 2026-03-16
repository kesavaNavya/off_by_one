import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db-init';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';
import { Case } from '@/lib/types';
import { ensureInitialized } from '@/lib/init-service';

export async function GET(request: NextRequest) {
  try {
    await ensureInitialized();

    const authHeader = request.headers.get('authorization');
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const db = getDb();
    const cases = db
      .prepare('SELECT * FROM cases WHERE doctor_id = ? ORDER BY created_at DESC')
      .all(user.id) as Case[];
    db.close();

    return NextResponse.json(
      {
        success: true,
        data: cases,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API] Get cases error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
