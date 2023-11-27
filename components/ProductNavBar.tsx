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
import { Card, Icon, Title } from "@tremor/react";

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
  const [userRole, setUserRole] = useState("");
  const [fullName, setFullName] = useState("");
  const [contactOpen, setContactOpen] = useState(false);
  const router = useRouter();

  const NavButton = ({ to, children }: { to: any; children: any }) => {
    return (
      <a
        href={to}
        className={
          "indent-6 py-2 text-prim-blue hover:bg-prim-blue/10 active:bg-prim-blue/25 rounded-xl flex flex-row items-center relative"
        }
      >
        {pathname == to ? (
          <div className="h-[5px] w-[5px] rounded-full bg-prim-blue absolute left-2" />
        ) : (
          ""
        )}
        <p>{children}</p>{" "}
      </a>
    );
  };

  const getUser = async () => {
    const user = await supabase.auth.getUser();
    if (user.error) {
      console.log("Calling redirect: ", user.error);
      router.push("/signin");
    }

    const user_id = user?.data?.user?.id;
    if (user_id) {
      const { data: userData, error } = await supabase
        .from("users")
        .select("first_name, last_name, role")
        .eq("id", user_id);
      if (error) {
        console.error("Error fetching user:", error.message);
      }
      setUserRole(userData?.[0]?.role || "");
      localStorage.setItem("first_name", userData?.[0]?.first_name || "");
      localStorage.setItem("last_name", userData?.[0]?.last_name || "");
      setFullName(
        localStorage.getItem("first_name") +
          " " +
          localStorage.getItem("last_name")
      );
      clearTimeout;
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      const token = localStorage.getItem("token") as string;
      const { data, error } = await supabase.auth.getSession();
      const user = await supabase.auth.getUser(token);
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
      getUser();
    } else {
      setFullName(
        localStorage.getItem("firstname") +
          " " +
          localStorage.getItem("lastname")
      );
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
    <div className="flex flex-row bg-white">
      <Card
        decoration="right"
        className="flex flex-col h-[100dvh] w-52 lg:w-72 py-8 px-6 justify-between rounded-l-none rounded-r-3xl bg-prim-blue/10 border-prim-blue text-prim-blue transition-all duration-300 ease-in"
      >
        <div className="flex flex-col gap-6">
          <a className="h-fit w-fit self-center justify-center flex" href="/">
            <Image
              src={Img.LogoFull}
              alt="CallSmart Logo"
              className="hidden lg:block w-4/5 h-auto"
            />
            <Image
              src={Img.IconFull}
              alt="CallSmart Logo"
              className="lg:hidden h-6 w-auto"
            />
          </a>
          <div className="flex flex-row px-4 py-2 border-[1px] border-prim-blue text-prim-blue rounded-xl bg-[#BFD9F2] gap-2">
            <div className="flex flex-col gap-0 leading-tight overflow-hidden">
              <p className="w-full whitespace-nowrap overflow-hidden truncate">
                {fullName}
              </p>
              <a href="/account" className="flex flex-row w-full items-center">
                <em className="opacity-50 hover:opacity-100 hidden lg:block">
                  Manage Account
                </em>
                <em className="opacity-50 hover:opacity-100 lg:hidden">
                  Manage Acc.
                </em>
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-medium">Dashboards</p>
            <hr className="border-prim-blue" />
            <span className="lg:hidden">
              <NavButton to="/dashboard">Tickets</NavButton>
              {userRole == "Manager" || userRole == "Owner" ? (
                <NavButton to="/analytics">Analytics</NavButton>
              ) : null}
            </span>
            <span className="hidden lg:block">
              <NavButton to="/dashboard">Tickets Dashboard</NavButton>
              {userRole == "Manager" || userRole == "Owner" ? (
                <NavButton to="/analytics">Analytics Dashboard</NavButton>
              ) : null}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <hr className="border-prim-blue" />
          <NavButton to="/faq">FAQ</NavButton>
          <div
            className={
              "indent-6 cursor-pointer py-2 text-prim-blue hover:bg-prim-blue/10 active:bg-prim-blue/25 rounded-xl flex flex-row items-center relative"
            }
            onClick={() => setContactOpen(true)}
          >
            <p className="select-none">Contact</p>
          </div>
        </div>
      </Card>
      {contactOpen ? (
        <Card className="absolute-center fixed min-w-max w-1/2 indent-0 z-50">
          <div className="flex justify-between">
            <h3 className="select-none mb-2 text-prim-blue">Contact Us!</h3>
            <p
              className="text-black opacity-50 hover:text-red-500 hover:opacity-100 cursor-pointer"
              onClick={() => setContactOpen(false)}
            >
              Close
            </p>
          </div>
          <p>
            <b>Email:</b> nathanmazahereh@callsmartai.com
          </p>
          <p>
            <b>Phone Number:</b> 289-885-2340
          </p>
        </Card>
      ) : (
        ""
      )}
      <div
        className={
          contactOpen
            ? `bg-black/50 fixed absolute-center w-[100dvw] h-[100dvh] z-40`
            : "hidden"
        }
      />
      <div className="w-[calc(100dvw-13rem)] lg:w-[calc(100dvw-256px)] h-[100dvh] bg-gray-100 px-6 py-8 overflow-scroll">
        {children}
      </div>
    </div>
  );
};

export default ProductNavBar;
