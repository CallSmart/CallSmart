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
  const [newClinicName, setNewClinicName] = useState("");
  const [newEmployeeFirstName, setNewEmployeeFirstName] = useState("");
  const [newEmployeeLastName, setNewEmployeeLastName] = useState("");
  const [newEmployeeClinicId, setNewEmployeeClinicId] = useState(0);
  const [newOfficeManagerFirstName, setNewOfficeManagerFirstName] = useState("");
  const [newOfficeManagerLastName, setNewOfficeManagerLastName] = useState("");
  const [newOfficeManagerClinicId, setNewOfficeManagerClinicId] = useState(0);
  const [selectedClinicIdEmployee, setSelectedClinicIdEmployee] = useState<number | null>(null);
  const [selectedClinicIdManager, setSelectedClinicIdManager] = useState<number | null>(null);
  const [newEmployeeEmail, setNewEmployeeEmail] = useState("");
  const [newEmployeePassword, setNewEmployeePassword] = useState("");
  const [newOfficeManagerEmail, setNewOfficeManagerEmail] = useState("");
  const [newOfficeManagerPassword, setNewOfficeManagerPassword] = useState("");

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
    fetchEmployees();
    fetchOfficeManagers();
  }, []);

  const fetchClinics = async () => {
    const { data, error } = await supabase.from("clinics").select().order("name", { ascending: true });
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
    }
  };

  const addClinic = async () => {
    const { error } = await supabase.from("clinics").insert([{ name: newClinicName }]);
    if (error) {
      console.error("Error adding clinic:", error.message);
    } else {
      setNewClinicName("");
      fetchClinics();
    }
  };

  const addEmployee = async () => {
    const { data , error } = await supabase.auth.signUp({
      email: newEmployeeEmail,
      password: newEmployeePassword,
    });
  
    if (error) {
      console.error("Error creating employee:", error.message);
    } else {
      const { data: data2, error: insertError } = await supabase
        .from("employees")
        .insert([{ firstName: newEmployeeFirstName, lastName: newEmployeeLastName, userId: data?.user?.id, clinicId: newEmployeeClinicId, email: newEmployeeEmail }]);
  
      if (insertError) {
        console.error("Error adding employee:", insertError.message);
      } else {
        setNewEmployeeFirstName("");
        setNewEmployeeLastName("");
        setNewEmployeeEmail("");
        setNewEmployeePassword("");
        fetchEmployees();
      }
    }
  };
  
  const addOfficeManager = async () => {
    const { data, error } = await supabase.auth.signUp({
      email: newOfficeManagerEmail,
      password: newOfficeManagerPassword,
    });
  
    if (error) {
      console.error("Error creating office manager:", error.message);
    } else {
      const {data: data2, error: insertError } = await supabase
        .from("managers")
        .insert([{ firstName: newOfficeManagerFirstName, lastName: newOfficeManagerLastName, userId: data?.user?.id, clinicId: newOfficeManagerClinicId, email: newOfficeManagerEmail }]);
  
      if (insertError) {
        console.error("Error adding office manager:", insertError.message);
      } else {
        setNewOfficeManagerFirstName("");
        setNewOfficeManagerLastName("");
        setNewOfficeManagerEmail("");
        setNewOfficeManagerPassword("");
        fetchOfficeManagers();
      }
    }
  };
  

  const deleteClinic = async (id: number) => {
    const { error } = await supabase.from("clinics").delete().eq("id", id);
    if (error) {
      console.error("Error deleting clinic:", error.message);
    } else {
      setClinics((prevClinics) => prevClinics.filter((clinic) => clinic.id !== id));
    }
  };

  const deleteEmployee = async (id: number) => {
    const { error } = await supabase.from("employees").delete().eq("id", id);
    if (error) {
      console.error("Error deleting employee:", error.message);
    } else {
      setEmployees((prevEmployees) => prevEmployees.filter((employee) => employee.id !== id));
    }
  };
  
  const deleteOfficeManager = async (id: number) => {
    const { error } = await supabase.from("managers").delete().eq("id", id);
    if (error) {
      console.error("Error deleting office manager:", error.message);
    } else {
      setOfficeManagers((prevManagers) => prevManagers.filter((manager) => manager.id !== id));
    }
  };
  
  const sendPasswordRecoveryEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
  
      if (error) {
        console.error("Error sending password recovery email:", error.message);
      } else {
        console.log("Password recovery email sent successfully!");
        window.alert("Password recovery email sent successfully! Make sure to check your spam folder.");
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
                  {clinic.name}{" "}
                  <button onClick={() => deleteClinic(clinic.id)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      <div className="container flex-col ">
        <div className="mt-4">
          <h2>Add Employee</h2>
          <input
            type="text"
            value={newEmployeeFirstName}
            onChange={(e) => setNewEmployeeFirstName(e.target.value)}
            placeholder="First Name"
          />
          <input
            type="text"
            value={newEmployeeLastName}
            onChange={(e) => setNewEmployeeLastName(e.target.value)}
            placeholder="Last Name"
          />
          <input
            type="email"
            value={newEmployeeEmail}
            onChange={(e) => setNewEmployeeEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={newEmployeePassword}
            onChange={(e) => setNewEmployeePassword(e.target.value)}
            placeholder="Password"
          />
          <select
            value={selectedClinicIdEmployee !== null ? String(selectedClinicIdEmployee) : ""}
            onChange={(e) => setSelectedClinicIdEmployee(Number(e.target.value))}
          >
            <option value="">Select Clinic</option>
            {clinics.map((clinic) => (
              <option key={clinic.id} value={clinic.id}>
                {clinic.name}
              </option>
            ))}
          </select>
          <button onClick={addEmployee}>Add</button>
        </div>
        <div className="mt-4">
          <h2>Employees</h2>
          <ul>
            {employees.map((employee) => (
              <li key={employee.id}>
                {employee.firstName} {employee.lastName} {" "} {employee.email} {" "}
                <button onClick={() => sendPasswordRecoveryEmail(employee.email)}>Recover</button> {" "}
                <button onClick={() => deleteEmployee(employee.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="container flex-col ">
        <div className="mt-4">
          <h2>Add Office Manager</h2>
          <input
            type="text"
            value={newOfficeManagerFirstName}
            onChange={(e) => setNewOfficeManagerFirstName(e.target.value)}
            placeholder="First Name"
          />
          <input
            type="text"
            value={newOfficeManagerLastName}
            onChange={(e) => setNewOfficeManagerLastName(e.target.value)}
            placeholder="Last Name"
          />
          <input
            type="email"
            value={newOfficeManagerEmail}
            onChange={(e) => setNewOfficeManagerEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={newOfficeManagerPassword}
            onChange={(e) => setNewOfficeManagerPassword(e.target.value)}
            placeholder="Password"
          />

          <select
            value={selectedClinicIdManager !== null ? String(selectedClinicIdManager) : ""}
            onChange={(e) => setSelectedClinicIdManager(Number(e.target.value))}
          >
            <option value="">Select Clinic</option>
            {clinics.map((clinic) => (
              <option key={clinic.id} value={clinic.id}>
                {clinic.name}
              </option>
            ))}
          </select>
          <button onClick={addOfficeManager}>Add</button>
        </div>
        <div className="mt-4">
            <h2>Office Managers</h2>
            <ul>
              {officeManagers.map((manager) => (
                <li key={manager.id}>
                  {manager.firstName} {manager.lastName} {" "} {manager.email} {" "}
                  <button onClick={() => sendPasswordRecoveryEmail(manager.email)}>Recover </button> {" "}
                  <button onClick={() => deleteOfficeManager(manager.id)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
      </div>
        
      <div className="container flex-col ">
          <button className="w-fit" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </div>

    </ProductNavBar>
  );
}
