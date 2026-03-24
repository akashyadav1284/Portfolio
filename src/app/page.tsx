import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import BootScreen from '@/components/BootScreen';

import SkillsSection from '@/components/SkillsSection';
import ProjectsSection from '@/components/ProjectsSection';
import ContactSection from '@/components/ContactSection';
import WhatsAppButton from '@/components/WhatsAppButton';
import RightSidebar from '@/components/RightSidebar';

export default function Home() {
  return (
    <main className="relative min-h-screen selection:text-cyan-900 selection:bg-cyan-300">
      <BootScreen />
      <Navbar />
      <RightSidebar />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
      <WhatsAppButton />
    </main>
  );
}
