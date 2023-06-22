"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabase";
import Sidebar from "@/components/sidebar";
import ProductNavBar from "@/components/ProductNavBar";

export default function AccountPage() {
  const router = useRouter();

  useEffect(() => {
    const session = supabase.auth.getSession();
    if (!session) {
      router.push("/"); // Redirect to login if not signed in
    }
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push("/"); // Redirect to login after signing out
    }
  };

  return (
    <ProductNavBar>
      <div className="flex flex-col gap-4">
        <div className="container flex-row gap-4">
          <div className="h-20 w-20 bg-black rounded-full" />
          <div className="flex flex-col">
            <h2 className="text-3xl leading-tight">Marcelo Chaman</h2>
            <h3 className="text-lg opacity-30 leading-tight">
              <em>CallSmart Dental Office</em>
            </h3>
            <h3 className="text-lg opacity-30 leading-tight">
              <em>Owner</em>
            </h3>
          </div>
        </div>
        <h4 className="font-semibold text-xl text-sec-blue">Settings</h4>
        <div className="container flex-col ">
          <button className="w-fit" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </div>
    </ProductNavBar>
  );
}
