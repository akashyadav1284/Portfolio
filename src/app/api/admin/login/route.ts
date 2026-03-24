import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Admin } from '@/models/Admin';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-super-secret-key-12345';
const DEFAULT_EMAIL = process.env.ADMIN_ID || 'akash1284';
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || '340515';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    // Development auto-create admin if it doesn't exist
    let adminUser = await Admin.findOne({ email });
    if (!adminUser && email === DEFAULT_EMAIL) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(DEFAULT_PASSWORD, salt);
      adminUser = await Admin.create({ email: DEFAULT_EMAIL, passwordHash: hash });
    }

    if (!adminUser) {
      return NextResponse.json({ success: false, error: 'Invalid Credentials' }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, adminUser.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ success: false, error: 'Invalid Credentials' }, { status: 400 });
    }

    const payload = {
      admin: {
        id: adminUser.id,
        email: adminUser.email,
        role: 'SYS_ADMIN'
      }
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });

    return NextResponse.json({ success: true, token }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 });
  }
}
