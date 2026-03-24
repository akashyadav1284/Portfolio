import mongoose from 'mongoose';

async function run() {
  await mongoose.connect('mongodb://localhost:27017/cyberportfolio');
  console.log('Connected to MongoDB');
  
  const ProjectSchema = new mongoose.Schema({}, { strict: false });
  const Project = mongoose.models.PortfolioProject || mongoose.model('PortfolioProject', ProjectSchema);
  
  const projects = await Project.find({});
  let updated = 0;
  
  for (let p of projects) {
    const t = p.get('title') || '';
    const title = t.toString().toLowerCase();
    
    // Explicit mappings to correct bad fallbacks
    if (title.includes('darktrace')) p.set('image', '/projects/darktrace.png');
    else if (title.includes('vertias') || title.includes('veritas')) p.set('image', '/projects/vertias.png');
    else if (title.includes('campus')) p.set('image', '/projects/campus-hub.png');
    else if (title.includes('techxpo') || title.includes('tech expo') || title.includes('learnxpo')) p.set('image', '/projects/techxpo.png');
    else if (title.includes('crest')) p.set('image', '/projects/crest.png');
    
    await p.save();
    updated++;
  }
  
  console.log(`Successfully mapped images across ${updated} database entries!`);
  process.exit(0);
}

run().catch(console.error);
