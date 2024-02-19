'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export default function Calculator() {
  const [values, setValues] = useState({
    clientValue: 100,
    missedCalls: 50,
  });

  const handleChange = (name: string, newValue: number) => {
    setValues((prevValues) => ({ ...prevValues, [name]: newValue }));
  };

  const roi = useMemo(() => {
    return values.clientValue * values.missedCalls;
  }, [values]);

  return (
    <div className='w-full md:py-24 py-16 xl:px-56 md:px-24 px-4 bg-secondary-blue flex items-center justify-center'>
      <Card className='lg:max-w-[800px] w-full pt-8 flex md:flex-row flex-col gap-12'>
        <CardContent className='w-full grid gap-8'>
          <InputSliderPair
            id='clientValue'
            label='Average Client Value'
            value={values.clientValue}
            max={500}
            step={5}
            onChange={(value) => handleChange('clientValue', value)}
          />
          <InputSliderPair
            id='missedCalls'
            label='Missed Calls / Month'
            value={values.missedCalls}
            max={200}
            step={5}
            onChange={(value) => handleChange('missedCalls', value)}
          />
        </CardContent>
        <CardContent className='w-full min-h-full flex grow flex-col gap-4 items-center justify-center'>
          <CardTitle className='text-center'>
            Potential Missed Monthly Revenue
          </CardTitle>
          <CardTitle className='text-primary-blue text-6xl'>${roi}</CardTitle>
        </CardContent>
      </Card>
    </div>
  );
}

interface InputSliderPairProps {
  id: string;
  label: string;
  value: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}
const InputSliderPair = ({
  id,
  label,
  value,
  max,
  step,
  onChange,
}: InputSliderPairProps) => (
  <div className='grid gap-2'>
    <div className='w-full flex justify-between items-center'>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type='number'
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className='w-1/4'
      />
    </div>
    <Slider
      value={[value]}
      max={max}
      step={step}
      onValueChange={(value: any) => onChange(value[0])}
    />
  </div>
);
