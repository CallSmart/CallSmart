"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// import { Auth } from '@supabase/ui';
import {supabase} from '../../../supabase';
import { redirect } from 'next/navigation';
import { useSearchParams } from 'next/navigation'
import { Session } from '@supabase/auth-helpers-nextjs';

const SignupPage = () => {
  const router = useRouter();
  // const params = useParams();
  const searchParams = useSearchParams()
  const [session, setSession] = useState<Session>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [role, setRole] = useState('');
  const [lastName, setLastName] = useState('');
  const [organization, setOrganization] = useState('');
  
 
  const option = searchParams.get('option')
  console.log(option);

  // useEffect(() => {
  //   async function checkUser() {
  //     const user = await supabase.auth.getUser();
  //     const session = await supabase.auth.getSession();
  //     if (user.data.user != null) {
  //       console.log('User is logged in');
  //       localStorage.setItem('token', session.data.session?.access_token as string)
  //       localStorage.setItem('user', user.data.user?.id as string)
  //       console.log('User is logged in');
  //       router.push(`/signup/tier${option}`);
  //     }
  //   }
  //   checkUser();
  // }, [router, session]);

  // const handleSignup = async ({ email, password }: { email: string, password: string }) => {
  //   const { data, error } = await supabase.auth.signUp({ email, password });
  //   if (error) {
  //     console.log('Signup error:', error.message);
  //   } else {
  //     // router.push('/dashboard');
  //     console.log(data)
  //     if(data.session != null){
  //       setSession(data.session);
  //       localStorage.setItem('token', data.session.access_token as string)
  //     }
      
  //     // router.push(`/signup/tier${option}`);
  //   }
  // };
  const handleSignup = async () => {
    console.log(email, password)
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.log('Signup error:', error.message);
    } else {
      console.log(data)
      const {error} = await supabase
        .from('users')
        .insert([
          {
            id: data?.user?.id,
            email,
            firstname: firstName,
            lastname: lastName,
            organization,
            role,
          },
        ]);
      if(!error){
        if(data.session != null){
          setSession(data.session);
          localStorage.setItem('token', data.session.access_token as string)
        }

        router.push(`/signup/tier${option}`);
      }else{
        console.log(error)
      }
    }
  };
  

  return (
    <div>
      <h1>Signup Page</h1>
      <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSignup();
        }}
      >
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <label htmlFor="organization">Organization</label>
        <input
          id="organization"
          type="text"
          placeholder="Organization"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
        />
        <label htmlFor="role">Role</label>
        <input
          id="role"
          type="text"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />

        <button type="submit" className="border-2">Signup</button>
      </form>
      </div>
    </div>
  );
};

export default SignupPage;