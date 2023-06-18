"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { Auth } from '@supabase/ui';
import {supabase} from '../../../supabase';
import { redirect } from 'next/navigation';
import { useSearchParams } from 'next/navigation'

const SignupPage = () => {
  const router = useRouter();
  // const params = useParams();
  const searchParams = useSearchParams()
 
  const option = searchParams.get('option')
  console.log(option);

  useEffect(() => {
    async function checkUser() {
      const user = await supabase.auth.getUser();
      const session = await supabase.auth.getSession();
      if (user.data.user != null) {
        console.log('User is logged in');
        localStorage.setItem('token', session.data.session?.access_token as string)
        localStorage.setItem('user', user.data.user?.id as string)
        console.log('User is logged in');
        router.push(`/signup/tier${option}`);
      }
    }
    checkUser();
  }, [router]);

  const handleSignup = async ({ email, password }: { email: string, password: string }) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.log('Signup error:', error.message);
    } else {
      // router.push('/dashboard');
      router.push(`/signup/tier${option}`);
    }
  };
  

  return (
    <div>
      <h1>Signup Page</h1>
      <div>
        <form onSubmit={(e) => {
          e.preventDefault();
          const target = e.target as typeof e.target & {
            email: { value: string };
            password: { value: string };
          };
          handleSignup({
            email: target.email.value,
            password: target.password.value
          });
        }
        }>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="Email" />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="password" />

          <button type="submit" className='border-2'>Signup</button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;