import Footer from '@/components/landing/main/Footer';
import GetStartedBanner from '@/components/landing/main/GetStartedBanner';
import NavBar from '@/components/landing/main/NavBar';
import Pricing from '@/components/landing/main/Pricing';
import Calculator from '@/components/landing/pricing/Calculator';
import React from 'react';

export default function Page() {
  return (
    <div className='flex min-h-screen min-w-screen flex-col items-center bg-secondary-blue'>
      <NavBar />
      <Calculator />
      <GetStartedBanner />
      <Pricing />
      <GetStartedBanner />
      <Footer />
    </div>
  );
}
