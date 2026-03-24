import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Rating } from '@/models/Rating';

export async function POST(req: Request) {
  try {
    const { stars, message } = await req.json();
    if (!stars || stars < 1 || stars > 5) {
      return NextResponse.json({ error: 'Invalid rating' }, { status: 400 });
    }
    await dbConnect();
    const newRating = await Rating.create({ stars, message });
    return NextResponse.json({ success: true, newRating }, { status: 201 });
  } catch (error: any) {
    console.error('API RATING ERR:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit rating' }, { status: 500 });
  }
}

export async function GET() {
  await dbConnect();
  try {
    const ratings = await Rating.find({}).sort({ createdAt: -1 });
    return NextResponse.json(ratings);
  } catch(e) {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
