import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Contact } from '@/models/Contact';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  
  const resolvedParams = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('token');
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    jwt.verify(token.value, process.env.JWT_SECRET || 'secret');
    await Contact.findByIdAndDelete(resolvedParams.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
