"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { Auth } from '@supabase/ui';
import {supabase} from '../../supabase';
import { redirect } from 'next/navigation';

const LoginPage = () => {
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      const user = await supabase.auth.getUser();
      const session = await supabase.auth.getSession();
      if(user.data.user?.id != null) {
        console.log('User is logged in');
        localStorage.setItem('token', session.data.session?.access_token as string)
        localStorage.setItem('user', user.data.user?.id as string)
        console.log('User is logged in');
        router.push('/dashboard'); 
      }
    }
    checkUser();
  }, [router]);

  const handleLogin = async ({ email, password }: { email: string, password: string }) => {
    
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.log('Login error:', error.message);
    } else {
      console.log('Login success:', data);
      router.push('/dashboard');
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
          handleLogin({
            email: target.email.value,
            password: target.password.value
          });
        }
        }>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="Email" />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="password" />

          <button type="submit" className='border-2'>Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;