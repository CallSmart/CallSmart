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

const Sidebar: React.FC<SidebarProps> = ({ children }: SidebarProps) => {
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null>(null);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const token = localStorage.getItem("token") as string;
      const { data, error } = await supabase.auth.getSession();
      const user = await supabase.auth.getUser(token);
      console.log(user)
      console.log('here')
      console.log(data?.session?.user)
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
  const routes = useMemo(() => [
    {
      label: 'Home',
      href: '/',
      active:  pathname !== '/dashboard' && pathname !== '/profile',
    },
    {
      label: 'Sign In',
      href: '/signin',
      active: pathname !== '/dashboard' && pathname !== '/profile',
    },
    {
      label: 'Sign Up',
      href: '/signup',
      active: pathname !== '/dashboard' && pathname !== '/profile',
    },
    {
      label: 'Dashboard',
      href: '/dashboard',
      active: pathname !== '/' && pathname !== '/signin' && pathname !== '/signup' && pathname !== '/signup/authorized' && pathname !== '/signup/tier1' && pathname !== '/signup/tier2' && pathname !== '/signup/tier3' && pathname !== '/signup/makeAccount'
    },
    {
      label: 'Analytics',
      href: '/analytics',
      active: pathname !== '/' && pathname !== '/signin' && pathname !== '/signup' && pathname !== '/signup/authorized' && pathname !== '/signup/tier1' && pathname !== '/signup/tier2' && pathname !== '/signup/tier3' && pathname !== '/signup/makeAccount'
    },
    {
      label: 'Account',
      href: '/account',
      active: pathname !== '/' && pathname !== '/signin' && pathname !== '/signup' && pathname !== '/signup/authorized' && pathname !== '/signup/tier1' && pathname !== '/signup/tier2' && pathname !== '/signup/tier3' && pathname !== '/signup/makeAccount'
    },
  ], [pathname]);



  return (
    <div className="flex w-[100dvw] h-full">
      <div
        className="
          hidden 
          md:flex
          w-[100dvw]
          h-24
          p-4
          bg-dblue
          items-center
          justify-center
          fixed
          top-0"
      >
        {routes.map((route, index) => (
          <Box
            key={route.label} // or key={route.href}
            href={route.href}
            content={route.label}
            className={`${"btn-action"} ${route.active ? "bg-[#585A66]" : ""}`}
          />
        ))}
      </div>
      <main className="h-full pt-24">{children}</main>
    </div>
  );
};

export default Sidebar;
