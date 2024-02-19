'use client';
import HomeNavBar from '@/components/HomeNavBar';
import NavBar from '@/components/landing/main/NavBar';
import { Card } from '@tremor/react';
import { useRouter } from 'next/navigation';
import React from 'react';

const ChoosePlan = () => {
  const router = useRouter();

  const option = () => {
    router.push('/signup/contactForm');
  };

  return (
    <div className='flex flex-col items-center gap-24 py-12 md:pt-16 lg:pt-24'>
      <NavBar />
      <h1 className='text-center'>Your Plan</h1>
      <Card
        decoration='top'
        className='w-3/4 border-prim-blue flex flex-col gap-4 items-center'
      >
        <h4 className='text-prim-blue'>Local Clinic</h4>
        <h3>
          <em>$249.99</em>
        </h3>
        <p className='font-semibold'>Our monthly plan includes:</p>
        <ul className='list-disc ml-4'>
          <li>Missed call text-back automation for dental clinics</li>
          <li>Instant client engagement with automated messages</li>
          <li>
            Comprehensive dashboard for dental admins, providing real-time
            client data
          </li>
          <li>Customizable message templates to suit your clinic's needs</li>
          <li>Customer support for any assistance you require</li>
        </ul>
        <a
          className='btn-action'
          href='/signup/contactForm'
        >
          Select
        </a>
      </Card>
    </div>
  );
};

export default ChoosePlan;
