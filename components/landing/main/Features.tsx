import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import Link from 'next/link';

import { featureText } from '@/constants';

export default function Features() {
  return (
    <Carousel
      className='relative w-full bg-gradient-to-b from-tertiary-blue to-secondary-blue md:py-56 py-16 xl:px-56 md:px-24 px-4 overflow-hidden'
      opts={{
        align: 'start',
        loop: true,
      }}
    >
      <CarouselContent>
        {featureText.map((slide) => (
          <CarouselItem
            key={slide.heading}
            className='md:basis-1/2 lg:basis-1/3 h-[400px] '
          >
            <Card className='h-full border-none shadow-none bg-white rounded-lg pt-6'>
              <CardContent className='h-full flex flex-col gap-8 justify-between'>
                <div className='flex flex-col gap-6'>
                  <Badge className='w-max bg-secondary-purple text-primary-purple hover:bg-secondary-purple'>
                    Feature
                  </Badge>
                  <h2 className='h2-text !text-black'>{slide.heading}</h2>
                  <p className='body-text !text-black'>{slide.description}</p>
                </div>
                <Button
                  asChild
                  className='secondary-button hover:!bg-primary-blue hover:text-secondary-blue'
                >
                  <Link href='mailto:callsmart@gmail.com'>Learn More</Link>
                </Button>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className='hidden sm:block' />
      <CarouselNext className='hidden sm:block' />
      <div className='sm:hidden relative mt-12'>
        <CarouselPrevious />
        <CarouselNext />
      </div>
      <div className='absolute z-0 xl:block hidden -start-1/4 -bottom-1/2 rounded-full w-[800px] h-[560px] bg-primary-yellow'></div>
    </Carousel>
  );
}
