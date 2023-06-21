"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
// import { Auth } from '@supabase/ui';
import { supabase } from "../../supabase";
import { redirect } from "next/navigation";
import Sidebar from "@/components/sidebar";
import HomeNavBar from "@/components/HomeNavBar";

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
      <div className="flex flex-col pt-12 items-center gap-8">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-center text-8xl w-1/2 font-bold text-[#0066CC]">
            Welcome Back!
          </h1>
        </div>
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
          className="flex flex-col p-8 gap-6 w-1/3 bg-white border-2 border-[#CBCCD0] rounded-xl"
        >
          <h3 className="text-center text-4xl font-semibold">Log In</h3>
          <span className="flex flex-col">
            <label>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="callsmart@support.ca"
              required
            />{" "}
          </span>
          <span className="flex flex-col">
            <label>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="SuperSecure123"
              required
            />{" "}
          </span>
          <div className="flex w-full gap-4 items-center">
            <button type="submit" className="btn-action">
              Sign In
            </button>
            <em>
              <a
                href="mailto:callsmart@support.ca"
                className="hover:opacity-50"
              >
                Forgot username or password?
              </a>
            </em>
          </div>
        </form>
        <span className="flex">
          <p>
            <em className="opacity-50">Don't have an account? </em>
            <a className="hover:opacity-50" href="/signup">
              Join us!
            </a>
          </p>
        </span>
      </div>
    </HomeNavBar>
  );
};

export default LoginPage;
