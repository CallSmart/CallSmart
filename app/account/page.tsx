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
      <div className="">
        <h1>Profile</h1>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
    </ProductNavBar>
  );
}
