import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db-init';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';
import type { DRSeverity } from '@/lib/types';
import { ensureInitialized } from '@/lib/init-service';

const DR_SEVERITIES: DRSeverity[] = ['None', 'Mild', 'Moderate', 'Severe', 'Proliferative'];

function generateMockPrediction(caseId: string) {
  // Generate consistent but varied predictions for demo
  const seed = caseId.split('_')[1] ? parseInt(caseId.split('_')[1]) : 0;
  const randomValue = (seed * 9301 + 49297) % 233280;
  const index = Math.floor((randomValue / 233280) * DR_SEVERITIES.length);
  const severity = DR_SEVERITIES[index] || 'Mild';
  const confidence = 0.75 + (randomValue % 25) / 100;

  return {
    severity,
    confidence: Math.min(0.99, confidence),
    description: `AI analysis indicates ${severity.toLowerCase()} diabetic retinopathy with ${(confidence * 100).toFixed(1)}% confidence.`,
  };
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { case_id } = body;

    if (!case_id) {
      return NextResponse.json(
        { success: false, error: 'case_id is required' },
        { status: 400 }
      );
    }

    const db = getDb();
    const caseData = db
      .prepare('SELECT * FROM cases WHERE id = ? AND doctor_id = ?')
      .get(case_id, user.id) as any;

    if (!caseData) {
      db.close();
      return NextResponse.json(
        { success: false, error: 'Case not found' },
        { status: 404 }
      );
    }

    // Generate mock prediction
    const prediction = generateMockPrediction(case_id);

    // Update case with prediction
    db.prepare(
      'UPDATE cases SET prediction = ?, confidence = ?, status = ? WHERE id = ?'
    ).run(prediction.severity, prediction.confidence, 'In Progress', case_id);

    db.close();

    return NextResponse.json(
      {
        success: true,
        data: prediction,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API] Prediction error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
