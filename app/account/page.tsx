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
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const session = supabase.auth.getSession();
    if (!session) {
      router.push("/"); // Redirect to login if not signed in
    }
    getUser();
    fetchClinics();
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

  const getUser = async () => {
    const user = await supabase.auth.getUser();
    const id = user?.data?.user?.id;
    if(id) {
      const { data, error } = await supabase
        .from("users")
        .select("firstname, lastname, organization, role")
        .eq("id", id);
      if (error) {
        console.error("Error fetching user:", error.message);
      } else {
        console.log("data", data);
      }
      setFName(data?.[0]?.firstname || "")
      setLName(data?.[0]?.lastname || "")
      setOrganization(data?.[0]?.organization || "")
      setRole(data?.[0]?.role || "")
    }
  }


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
            <h2 className="text-3xl leading-tight">{fName} {lName}</h2>
            <h3 className="text-lg opacity-30 leading-tight">
              <em>{organization}</em>
            </h3>
            <h3 className="text-lg opacity-30 leading-tight">
              <em>{role}</em>
            </h3>
          </div>
        </div>
        <h4 className="">Settings</h4>
        <div className="container flex-col ">
          <button className="w-fit" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
        <div className="container flex-col ">
          <div className="mt-4">
            <h2>Add Clinic</h2>
            <input
              type="text"
              value={newClinicName}
              onChange={(e) => setNewClinicName(e.target.value)}
            />
            <button onClick={addClinic}>Add</button>
          </div>
          <div className="mt-4">
            <h2>Clinics</h2>
            <ul>
              {clinics.map((clinic) => (
                <li key={clinic.id}>
                  {clinic.name}{' '}
                  <button onClick={() => deleteClinic(clinic.id)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </ProductNavBar>
  );
}
