import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

import { demoBannerText } from '@/constants';

export default function DemoBanner() {
  return (
    <div className='relative w-full py-16 xl:px-56 md:px-24 px-4 bg-white overflow-hidden shadow-sm'>
      <div className='z-50 grid gap-8 max-w-[560px] w-full'>
        <div className='grid gap-3'>
          <Badge className='w-max bg-secondary-gray hover:bg-secondary-gray text-black '>
            Request demo
          </Badge>
          <h2 className='h2-text !text-primary-blue'>{demoBannerText.title}</h2>
        </div>

        <p className='body-text'>{demoBannerText.body}</p>

        <div className='w-full flex justify-between'>
          <Image
            src='/landing/goto-logo.svg'
            alt=''
            width={120}
            height={48}
          />
        </div>
      </div>
      <div className='absolute z-0 xl:block hidden top-0 -start-1/4 rounded-full border-[56px] size-[500px] border-primary-blue'></div>
      <div className='absolute z-0 md:block hidden top-0 start-3/4 rounded-full border-[56px] size-[700px] border-primary-yellow'></div>
    </div>
  );
}
