"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabase";
import Sidebar from "@/components/sidebar";
import ProductNavBar from "@/components/ProductNavBar";

interface Clinic {
  id: number;
  name: string;
}

export default function AccountPage() {
  const router = useRouter();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [newClinicName, setNewClinicName] = useState("");

  useEffect(() => {
    const session = supabase.auth.getSession();
    if (!session) {
      router.push("/"); // Redirect to login if not signed in
    }
  }, []);

  const fetchClinics = async () => {
    const { data, error } = await supabase
      .from("clinics")
      .select()
      .order("name", { ascending: true });
    if (error) {
      console.error("Error fetching clinics:", error.message);
    } else {
      console.log("data", data);
      setClinics(data || []);
    }
  };

  const addClinic = async () => {
    // insert new clinic into database
    const { error } = await supabase
      .from("clinics")
      .insert([{ name: newClinicName }]);
    if (error) {
      console.error("Error adding clinic:", error.message);
    } else {
      setNewClinicName("");
      fetchClinics();
    }
  };
  const deleteClinic = async (id: number) => {
    const { error } = await supabase.from("clinics").delete().eq("id", id);
    if (error) {
      console.error("Error deleting clinic:", error.message);
    } else {
      setClinics((prevClinics) =>
        prevClinics.filter((clinic) => clinic.id !== id)
      );
    }
  };

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
        <h4 className="">Settings</h4>
        <div className="container flex-col ">
          <button className="w-fit" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </div>
    </ProductNavBar>
  );
}
