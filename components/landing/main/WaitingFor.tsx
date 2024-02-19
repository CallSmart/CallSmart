import Link from 'next/link';
import { Button } from '../../ui/button';

export default function WaitingFor() {
  return (
    <div className='relative w-full md:py-32 py-16 xl:px-56 md:px-24 px-4 bg-white flex flex-col gap-8 items-center justify-center overflow-hidden'>
      <h1 className='md:text-6xl text-4xl font-regular text-center'>
        What are you waiting for?
      </h1>
      <Button
        asChild
        className='primary-button !text-xl py-6 px-12'
      >
        <Link href='/signup/contactForm'>Get Started</Link>
      </Button>
      <div className='absolute z-0 xl:block hidden top-0 -start-1/4 rounded-full border-[56px] size-[560px] border-primary-blue'></div>
      <div className='absolute z-0 xl:block hidden top-0 start-3/4 rounded-full border-[56px] size-[700px] border-primary-yellow'></div>
    </div>
  );
}
