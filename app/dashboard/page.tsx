"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabase";
import Sidebar from "@/components/sidebar";
import ProductNavBar from "@/components/ProductNavBar";
import Ticket from "@/components/Ticket";

export default function DashboardPage() {
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
        <h1>Dashboard</h1>
        <Ticket
          isNew={"new"}
          urgent={"urgent"}
          type={"cancel"}
          name={"Bartek Kowalski"}
          number={"+1 905 599 3866"}
          time={"1:32pm"}
        />
      </div>
    </ProductNavBar>
  );
}
