"use client";

import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Box from "./Box";
import { supabase } from "../supabase";
import { redirect } from "next/navigation";
import { Session } from "@supabase/auth-helpers-nextjs";

interface SidebarProps {
  children: React.ReactNode;
}

async function getSession() {
  const session = await supabase.auth.getSession();
  if (session) {
    return session;
  } else {
    redirect("/signin");
  }
}

const HomeNavBar: React.FC<SidebarProps> = ({ children }: SidebarProps) => {
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null>(null);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const token = localStorage.getItem("token") as string;
      const { data, error } = await supabase.auth.getSession();
      const user = await supabase.auth.getUser(token);
      console.log(user);
      console.log("here");
      console.log(data?.session?.user);
      if (error) {
        redirect("/signin");
      } else {
        setSession(data.session ?? null);
        if (data?.session?.user?.id != null) {
          setHasSession(true);
        }
      }
    };
    fetchSession();
  }, []);

  const routes = useMemo(
    () => [
      {
        label: "Home",
        href: "/",
        active: pathname !== "/dashboard" && pathname !== "/profile",
      },
      {
        label: "Sign In",
        href: "/signin",
        active: pathname !== "/dashboard" && pathname !== "/profile",
      },
      {
        label: "Sign Up",
        href: "/signup",
        active: pathname !== "/dashboard" && pathname !== "/profile",
      },
      {
        label: "Dashboard",
        href: "/dashboard",
        active:
          pathname !== "/" && pathname !== "/signin" && pathname !== "/signup",
      },
      {
        label: "Profile",
        href: "/profile",
        active:
          pathname !== "/" && pathname !== "/signin" && pathname !== "/signup",
      },
    ],
    [pathname]
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row w-[100dvw] py-8 px-48 justify-center md:justify-between ">
        <a className="h-fit w-fit self-center font-bold text-2xl" href="/">
          CallSmart
        </a>
        <div className="flex gap-8 text-lg items-center">
          <a className="" href="">
            Pricing
          </a>
          <a className="" href="">
            FAQ
          </a>
          <a className="" href="">
            Contact
          </a>
          <a
            className="px-4 py-2 bg-dblue hover:bg-[#585A66] active:bg-[#454855] rounded-xl text-white"
            href="/signin"
          >
            Sign In
          </a>
          <a
            className="px-4 py-2 ring-2 ring-inset rounded-xl ring-[#2E3541] hover:bg-[#2E3541] active:bg-transparent rounded-lg text-[#2E3541] hover:text-white"
            href="/signup"
          >
            Sign Up
          </a>
        </div>
      </div>
      {children}
    </div>
  );
};

export default HomeNavBar;
