import { navLinks } from '@/constants';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className='max-w-[1080px] w-full py-4 sticky top-0 z-50 flex sm:flex-row flex-col gap-4 items-center justify-between px-4 mx-4 bg-white shadow-md rounded-b-md'>
      <Link href='/'>
        <Image
          src='/landing/main-logo.svg'
          alt='logo'
          width={168}
          height={56}
        />
      </Link>

      <div className='flex sm:flex-row flex-col gap-2 items-center'>
        <div className='flex flex-row gap-2'>
          {navLinks.map((link) => (
            <Button
              key={link.route}
              variant={'ghost'}
              asChild
              className='text-primary-blue hover:text-primary-blue hover:!bg-white hover:underline'
            >
              <Link href={link.route}>{link.name}</Link>
            </Button>
          ))}
        </div>
        <div>
          <Button
            asChild
            className='primary-button rounded-r-none'
          >
            <Link href='/signup/contactForm'>Get Started</Link>
          </Button>
          <Button
            asChild
            className='secondary-button rounded-l-none'
          >
            <Link href='/signin'>Sign in</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
