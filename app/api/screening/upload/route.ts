import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { writeFileSync } from 'fs';
import path from 'path';
import { getDb } from '@/lib/db-init';
import { verifyToken, extractTokenFromHeader } from '@/lib/auth';
import { ensureInitialized } from '@/lib/init-service';

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

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const patient_name = formData.get('patient_name') as string;
    const age = parseInt(formData.get('age') as string);
    const gender = formData.get('gender') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!patient_name || !age || !gender) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file
    const filename = `${uuidv4()}.jpg`;
    const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
    writeFileSync(filePath, buffer);

    // Create case in database
    const caseId = 'case_' + Date.now();
    const db = getDb();
    
    db.prepare(`
      INSERT INTO cases (id, patient_name, age, gender, status, image_path, doctor_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      caseId,
      patient_name,
      age,
      gender,
      'Pending',
      `/uploads/${filename}`,
      user.id,
      new Date().toISOString()
    );

    const newCase = db.prepare('SELECT * FROM cases WHERE id = ?').get(caseId);
    db.close();

    return NextResponse.json(
      {
        success: true,
        data: {
          case_id: caseId,
          case: newCase,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API] Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
