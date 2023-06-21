"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabase";
import Sidebar from "@/components/sidebar";
import ProductNavBar from "@/components/ProductNavBar";

export default function AnalyticsPage() {
  const router = useRouter();

  useEffect(() => {
    const session = supabase.auth.getSession();
    if (!session) {
      router.push("/signin"); // Redirect to sign-in if no session found
    }
  }, []);

  return (
    <ProductNavBar>
      <div className="">
        <h1>FAQ</h1>
      </div>
    </ProductNavBar>
  );
}
