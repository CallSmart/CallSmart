"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ContactPage = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      console.log('router pushgin postContact')
      router.push('/signup/postContact')
    } catch (error) {
      console.error(error);
      // Optionally display an error message to the user
      alert('Failed to submit the form.');
    }
  };

  return (
    <div>
      <h1>Contact Page</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <br />
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <br />
        <label>
          Phone:
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ContactPage;
