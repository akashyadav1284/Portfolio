import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Project } from '@/models/Project';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const INITIAL_PROJECTS = [
  {
    title: 'darktrace.soc',
    description: 'Advanced Security Operations Center platform mapping deep-web assets and anomalous endpoints continuously via AI heuristic grids.',
    techStack: ['Python', 'FastAPI', 'React', 'MongoDB', 'D3.js'],
    githubLink: '#',
    liveLink: '#',
    image: '/projects/darktrace.png'
  },
  {
    title: 'vertiasfactchecker',
    description: 'Autonomous neural validation engine that crawls media sources, comparing statements against a verified blockchain truth ledger.',
    techStack: ['Python', 'Flask', 'Web3', 'React'],
    githubLink: '#',
    liveLink: '#',
    image: '/projects/vertias.png'
  },
  {
    title: 'campushub',
    description: 'Unified decentralized college portal connecting students directly through peer-to-peer event routing and encrypted file-sharing nodes.',
    techStack: ['MERN Stack', 'Socket.io', 'TailwindCSS'],
    githubLink: '#',
    liveLink: '#',
    image: '/projects/campus-hub.png'
  },
  {
    title: 'techexpo',
    description: 'Interactive immersive 3D digital exhibition platform showcasing the latest futuristic tech with real-time global attendee presence.',
    techStack: ['Three.js', 'React', 'Node.js', 'MySQL'],
    githubLink: '#',
    liveLink: '#',
    image: '/projects/techxpo.png'
  }
];

export async function GET() {
  await dbConnect();
  try {
    let pjs = await Project.find({}).sort({ createdAt: -1 });
    if (pjs.length === 0) {
      await Project.insertMany(INITIAL_PROJECTS);
      pjs = await Project.find({}).sort({ createdAt: -1 });
    }
    return NextResponse.json(pjs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();
  
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
    const newProject = await Project.create(body);
    return NextResponse.json(newProject, { status: 201 });
  } catch (error: any) {
    console.error('Project creation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create project' }, { status: 500 });
  }
}
