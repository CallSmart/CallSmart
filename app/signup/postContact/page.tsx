"use client";
import { useRouter } from 'next/navigation';

const postContact = () => {
  const router = useRouter();

  const handleGoBackHome = () => {
    router.push('/');
  };

  return (
    <div>
      <h1>Thank you for contacting us. We will be in touch in the coming days!</h1>
      <button onClick={handleGoBackHome}>Go back home</button>
    </div>
  );
}

export default postContact;