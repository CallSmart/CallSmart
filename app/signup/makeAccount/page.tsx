"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import { Auth } from '@supabase/ui';
import { supabase } from "../../../supabase";
import { redirect } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Session } from "@supabase/auth-helpers-nextjs";
import HomeNavBar from "@/components/HomeNavBar";

const SignupPage = () => {
  const router = useRouter();
  // const params = useParams();
  const searchParams = useSearchParams();
  const [session, setSession] = useState<Session>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [role, setRole] = useState("");
  const [lastName, setLastName] = useState("");
  const [organization, setOrganization] = useState("");

  const option = searchParams.get("option");
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
    console.log(email, password);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.log("Signup error:", error.message);
    } else {
      console.log(data);
      const { error } = await supabase.from("users").insert([
        {
          id: data?.user?.id,
          email,
          firstname: firstName,
          lastname: lastName,
          organization,
          role,
        },
      ]);
      if (!error) {
        if (data.session != null) {
          setSession(data.session);
          localStorage.setItem("token", data.session.access_token as string);
        }

        router.push(`/signup/tier${option}`);
      } else {
        console.log(error);
      }
    }
  };

  return (
    <HomeNavBar>
      <h1>You're almost there</h1>
      <form
        className="flex flex-col p-8 gap-6 w-1/3 bg-white border-2 border-[#CBCCD0] rounded-xl"
        onSubmit={(e) => {
          e.preventDefault();
          handleSignup();
        }}
      >
        <h3 className="text-center text-4xl font-semibold">
          Create your Account
        </h3>
        <span>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="callsmart@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </span>
        <span>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="123SuperSecure!"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </span>
        <span>
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            type="text"
            placeholder="John"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </span>
        <span>
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            type="text"
            placeholder="Smith"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </span>
        <span>
          <label htmlFor="organization">Organization</label>
          <input
            id="organization"
            type="text"
            placeholder="CallSmart Dental Clinic"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
          />
        </span>
        <span>
          <label htmlFor="role">Role</label>
          <input
            id="role"
            type="text"
            placeholder="Owner"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </span>
        <button type="submit" className="btn-action self-center">
          Sign up!
        </button>
      </form>
    </HomeNavBar>
  );
};

export default SignupPage;
