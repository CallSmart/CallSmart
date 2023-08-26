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
import router from "next/navigation";
import { useRouter } from "next/navigation";
import * as Img from "../app/images";
import Image from "next/image";

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
  const [fullName, setFullName] = useState("");
  const router = useRouter();

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

  const getUser = async () => {
    console.log("Calling get user in Prod Nav");
    const user = await supabase.auth.getUser();

    if (user.error) {
      console.log("Calling redirect: ", user.error);
      router.push("/signin");
    }

    const id = user?.data?.user?.id;
    if (id) {
      const { data, error } = await supabase
        .from("users")
        .select("firstname, lastname")
        .eq("id", id);
      if (error) {
        console.error("Error fetching user:", error.message);
      }
      localStorage.setItem("firstname", data?.[0]?.firstname || "");
      localStorage.setItem("lastname", data?.[0]?.lastname || "");
      setFullName(
        localStorage.getItem("firstname") +
          " " +
          localStorage.getItem("lastname")
      );
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      const token = localStorage.getItem("token") as string;
      const { data, error } = await supabase.auth.getSession();
      const user = await supabase.auth.getUser(token);
      // console.log(user);
      // console.log("here");
      // console.log(data?.session?.user);
      if (error) {
        router.push("/signin");
      } else {
        setSession(data.session ?? null);
        if (data?.session?.user?.id != null) {
          setHasSession(true);
          // getUser();
        }
      }
    };
    fetchSession();
  }, [router]);

  useEffect(() => {
    if (
      !localStorage.getItem("firstname") ||
      !localStorage.getItem("lastname") ||
      !localStorage.getItem("token")
    ) {
      console.log("Did not find full name in local storage");
      getUser();
    } else {
      setFullName(
        localStorage.getItem("firstname") +
          " " +
          localStorage.getItem("lastname")
      );
      console.log("Found Name in local storage: ", fullName);
    }
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
      <div className="flex flex-col h-[100dvh] w-64 py-8 px-4 justify-center sm:justify-between bg-[#E5F0FA] border-r-[1px] border-prim-blue text-prim-blue">
        <div className="flex flex-col gap-4">
          <a
            className="h-fit w-fit font-bold text-2xl self-center justify-center flex"
            href="/"
          >
            <Image
              src={Img.LogoFull}
              alt="CallSmart Logo"
              className="w-4/5 h-auto"
            />
          </a>
          <a
            className="flex flex-row p-2 border-[1px] border-prim-blue text-prim-blue rounded-md bg-[#BFD9F2] gap-2"
            href="/account"
          >
            <div className="flex flex-col gap-0 leading-tight">
              <p>{fullName}</p>
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
      <div className="w-[calc(100dvw-256px)] h-[100dvh] bg-grey-light px-6 py-8">
        {children}
      </div>
    </div>
  );
};

export default ProductNavBar;
