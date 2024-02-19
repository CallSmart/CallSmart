import AppShowcase from '@/components/landing/main/AppShowcase';
import DemoBanner from '@/components/landing/main/DemoBanner';
import Features from '@/components/landing/main/Features';
import Footer from '@/components/landing/main/Footer';
import GetStartedBanner from '@/components/landing/main/GetStartedBanner';
import Hero from '@/components/landing/main/Hero';
import NavBar from '@/components/landing/main/NavBar';
import Pricing from '@/components/landing/main/Pricing';
import WaitingFor from '@/components/landing/main/WaitingFor';

export default function Home() {
  return (
    <main className='flex flex-col items-center bg-secondary-blue'>
      <NavBar />
      <Hero />
      <DemoBanner />
      <Features />
      <GetStartedBanner />
      <Pricing />
      <AppShowcase />
      <WaitingFor />
      <Footer />
    </main>
  );
}
