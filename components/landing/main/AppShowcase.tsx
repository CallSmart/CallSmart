import Image from 'next/image';

export default function AppShowcase() {
  return (
    <div className='w-full flex items-center justify-center py-16 lg:px-12 px-4'>
      <div className='w-full p-4 bg-white rounded-xl shadow-sm flex items-center justify-center'>
        <Image
          src='/landing/app-screenshots.jpg'
          alt='Screenshot of the CallSmart app in mobile and desktop views.'
          width={1400}
          height={800}
        />
      </div>
    </div>
  );
}
