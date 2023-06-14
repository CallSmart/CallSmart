"use client";

import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import  { usePathname } from "next/navigation";
import { useMemo } from "react";
import Box from "./Box";

interface SidebarProps {
    children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }: SidebarProps) => {
  const pathname = usePathname();
  const routes = useMemo(() => [
    {
      label: 'Home',
      href: '/',
      active: pathname !== '/search',
    },
    {
      label: 'Sign In',
      href: '/signin',
      active: pathname !== '/search'
    },
    {
      label: 'Sign Up',
      href: '/signup',
      active: pathname !== '/search'
    },
    {
      label: 'Dashboard',
      href: '/dashboard',
      active: pathname !== '/search'
    },
    {
      label: 'Profile',
      href: '/profile',
      active: pathname !== '/search'
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