import { NextResponse } from 'next/server';

// project_revisions table does not exist in the current DB schema.
// These routes return stub responses until the schema is expanded.

export async function GET() {
  return NextResponse.json({ success: true, data: [] });
}

export async function POST() {
  return NextResponse.json(
    { success: false, error: 'This module needs schema expansion' },
    { status: 503 }
  );
}
