import { NextResponse } from 'next/server';

function firebaseAuthOnly() {
  return NextResponse.json(
    { error: 'Admin auth is handled by Firebase Authentication.' },
    { status: 410 }
  );
}

export const POST = firebaseAuthOnly;
export const DELETE = firebaseAuthOnly;
