import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { JoinRequest } from '@/models/User';

export async function GET() {
  await dbConnect();
  try {
    const users = await JoinRequest.find({}).sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch(e) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();
  try {
    const data = await req.json();
    const newUser = await JoinRequest.create(data);
    return NextResponse.json({ success: true, newUser }, { status: 201 });
  } catch (error: any) {
    console.error('API USERS ERR:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit.' }, { status: 500 });
  }
}
