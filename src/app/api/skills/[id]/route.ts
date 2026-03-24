import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Skill } from '@/models/Skill';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  
  // Auth check
  const resolvedParams = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    jwt.verify(token.value, process.env.JWT_SECRET || 'secret');
  } catch(e) {
    return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });
  }

  try {
    await Skill.findByIdAndDelete(resolvedParams.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
