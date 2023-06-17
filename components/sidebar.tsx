"use client";

import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import  { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Box from "./Box";
import {supabase} from '../supabase';
import { redirect } from 'next/navigation';
import { Session } from "@supabase/auth-helpers-nextjs";

interface SidebarProps {
    children: React.ReactNode;
}

async function getSession(){

  const session = await supabase.auth.getSession();
  if (session) {
    return session;
  } else {
    redirect('/signin');
  }

}

const Sidebar: React.FC<SidebarProps> = ({ children }: SidebarProps) => {
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null>(null);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const token = localStorage.getItem('token') as string;
      const { data, error } = await supabase.auth.getSession();
      const user = await supabase.auth.getUser(token);
      console.log(user)
      console.log('here')
      console.log(data?.session?.user)
      if (error) {
        redirect('/signin');
      } else {
        setSession(data.session ?? null);
        if(data?.session?.user?.id != null){
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
      active: pathname !== '/' && pathname !== '/signin' && pathname !== '/signup'
    },
    {
      label: 'Profile',
      href: '/profile',
      active: pathname !== '/' && pathname !== '/signin' && pathname !== '/signup'
    },
  ], [pathname]);


    return (
      <div>
        <div className="flex">
          <div className="
          hidden 
          md:flex 
          flex-row 
          gap-x-2 
          bg-black  
          w-[800px] 
          p-2">
            {routes.map((route, index) => (
              <Box
                key={route.label} // or key={route.href}
                href={route.href}
                content={route.label}
                className={route.active ? 'bg-neutral-800' : 'hidden'}
              />
            ))}

          </div>

        </div>
        <main className="flex-0  py-2">
                  {children}
        </main>
      </div>
    );
}

export default Sidebar