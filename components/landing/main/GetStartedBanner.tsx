import Link from 'next/link';
import { Button } from '../../ui/button';

function GetStartedBanner() {
  return (
    <div className='w-full py-16 xl:px-56 md:px-24 px-4 bg-white flex items-center justify-center'>
      <Button
        asChild
        className='primary-button !text-xl !font-medium !py-8'
      >
        <Link href='/signup/contactForm'>Get Started</Link>
      </Button>
    </div>
  );
}

export default GetStartedBanner;
