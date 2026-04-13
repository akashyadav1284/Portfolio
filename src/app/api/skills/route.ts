import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Skill } from '@/models/Skill';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const INITIAL_SKILLS = [
  { name: 'Python', category: 'Language', level: 90, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { name: 'MySQL', category: 'Database', level: 85, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
  { name: 'GitHub', category: 'Tools', level: 95, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
  { name: 'C++', category: 'Language', level: 80, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
  { name: 'Java', category: 'Language', level: 75, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
  { name: 'C', category: 'Language', level: 75, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' },
  { name: 'R', category: 'Language', level: 60, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg' },
  { name: 'MongoDB', category: 'Database', level: 90, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
  { name: 'HTML', category: 'Frontend', level: 95, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
  { name: 'CSS', category: 'Frontend', level: 90, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
  { name: 'JavaScript', category: 'Language', level: 95, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { name: 'React', category: 'Frontend', level: 90, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name: 'Node.js', category: 'Backend', level: 85, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' }, // Part of MERN
  { name: 'Express', category: 'Backend', level: 85, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' }, // Part of MERN
  { name: 'Flask', category: 'Backend', level: 80, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg' },
  { name: 'FastAPI', category: 'Backend', level: 80, icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg' },
];

export async function GET() {
  await dbConnect();
  try {
    let sl = await Skill.find({}).sort({ createdAt: 1 });
    if (sl.length === 0) {
      // Auto-seed for convenience since it's an initial portfolio build
      await Skill.insertMany(INITIAL_SKILLS);
      sl = await Skill.find({}).sort({ createdAt: 1 });
    }
    return NextResponse.json(sl);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();
  
  // Auth check
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
    const newSkill = await Skill.create(body);
    return NextResponse.json(newSkill, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 });
  }
}
