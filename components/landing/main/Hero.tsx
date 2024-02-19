'use client';
import { Card, CardContent } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { heroText } from '@/constants';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../../ui/button';

export default function Hero() {
  return (
    <Carousel
      className='relative w-full bg-secondary-blue'
      opts={{
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 3000,
        }),
      ]}
    >
      <CarouselContent className=''>
        {heroText.map((slide) => (
          <CarouselItem key={slide.heading}>
            <Card className='border-none shadow-none bg-secondary-blue rounded-none'>
              <CardContent className='flex flex-col lg:px-32 px-8 lg:py-48 py-12'>
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className='w-1/2 h-[10px] flex-none bg-primary-blue'
                    style={{
                      clipPath:
                        'polygon(0 0, 100% 0, 100% 0%, 99% 100%, 0 100%)',
                    }}
                  ></motion.div>

                  <div className='flex gap-8'>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className='w-[10px] flex-none bg-primary-blue'
                    ></motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      exit={{ opacity: 0, x: -10 }}
                      className='grid gap-8 py-20'
                    >
                      <div className='grid gap-6'>
                        <Image
                          src='/landing/secondary-logo.svg'
                          alt=''
                          width={88}
                          height={56}
                        />
                        <h2 className='h2-text !text-primary-blue'>
                          {slide.subheading}
                        </h2>
                        <h1 className='h1-text !text-primary-blue'>
                          {slide.heading}
                        </h1>
                      </div>

                      <h3 className='h3-text !text-primary-blue'>
                        {slide.description}
                      </h3>

                      <Button
                        asChild
                        className='primary-button md:!text-xl !text-lg !font-regular md:!py-8 !py-6 w-max'
                      >
                        <Link href='/signup/contactForm'>Get Started</Link>
                      </Button>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className='w-1/3 h-[10px] flex-none bg-primary-blue'
                    style={{
                      clipPath:
                        'polygon(0 0, 100% 0, 98% 0%, 100% 100%, 0 100%)',
                    }}
                  ></motion.div>
                </AnimatePresence>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className='sm:block hidden' />
      <CarouselNext className='sm:block hidden' />
    </Carousel>
  );
}
