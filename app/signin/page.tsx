"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
// import { Auth } from '@supabase/ui';
import { supabase } from "../../supabase";
import { redirect } from "next/navigation";

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
    <div className="flex h-full w-screen ">
      <div className="w-1/2 bg-blue-500">test</div>
      <div className="flex w-1/2 bg-[#0066CC] items-center justify-center p-16">
        <div className="flex flex-col h-full w-full border-2 rounded-lg border-[#2E3541] bg-white">
          <div className="container-label">
            <h1>Login</h1>
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
          >
            <div className="flex flex-col p-4 gap-2">
              <span className="flex flex-col border-b-2">
                <label>Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="callsmart@support.ca"
                  required
                />{" "}
              </span>
              <span className="flex flex-col border-b-2">
                <label>Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="SuperSecure123"
                  required
                />{" "}
              </span>
            </div>
            <div className="flex w-full bg-dblue px-4 py-2 text-white gap-4 items-center justify-center">
              <p>
                <a
                  href="mailto:callsmart@support.ca"
                  className="hover:text-[#585A66]"
                >
                  Forgot username or password
                </a>
              </p>
              <button type="submit" className="btn-action">
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
