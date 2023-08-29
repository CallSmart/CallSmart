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
  first_name: string;
  last_name: string;
  clinic_id: number;
  email: string;
}

interface Manager {
  id: number;
  first_name: string;
  last_name: string;
  clinic_id: number;
  email: string;
}

export default function AccountPage() {
  const router = useRouter();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);

  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [organization, setOrganization] = useState("");
  const [userRole, setUserRole] = useState("");

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
    fetchManagers();
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
      .order("last_name", { ascending: true });
    if (error) {
      console.error("Error fetching employees:", error.message);
    } else {
      setEmployees(data || []);
    }
  };

  const fetchManagers = async () => {
    const { data, error } = await supabase
      .from("managers")
      .select()
      .order("last_name", { ascending: true });
    if (error) {
      console.error("Error fetching office managers:", error.message);
    } else {
      setManagers(data || []);
    }
  };

  useEffect(() => {
    getUser();
  }, [fetchClinics, fetchEmployees, fetchManagers]);

  const getUser = async () => {
    const user = await supabase.auth.getUser();
    const user_id = user?.data?.user?.id;

    if (user_id) {
      const { data: userData, error } = await supabase
        .from("users")
        .select("first_name, last_name, organization, role")
        .eq("id", user_id);
      if (error) {
        console.error("Error fetching user:", error.message);
      } else {
        setFName(userData?.[0]?.first_name || "");
        setLName(userData?.[0]?.last_name || "");
        setOrganization(userData?.[0]?.organization || "");
        setUserRole(userData?.[0]?.role || "");
      }
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
    const { data, error } = await supabase
      .from("clinics")
      .insert([
        {
          name: name,
          gotoemail: email,
          gotopassword: password,
        },
      ])
      .select("*");
    console.log(data);

    if (error) {
      console.error("Error adding clinic:", error.message);
      handleErrorOnAdd();
    } else {
      const user = await supabase.auth.getUser();
      const user_id = user?.data?.user?.id;
      const { data: ownerClinicsData, error: ownerClinicsError } =
        await supabase.from("owner_clinics").insert([
          {
            owner: user_id,
            clinic: data[0].id,
          },
        ]);
      if (ownerClinicsError) {
        console.error(
          "Error adding relation to owner_clinics:",
          ownerClinicsError.message
        );
        handleErrorOnAdd();
      } else {
        fetchClinics();
      }
    }
    return;
  };

  const addToUserTable = async (dataToInsert: any) => {
    const { data: insertData, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          first_name: dataToInsert.first_name,
          last_name: dataToInsert.last_name,
          id: dataToInsert.user_id,
          email: dataToInsert.email,
          role: dataToInsert.role,
        },
      ]);

    if (insertError) {
      console.log("User Table: ", insertError);
      return insertError;
    }
  };

  const addEmployee = async (
    e: any,
    firstName: string,
    lastName: string,
    clinic: number | null,
    email: string,
    password: string
  ) => {
    e.preventDefault(); // Don't refresh page

    // Sign user up for an account on CallSmart
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: "/dashboard",
      },
    });

    if (error) {
      console.error("Error creating employee:", error.message);
      handleErrorOnAdd();
    } else {
      const dataToInsert = {
        first_name: firstName,
        last_name: lastName,
        user_id: data?.user?.id,
        clinic_id: clinic,
        email: email,
        role: "Employee",
      };

      console.log(dataToInsert);

      let insertError = await addToUserTable(dataToInsert);
      if (insertError !== undefined) {
        console.error("Error adding employee:", insertError.message);
        handleErrorOnAdd();
      }

      insertError = await addToEmployeeTable(dataToInsert);
      if (insertError !== undefined) {
        console.error(
          "Error adding employee to employee table:",
          insertError.message
        );
        handleErrorOnAdd();
      } else {
        fetchEmployees();
      }
    }
  };

  const addToEmployeeTable = async (dataToInsert: any) => {
    const { data: insertData, error: insertError } = await supabase
      .from("employees")
      .insert([
        {
          first_name: dataToInsert.first_name,
          last_name: dataToInsert.last_name,
          user_id: dataToInsert.user_id,
          clinic_id: dataToInsert.clinic_id,
          email: dataToInsert.email,
        },
      ]);

    if (insertError) {
      console.log("Employee Table: ", insertError);
      return insertError;
    }
  };

  const addManager = async (
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
      const dataToInsert = {
        first_name: firstName,
        last_name: lastName,
        user_id: data?.user?.id,
        clinic_id: clinic,
        email: email,
        role: "Manager",
      };

      console.log(dataToInsert);

      let insertError = await addToUserTable(dataToInsert);
      if (insertError !== undefined) {
        console.error("Error adding manager to users:", insertError.message);
        handleErrorOnAdd();
      }

      insertError = await addToManagerTable(dataToInsert);
      if (insertError !== undefined) {
        console.error(
          "Error adding manager to managers table:",
          insertError.message
        );
        handleErrorOnAdd();
      } else {
        fetchManagers();
      }
    }
  };

  const addToManagerTable = async (dataToInsert: any) => {
    const { data: insertData, error: insertError } = await supabase
      .from("managers")
      .insert([
        {
          first_name: dataToInsert.first_name,
          last_name: dataToInsert.last_name,
          user_id: dataToInsert.user_id,
          clinic_id: dataToInsert.clinic_id,
          email: dataToInsert.email,
        },
      ]);

    if (insertError) {
      console.log("Employee Table: ", insertError);
      return insertError;
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
    const { error: employeeError } = await supabase
      .from("employees")
      .delete()
      .eq("id", id);
    if (employeeError) {
      console.error(
        "Error deleting employee from employees:",
        employeeError.message
      );
    }

    const { error: usersError } = await supabase
      .from("users")
      .delete()
      .eq("id", id);

    if (usersError) {
      console.error("Error deleting employee from users:", usersError.message);
    }

    setEmployees((prevEmployees) =>
      prevEmployees.filter((employee) => employee.id !== id)
    );
  };

  const deleteManager = async (id: number) => {
    const { error: employeeError } = await supabase
      .from("managers")
      .delete()
      .eq("id", id);
    if (employeeError) {
      console.error(
        "Error deleting manager from managers:",
        employeeError.message
      );
    }

    const { error: usersError } = await supabase
      .from("users")
      .delete()
      .eq("id", id);

    if (usersError) {
      console.error("Error deleting manager from users:", usersError.message);
    }

    setEmployees((prevEmployees) =>
      prevEmployees.filter((employee) => employee.id !== id)
    );
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

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Simulate a delay before expanding the div
    const timer = setTimeout(() => {
      setIsExpanded(true);
    }, 100); // delay of 1 second before expanding

    return () => clearTimeout(timer); // Clear timer on component unmount
  }, [fName]);

  return (
    <ProductNavBar>
      <div className="flex flex-col gap-4 min-w-[700px]">
        <Card
          decoration="left"
          className={`flex flex-row justify-between border-prim-blue items-end text-gray-500 overflow-hidden transition-width duration-300 ease-out ${
            isExpanded ? "w-full" : "w-0"
          }`}
        >
          <div>
            <p>Account Owner</p>
            <h2 className="text-3xl text-sec-blue">
              {fName} {lName}
            </h2>
          </div>
          <div className="flex flex-col items-end">
            <p>{userRole}</p>
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
        {userRole !== "Employee" && userRole !== "Manager" ? (
          <ClinicTable
            clinics={userRole ? clinics : []}
            deleteFunction={deleteClinic}
            editFunction={editGoToInfo}
            addFunction={addClinic}
          />
        ) : null}
        {userRole !== "Employee" && userRole !== "Manager" ? (
          <ManagerEmployeeTable
            label={"OFFICE MANAGERS"}
            people={userRole ? managers : []}
            clinics={clinics}
            deleteFunction={deleteManager}
            recoverFunction={sendPasswordRecoveryEmail}
            addFunction={addManager}
          />
        ) : null}
        {userRole !== "Employee" ? (
          <ManagerEmployeeTable
            label={"EMPLOYEES"}
            people={userRole ? employees : []}
            clinics={clinics}
            deleteFunction={deleteEmployee}
            recoverFunction={sendPasswordRecoveryEmail}
            addFunction={addEmployee}
          />
        ) : null}
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
