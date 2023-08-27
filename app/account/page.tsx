"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabase";
import Sidebar from "@/components/sidebar";
import ProductNavBar from "@/components/ProductNavBar";
import ClinicTable from "@/components/ClinicTable";
import ManagerEmployeeTable from "@/components/MananagerEmployeeTable";
import { Card, Text } from "@tremor/react";

interface Clinic {
  id: number;
  name: string;
  gotoemail: string;
  gotopassword: string;
}

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  clinicId: number;
  email: string;
}

interface OfficeManager {
  id: number;
  firstName: string;
  lastName: string;
  clinicId: number;
  email: string;
}

export default function AccountPage() {
  const router = useRouter();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [officeManagers, setOfficeManagers] = useState<OfficeManager[]>([]);

  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("");

  const [errorOnAdd, setErrorOnAdd] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const session = supabase.auth.getSession();
    if (!session) {
      router.push("/"); // Redirect to login if not signed in
    }
    getUser();
    fetchClinics();
    fetchEmployees();
    fetchOfficeManagers();
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

  const fetchEmployees = async () => {
    const { data, error } = await supabase
      .from("employees")
      .select()
      .order("lastName", { ascending: true });
    if (error) {
      console.error("Error fetching employees:", error.message);
    } else {
      setEmployees(data || []);
    }
  };

  const fetchOfficeManagers = async () => {
    const { data, error } = await supabase
      .from("managers")
      .select()
      .order("lastName", { ascending: true });
    if (error) {
      console.error("Error fetching office managers:", error.message);
    } else {
      setOfficeManagers(data || []);
    }
  };

  const getUser = async () => {
    const user = await supabase.auth.getUser();
    const id = user?.data?.user?.id;

    if (id) {
      const { data, error } = await supabase
        .from("users")
        .select("firstname, lastname, organization, role")
        .eq("id", id);
      if (error) {
        console.error("Error fetching user:", error.message);
      } else {
        setFName(data?.[0]?.firstname || "");
        setLName(data?.[0]?.lastname || "");
        setOrganization(data?.[0]?.organization || "");
        setRole(data?.[0]?.role || "");
      }
      setFName(data?.[0]?.firstname || "");
      setLName(data?.[0]?.lastname || "");
      setOrganization(data?.[0]?.organization || "");
      setRole(data?.[0]?.role || "");
    }
  };

  const addClinic = async (
    e: any,
    name: string,
    email: string,
    password: string
  ) => {
    e.preventDefault();
    if (!name.slice()) {
      e.preventDefault();
      handleErrorOnAdd();
      return;
    }
    const { error } = await supabase.from("clinics").insert([
      {
        name: name,
        gotoemail: email,
        gotopassword: password,
      },
    ]);
    if (error) {
      console.error("Error adding clinic:", error.message);
      handleErrorOnAdd();
    } else {
      fetchClinics();
    }
    return;
  };

  const addEmployee = async (
    e: any,
    firstName: string,
    lastName: string,
    clinic: number | null,
    email: string,
    password: string
  ) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.error("Error creating employee:", error.message);
      handleErrorOnAdd();
    } else {
      const { data: data2, error: insertError } = await supabase
        .from("employees")
        .insert([
          {
            firstName: firstName,
            lastName: lastName,
            userId: data?.user?.id,
            clinic_id: clinic,
            email: email,
          },
        ]);

      if (insertError) {
        console.error("Error adding employee:", insertError.message);
        handleErrorOnAdd();
      } else {
        fetchEmployees();
      }
    }
  };

  const addOfficeManager = async (
    e: any,
    firstName: string,
    lastName: string,
    clinic: number | null,
    email: string,
    password: string
  ) => {
    console.log(firstName, lastName, clinic, email, password);
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.error("Error creating office manager:", error.message);
      handleErrorOnAdd();
    } else {
      const { data: data2, error: insertError } = await supabase
        .from("managers")
        .insert([
          {
            firstName: firstName,
            lastName: lastName,
            userId: data?.user?.id,
            clinicId: clinic,
            email: email,
          },
        ]);

      if (insertError) {
        console.error("Error adding office manager:", insertError.message);
        handleErrorOnAdd();
      } else {
        fetchOfficeManagers();
      }
    }
  };

  const editGoToInfo = async (
    e: any,
    clinicId: number,
    name: string,
    email: string,
    password: string
  ) => {
    e.preventDefault();
    if (!password.slice() || !email.slice()) {
      handleErrorOnAdd();
      return;
    }

    const dataToInsertOrUpdate = {
      gotoemail: email,
      gotopassword: password,
      id: clinicId,
      name: name,
    };

    console.log(dataToInsertOrUpdate);

    const { error } = await supabase
      .from("clinics")
      .upsert([dataToInsertOrUpdate], {
        onConflict: "id",
      });
    if (error) {
      console.error("Error saving GoTo Information:", error.message);
      handleErrorOnAdd();
    }
    fetchClinics();
    return;
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

  const deleteEmployee = async (id: number) => {
    const { error } = await supabase.from("employees").delete().eq("id", id);
    if (error) {
      console.error("Error deleting employee:", error.message);
    } else {
      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee.id !== id)
      );
    }
  };

  const deleteOfficeManager = async (id: number) => {
    const { error } = await supabase.from("managers").delete().eq("id", id);
    if (error) {
      console.error("Error deleting office manager:", error.message);
    } else {
      setOfficeManagers((prevManagers) =>
        prevManagers.filter((manager) => manager.id !== id)
      );
    }
  };

  const sendPasswordRecoveryEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        console.error("Error sending password recovery email:", error.message);
      } else {
        console.log("Password recovery email sent successfully!");
        window.alert(
          "Password recovery email sent successfully! Make sure to check your spam folder."
        );
      }
    } catch (error) {
      console.error("Error sending password recovery email:", error);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push("/");
    }
  };

  const handleErrorOnAdd = () => {
    setErrorOnAdd(true);
    setTimeout(() => {
      setErrorOnAdd(false);
    }, 2000);
  };

  return (
    <ProductNavBar>
      <div className="flex flex-col gap-4 min-w-[700px]">
        <Card
          decoration="left"
          className="flex flex-row justify-between border-prim-blue items-end text-gray-500"
        >
          <div>
            <p>Account Owner</p>
            <h2 className="text-3xl text-sec-blue">
              {fName} {lName}
            </h2>
          </div>
          <div className="flex flex-col items-end">
            <p>Clinic Name: {organization}</p>
            <p>Role: {role}</p>
          </div>
        </Card>
        <div
          className={`${
            errorOnAdd
              ? "h-[100dvh] w-[100dvw] absolute left-0 top-0 bg-black bg-opacity-75"
              : "hidden"
          }`}
        >
          <div
            className={`${
              errorOnAdd
                ? "font-semibold text-xl px-4 py-2 bg-[#E44D43] text-[#FAE3DE] rounded-xl w-fit z-50 absolute-center static"
                : "hidden"
            }`}
          >
            Error on Form Submission
          </div>
        </div>
        <ClinicTable
          clinics={clinics}
          deleteFunction={deleteClinic}
          editFunction={editGoToInfo}
          addFunction={addClinic}
        />
        <ManagerEmployeeTable
          label={"OFFICE MANAGERS"}
          people={officeManagers}
          clinics={clinics}
          deleteFunction={deleteOfficeManager}
          recoverFunction={sendPasswordRecoveryEmail}
          addFunction={addOfficeManager}
        />
        <ManagerEmployeeTable
          label={"EMPLOYEES"}
          people={employees}
          clinics={clinics}
          deleteFunction={deleteEmployee}
          recoverFunction={sendPasswordRecoveryEmail}
          addFunction={addEmployee}
        />
        <h4>Settings</h4>
        <div className="container flex-col gap-2">
          <button
            className="w-fit text-red-500 hover:text-red-300 active:text-red-500"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      </div>
    </ProductNavBar>
  );
}
