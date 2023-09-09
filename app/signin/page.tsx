"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
// import { Auth } from '@supabase/ui';
import { supabase } from "../../supabase";
import { redirect } from "next/navigation";
import Sidebar from "@/components/sidebar";
import HomeNavBar from "@/components/HomeNavBar";
import { Card } from "@tremor/react";

const LoginPage = () => {
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      const user = await supabase.auth.getUser();
      const session = await supabase.auth.getSession();
      if (user.data.user?.id != null) {
        console.log("User is logged in");
        localStorage.setItem(
          "token",
          session.data.session?.access_token as string
        );
        localStorage.setItem("user", user.data.user?.id as string);
        console.log("User is logged in");
        router.push("/dashboard");
      }
    }
    checkUser();
  }, [router]);

  const handleLogin = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.log("Login error:", error.message);
    } else {
      console.log("Login success:", data);
      router.push("/dashboard");
    }
  };

  return (
    <HomeNavBar>
      <h1 className="text-center w-1/3">Welcome Back!</h1>
      <Card
        decoration="top"
        className="w-1/2 min-w-[400px] flex flex-col p-4 gap-2 z-50 static text-sec-blue"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const target = e.target as typeof e.target & {
              email: { value: string };
              password: { value: string };
            };
            handleLogin({
              email: target.email.value,
              password: target.password.value,
            });
          }}
          className="flex flex-col gap-2 indent-4"
        >
          <h3 className="text-center text-4xl font-semibold indent-0">
            Log In
          </h3>
          <hr className="my-2" />
          <div className="form-section">
            <label className="flex gap-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="callsmart@support.ca"
              required
            />
          </div>
          <div className="form-section">
            <label className="flex gap-1">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="SuperSecure123"
              required
            />
          </div>
          <hr className="my-2" />
          <div className="form-section">
            <a href="mailto:callsmart@support.ca" className="hover:opacity-50">
              <em>Forgot username or password? </em>
            </a>
            <button type="submit" className="btn-submit">
              Sign In
            </button>
          </div>
        </form>
      </Card>
      <span className="flex">
        <p>
          <em className="opacity-50">Don't have an account? </em>
          <a className="hover:opacity-50" href="/signup">
            Join us!
          </a>
        </p>
      </span>
    </HomeNavBar>
  );
};

export default LoginPage;
