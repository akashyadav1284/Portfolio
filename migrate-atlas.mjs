import mongoose from 'mongoose';

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const LOCAL_URI = 'mongodb://localhost:27017/cyberportfolio';
const ATLAS_URI = process.env.MONGODB_URI;

// Recreated Schema purely for precise direct database transfers without nextjs compiler conflicts
const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  techStack: [{ type: String }],
  githubLink: { type: String },
  liveLink: { type: String },
  image: { type: String },
});

async function run() {
  console.log('⚙️ Connecting to LOCAL Compass Database...');
  const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
  const LocalProject = localConn.model('PortfolioProject', ProjectSchema);
  
  const localData = await LocalProject.find({}).lean();
  console.log(`📥 Found ${localData.length} personalized projects in your local Database!`);
  
  if (localData.length === 0) {
    console.log('No data found locally. Nothing to migrate.');
    process.exit(0);
  }

  console.log('☁️ Connecting to ATLAS Cloud Database...');
  const atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
  const AtlasProject = atlasConn.model('PortfolioProject', ProjectSchema);

  console.log('🧹 Preparing Atlas environment...');
  await AtlasProject.deleteMany({});

  console.log('🚀 Executing Hyper-Transfer (Local -> Atlas)...');
  await AtlasProject.insertMany(localData);

  console.log(`✅ SUCCESS! Safely imported all ${localData.length} projects from localhost directly into MongoDB Atlas Cluster.`);

  await localConn.close();
  await atlasConn.close();
  process.exit(0);
}

run().catch((e) => {
  console.error('Migration failed:', e);
  process.exit(1);
});
