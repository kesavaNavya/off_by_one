import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db-init';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';
import { ensureInitialized } from '@/lib/init-service';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureInitialized();

    const { id } = await params;
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
    const caseData = db
      .prepare('SELECT * FROM cases WHERE id = ? AND doctor_id = ?')
      .get(id, user.id) as any;

    if (!caseData) {
      db.close();
      return NextResponse.json(
        { success: false, error: 'Case not found' },
        { status: 404 }
      );
    }

    // Update case status to Resolved
    db.prepare(
      'UPDATE cases SET status = ?, resolved_at = ? WHERE id = ?'
    ).run('Resolved', new Date().toISOString(), id);

    const updatedCase = db
      .prepare('SELECT * FROM cases WHERE id = ?')
      .get(id);

    db.close();

    return NextResponse.json(
      {
        success: true,
        data: updatedCase,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API] Resolve case error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
