import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '../../ui/button';
import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const localBenefits = [
  'Missed call text-back',
  'Instant engagement messages',
  'Comprehensive dashboard',
  'Customizable messages',
  'Unlimited support',
];
export default function Pricing() {
  return (
    <div className='w-full md:py-40 py-16 xl:px-56 md:px-24 px-4 bg-tertiary-blue flex items-center justify-center'>
      <div className='flex md:flex-row flex-col gap-8'>
        <Card className='w-full max-w-[400px] relative  border-none shadow-md overflow-hidden p-4'>
          <div className='flex flex-col justify-between h-full rounded-lg bg-secondary-red py-4'>
            <div className='absolute top-0 right-0 p-4 bg-primary-red rounded-l-full'>
              <p className='text-xl text-black font-semibold'>
                $249 <span className='text-sm font-light'>99/m</span>
              </p>
            </div>
            <CardHeader>
              <CardTitle>Local Clinic</CardTitle>
              <CardDescription>Our monthly plan includes:</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className='list-none grid gap-2'>
                {localBenefits.map((benefit) => (
                  <li
                    key={benefit}
                    className='flex gap-2 items-center'
                  >
                    <CheckCircle2 size={18} />
                    {benefit}
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button
                asChild
                className='primary-button w-full  '
              >
                <Link href='/signup/contactForm'>Choose Plan</Link>
              </Button>
            </CardFooter>
          </div>
        </Card>
        <Card className='w-full max-w-[400px] flex flex-col justify-between border-none shadow-md py-8'>
          <CardHeader className='grid gap-2'>
            <CardTitle>Ready to Transform Missed Calls into Revenue?</CardTitle>
            <CardDescription>
              {`Don't let missed calls be missed revenue. Embrace CallSmart
              today and watch your dental clinic's revenue soar.`}
            </CardDescription>
          </CardHeader>
          <CardContent className='flex flex-col items-center gap-6'>
            <div className='w-full flex flex-row gap-2'>
              <div className='grid gap-3 w-1/2 bg-secondary-purple p-2 rounded-lg'>
                <p className='text-lg text-primary-purple font-semibold '>
                  100%
                </p>
                <p className='text-sm text-primary-purple'>Satisfaction</p>
              </div>
              <div className='grid gap-3 w-1/2 bg-secondary-purple p-2 rounded-lg'>
                <p className='text-lg text-primary-purple font-semibold '>
                  4.5k
                </p>
                <p className='text-sm text-primary-purple'>patients</p>
              </div>
            </div>
            <Image
              src='/landing/secondary-logo.svg'
              alt=''
              width={64}
              height={48}
            />
          </CardContent>
          <CardFooter>
            <Button
              asChild
              className='primary-button !bg-primary-yellow !text-black hover:!bg-primary-yellow w-full'
            >
              <Link href='mailto:callsmart@gmail.com'>Schedule a Demo</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
