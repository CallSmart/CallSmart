"use client";

import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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

const ProductNavBar: React.FC<SidebarProps> = ({ children }: SidebarProps) => {
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null>(null);
  const [hasSession, setHasSession] = useState(false);

  const NavButton = ({ to, children }: { to: any; children: any }) => {
    return (
      <a
        href={to}
        className={`${"product-nav-button"} ${pathname == to ? "active" : ""}`}
      >
        <p>{children}</p>
      </a>
    );
  };

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
    <div className="flex flex-row ">
      <div className="flex flex-col h-[100dvh] w-64 py-8 px-4 justify-center md:justify-between bg-[#E5F0FA] border-r-[1px] border-prim-blue text-prim-blue">
        <div className="flex flex-col gap-4">
          <a className="h-fit w-fit font-bold text-2xl self-center" href="/">
            CallSmart
          </a>
          <a
            className="flex flex-row p-2 border-[1px] border-prim-blue text-prim-blue rounded-md bg-[#BFD9F2] gap-2"
            href="/account"
          >
            <div className="h-10 w-10 bg-white rounded-full" />
            <div className="flex flex-col gap-0 leading-tight">
              <p>Marcelo Chaman</p>
              <em className="opacity-50 hover:opacity-100">Manage Account</em>
            </div>
          </a>
          <div className="flex flex-col gap-2">
            <p className="font-medium">Dashboards</p>
            <hr className="border-prim-blue" />
            <NavButton to="/dashboard">Tickets Dashboard</NavButton>
            <NavButton to="/analytics">Analytics Dashboard</NavButton>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <hr className="border-prim-blue" />
          <NavButton to="/faq">FAQ</NavButton>
          <NavButton to="mailto:callsmartforwarder@gmail.com">
            Contact
          </NavButton>
        </div>
      </div>
      <div className="w-[calc(100dvw-256px)] bg-grey-light px-4 py-8">
        {children}
      </div>
    </div>
  );
};

export default ProductNavBar;
