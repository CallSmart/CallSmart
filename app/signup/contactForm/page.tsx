'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import HomeNavBar from '@/components/HomeNavBar';
import { Card } from '@tremor/react';
import NavBar from '@/components/landing/main/NavBar';

const ContactPage = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [showConf, setShowConf] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      console.error('No email available');
      return;
    }

    // Perform any additional form validation here (e.g., check if required fields are filled)

    // Send the form data to the API route
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone }),
      });

      // Reset form fields
      setName('');
      setEmail('');
      setPhone('');
      // Optionally display a success message to the user
      // console.log("router pushgin postContact");
      // router.push("/signup/confirmation");
      setShowConf(true);
    } catch (error) {
      console.error(error);
      // Optionally display an error message to the user
      alert('Failed to submit the form.');
    }
  };

  return (
    <div className='flex flex-col items-center gap-24 pb-12'>
      <NavBar />
      <h1 className='w-2/3 text-center'>Thanks for your interest!</h1>
      {!showConf ? (
        <Card
          decoration='top'
          className='w-1/2 min-w-[400px] z-50 static text-sec-blue'
        >
          <form
            onSubmit={handleSubmit}
            className='flex flex-col gap-2 indent-4'
          >
            <h3 className='text-center text-4xl font-semibold'>
              Please enter your contact information.
            </h3>
            <hr className='my-2' />
            <div className='form-section'>
              <label>Name</label>
              <input
                type='text'
                value={name}
                placeholder='Full Name'
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className='form-section'>
              <label>Email</label>
              <input
                type='email'
                value={email}
                placeholder='callsmart@callsmart.com'
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className='form-section'>
              <label>Phone</label>
              <input
                type='tel'
                value={phone}
                placeholder='+1 (905) 599 3866'
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <hr className='my-2' />
            <div className='form-section'>
              <a
                href='/signin'
                className='hover:opacity-50'
              >
                <em>Already have an account?</em>
              </a>
              <button
                type='submit'
                className='btn-submit'
              >
                Submit
              </button>
            </div>
          </form>
        </Card>
      ) : (
        <div className='flex flex-col items-center gap-2'>
          <h4>We will be in touch in the coming days!</h4>
          <a
            className='btn-action'
            href={'/'}
          >
            Go Home
          </a>
        </div>
      )}
    </div>
  );
};

export default ContactPage;
