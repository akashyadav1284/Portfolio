import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Project } from '@/models/Project';
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
  } catch(e) {
    return NextResponse.json({ error: 'Invalid Token' }, { status: 401 });
  }

  try {
    await Project.findByIdAndDelete(resolvedParams.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Project deletion error:', error);
    return NextResponse.json({ error: error.message || 'Failed' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
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
    const body = await req.json();
    const updatedProject = await Project.findByIdAndUpdate(
      resolvedParams.id, 
      { $set: body },
      { new: true, runValidators: true }
    );
    if (!updatedProject) {
       return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json(updatedProject);
  } catch (error: any) {
    console.error('Project update error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update project' }, { status: 500 });
  }
}
