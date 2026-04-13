import mongoose from 'mongoose';

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const LOCAL_URI = 'mongodb://localhost:27017/cyberportfolio';
const ATLAS_URI = process.env.MONGODB_URI;

async function run() {
  console.log('🔗 Connecting to LOCAL Compass Database...');
  const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
  const localDb = localConn.db;
  
  console.log('🔗 Connecting to ATLAS Cloud Database...');
  const atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
  const atlasDb = atlasConn.db;

  const collections = await localDb.listCollections().toArray();
  const targetCollections = collections.filter(c => !c.name.startsWith('system.'));
  
  console.log(`📂 Found ${targetCollections.length} standard collections locally.`);

  for (const collectionInfo of targetCollections) {
     const colName = collectionInfo.name;
     console.log(`\n⏳ Extracting collection: ${colName}...`);
     
     const localCol = localDb.collection(colName);
     const documents = await localCol.find({}).toArray();
     
     if (documents.length === 0) {
        console.log(`   - Skipping ${colName} (Empty)`);
        continue;
     }

     const atlasCol = atlasDb.collection(colName);
     console.log(`   - Erasing existing ghost data in Atlas [${colName}]...`);
     await atlasCol.deleteMany({});
     
     console.log(`   - Piping ${documents.length} objects into Atlas [${colName}]...`);
     await atlasCol.insertMany(documents);
     console.log(`   ✅ Synced ${colName}`);
  }

  console.log('\n🌟 ENTIRE DATABASE MIGRATED SUCCESSFULLY! Closing connections...');
  
  await localConn.close();
  await atlasConn.close();
  process.exit(0);
}

run().catch((e) => {
  console.error('Migration crashed!', e);
  process.exit(1);
});
