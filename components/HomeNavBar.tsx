"use client";

import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Box from "./Box";
import { supabase } from "../supabase";
import { redirect } from "next/navigation";
import { Session } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import * as Img from "../app/images";

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
      <div className="flex lg:hidden pt-8 pb-2 px-8 justify-between items-center">
        <Image src={Img.LogoFull} alt="CallSmart" className="h-6 w-auto" />
        <a
          className="px-4 py-2 bg-prim-blue hover:bg-prim-blue/50 active:bg-prim-blue/75 rounded-xl text-white transition-all duration-200"
          href="/signup"
        >
          Get Started
        </a>
      </div>
      <div className="hidden lg:flex flex-col md:flex-row w-[100dvw] py-8 min-[1140px]:px-48 px-32 justify-center md:justify-between ">
        <a className="h-fit w-fit self-center font-bold text-2xl" href="/">
          <Image src={Img.LogoFull} alt="CallSmart" className="h-8 w-auto" />
        </a>
        <div className="flex gap-8 text-lg items-center">
          <a
            className="px-4 py-2 bg-prim-blue hover:bg-prim-blue/50 active:bg-prim-blue/75 rounded-xl text-white transition-all duration-200"
            href="/signup"
          >
            Get Started
          </a>
          <a
            className="px-4 py-2 ring-2 ring-inset rounded-xl ring-prim-blue hover:bg-prim-blue/50 hover:ring-0 active:bg-prim-blue/75 rounded-lg text-prim-blue hover:text-white transition-all duration-200"
            href="/signin"
          >
            Sign In
          </a>
          <a className="hover:opacity-50" href="/signup">
            Pricing
          </a>
          <a className="hover:opacity-50" href="/revenue-strategy">
            Revenue Strategy
          </a>
          <a className="hover:opacity-50" href="/FAQ">
            FAQ
          </a>
        </div>
      </div>
      <div className="flex flex-col items-center gap-24 py-12 md:pt-16 lg:pt-24">
        {children}
      </div>
    </div>
  );
};

export default HomeNavBar;
