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
  const [newOfficeManagerFirstName, setNewOfficeManagerFirstName] =
    useState("");
  const [newOfficeManagerLastName, setNewOfficeManagerLastName] = useState("");
  const [newOfficeManagerClinicId, setNewOfficeManagerClinicId] = useState(0);
  const [selectedClinicIdEmployee, setSelectedClinicIdEmployee] = useState<
    number | null
  >(null);
  const [selectedClinicIdManager, setSelectedClinicIdManager] = useState<
    number | null
  >(null);
  const [newEmployeeEmail, setNewEmployeeEmail] = useState("");
  const [newEmployeePassword, setNewEmployeePassword] = useState("");
  const [newOfficeManagerEmail, setNewOfficeManagerEmail] = useState("");
  const [newOfficeManagerPassword, setNewOfficeManagerPassword] = useState("");

  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("");

  const [isClinicOpen, setIsClinicOpen] = useState(false);
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [isEmployeeOpen, setIsEmployeeOpen] = useState(false);

  const [isInputClicked, setIsInputClicked] = useState(false);

  const [errorOnAdd, setErrorOnAdd] = useState(false);

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

  useEffect(() => {
    setNewClinicName("");
  }, [isClinicOpen]);

  useEffect(() => {
    setNewEmployeeFirstName("");
    setNewEmployeeLastName("");
    setNewEmployeeClinicId(0);
    setNewEmployeeEmail("");
    setNewEmployeePassword("");
    setSelectedClinicIdEmployee(null);
  }, [isEmployeeOpen]);

  useEffect(() => {
    setNewOfficeManagerFirstName("");
    setNewOfficeManagerLastName("");
    setNewOfficeManagerClinicId(0);
    setNewOfficeManagerEmail("");
    setNewOfficeManagerPassword("");
    setSelectedClinicIdManager(null);
  }, [isManagerOpen]);

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
    }
  };

  const addClinic = async () => {
    const { error } = await supabase
      .from("clinics")
      .insert([{ name: newClinicName }]);
    if (error) {
      console.error("Error adding clinic:", error.message);
      handleErrorOnAdd();
    } else {
      setNewClinicName("");
      fetchClinics();
    }
    setIsClinicOpen(false);
  };

  const addEmployee = async () => {
    const { data, error } = await supabase.auth.signUp({
      email: newEmployeeEmail,
      password: newEmployeePassword,
    });

    if (error) {
      console.error("Error creating employee:", error.message);
      handleErrorOnAdd();
    } else {
      const { data: data2, error: insertError } = await supabase
        .from("employees")
        .insert([
          {
            firstName: newEmployeeFirstName,
            lastName: newEmployeeLastName,
            userId: data?.user?.id,
            clinicId: newEmployeeClinicId,
            email: newEmployeeEmail,
          },
        ]);

      if (insertError) {
        console.error("Error adding employee:", insertError.message);
        handleErrorOnAdd();
      } else {
        setNewEmployeeFirstName("");
        setNewEmployeeLastName("");
        setNewEmployeeEmail("");
        setNewEmployeePassword("");
        fetchEmployees();
      }
    }
    setIsEmployeeOpen(false);
  };

  const addOfficeManager = async () => {
    const { data, error } = await supabase.auth.signUp({
      email: newOfficeManagerEmail,
      password: newOfficeManagerPassword,
    });

    if (error) {
      console.error("Error creating office manager:", error.message);
      handleErrorOnAdd();
    } else {
      const { data: data2, error: insertError } = await supabase
        .from("managers")
        .insert([
          {
            firstName: newOfficeManagerFirstName,
            lastName: newOfficeManagerLastName,
            userId: data?.user?.id,
            clinicId: newOfficeManagerClinicId,
            email: newOfficeManagerEmail,
          },
        ]);

      if (insertError) {
        console.error("Error adding office manager:", insertError.message);
        handleErrorOnAdd();
      } else {
        setNewOfficeManagerFirstName("");
        setNewOfficeManagerLastName("");
        setNewOfficeManagerEmail("");
        setNewOfficeManagerPassword("");
        fetchOfficeManagers();
      }
    }
    setIsManagerOpen(false);
  };

  const addEmployee = async () => {
    const { data, error } = await supabase.auth.signUp({
      email: newEmployeeEmail,
      password: newEmployeePassword,
    });

    if (error) {
      console.error("Error creating employee:", error.message);
    } else {
      const { data: data2, error: insertError } = await supabase
        .from("employees")
        .insert([
          {
            firstName: newEmployeeFirstName,
            lastName: newEmployeeLastName,
            userId: data?.user?.id,
            clinicId: newEmployeeClinicId,
            email: newEmployeeEmail,
          },
        ]);

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
      const { data: data2, error: insertError } = await supabase
        .from("managers")
        .insert([
          {
            firstName: newOfficeManagerFirstName,
            lastName: newOfficeManagerLastName,
            userId: data?.user?.id,
            clinicId: newOfficeManagerClinicId,
            email: newOfficeManagerEmail,
          },
        ]);

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
      setClinics((prevClinics) =>
        prevClinics.filter((clinic) => clinic.id !== id)
      );
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push("/");
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (!isInputClicked) {
        setIsClinicOpen(false);
        setIsManagerOpen(false);
        setIsEmployeeOpen(false);
      }
    }, 200);
  };

  const handleErrorOnAdd = () => {
    setErrorOnAdd(true);
    setTimeout(() => {
      setErrorOnAdd(false);
    }, 2000);
  };

  return (
    <ProductNavBar>
      <div className="flex flex-col gap-4">
        <div className="container flex-row gap-4">
          <div className="h-20 w-20 bg-black rounded-full" />
          <div className="flex flex-col">
            <h2 className="text-3xl leading-tight">
              {fName} {lName}
            </h2>
            <h3 className="text-lg opacity-30 leading-tight">
              <em>{organization}</em>
            </h3>
            <h3 className="text-lg opacity-30 leading-tight">
              <em>{role}</em>
            </h3>
          </div>
        </div>
        <div
          className={`${
            errorOnAdd
              ? "font-semibold text-xl px-4 py-2 bg-[#E44D43] text-[#FAE3DE] rounded-xl w-fit z-50 absolute-center"
              : "hidden"
          }`}
        >
          Error on Add
        </div>
        <div className="ticket-container flex-col divide-y border-px divide-sec-blue">
          <div className="text-white bg-sec-blue justify-center py-1 text-sm font-semibold px-2">
            <p className="text-left">CLINICS</p>
          </div>
          <ul className="divide-y border-px divide-sec-blue">
            {clinics.map((clinic) => (
              <li className="w-full flex flex-row" key={clinic.id}>
                <div className="flex bg-sec-blue text-white font-semibold text-sm w-8 justify-center items-center">
                  {clinic.id}
                </div>
                <div className="w-full pl-2">{clinic.name}</div>
                <button
                  className="bg-sec-blue text-white hover:text-[#ff0000] font-bold w-8 items-center justify-center"
                  onClick={() => deleteClinic(clinic.id)}
                >
                  -
                </button>
              </li>
            ))}
          </ul>
          <div
            tabIndex={0}
            onBlur={() => handleBlur()}
            className="bg-sec-blue w-full"
          >
            <span
              className="flex text-white font-bold w-8 items-center justify-center"
              onClick={() => setIsClinicOpen((prevState) => !prevState)}
            >
              <p>+</p>
              <div
                className={`${
                  isClinicOpen
                    ? "h-[100dvh] w-[100dvw] absolute left-0 top-0 bg-black bg-opacity-75"
                    : ""
                }`}
              />
            </span>
            {isClinicOpen ? (
              <div
                className={
                  "ticket-container w-1/4 flex-col p-4 z-40 absolute-center static gap-4"
                }
              >
                <h4>Add a Clinic</h4>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="flex flex-col"
                >
                  <label>Clinic Name</label>
                  <input
                    className=""
                    type="text"
                    value={newClinicName}
                    placeholder="Clinic Name"
                    onKeyDown={(e) => (e.key == "Enter" ? addClinic() : null)}
                    onChange={(e) => setNewClinicName(e.target.value)}
                    onFocus={(e) => {
                      e.stopPropagation();
                      setIsInputClicked(true);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsInputClicked(true);
                    }}
                  />
                </span>
                <button
                  className="btn-action"
                  onClick={(e) => {
                    e.stopPropagation();
                    addClinic();
                  }}
                >
                  Add Clinic
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="ticket-container flex-col divide-y border-px divide-sec-blue">
          <div className="text-white bg-sec-blue justify-center py-1 text-sm font-semibold px-2">
            <p className="text-left">OFFICE MANAGERS</p>
          </div>
          <div className="flex flex-row w-full divide-x divide-sec-blue border-px border-sec-blue font-medium">
            <span className="w-1/4 pl-2">First Name</span>
            <span className="w-1/4 pl-2">Last Name</span>
            <span className="w-1/4 pl-2">Email</span>
            <span className="w-1/4 pl-2">Clinic ID</span>
            <span className="w-28 bg-sec-blue" />
          </div>
          <ul className="w-full divide-y border-px divide-sec-blue">
            {officeManagers.map((manager) => (
              <li
                className="flex flex-row w-full divide-x divide-sec-blue border-px border-sec-blue"
                key={manager.id}
              >
                <span className="w-1/4 pl-2">{manager.firstName}</span>
                <span className="w-1/4 pl-2">{manager.lastName}</span>
                <span className="w-1/4 pl-2">{manager.email}</span>
                <span className="w-1/4 pl-2">{manager.clinicId}</span>
                <button
                  className="bg-sec-blue text-white font-bold w-20 items-center"
                  onClick={() => sendPasswordRecoveryEmail(manager.email)}
                >
                  Recover
                </button>
                <button
                  className="bg-sec-blue text-white hover:text-[#ff0000] font-bold w-8 items-center justify-center"
                  onClick={() => deleteOfficeManager(manager.id)}
                >
                  -
                </button>
              </li>
            ))}
          </ul>
          <div
            tabIndex={0}
            onBlur={() => handleBlur()}
            className="bg-sec-blue w-full"
          >
            <span
              className="flex text-white font-bold w-8 items-center justify-center"
              onClick={() => setIsManagerOpen((prevState) => !prevState)}
            >
              <p>+</p>
              <div
                className={`${
                  isManagerOpen || errorOnAdd
                    ? "h-[100dvh] w-[100dvw] absolute left-0 top-0 bg-black bg-opacity-75"
                    : ""
                }`}
              />
            </span>
            {isManagerOpen ? (
              <div
                className={
                  "ticket-container w-1/4 flex-col p-4 z-40 absolute-center static gap-4"
                }
              >
                <h4>Add an Office Manager</h4>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="flex flex-col"
                >
                  <label>First Name</label>
                  <input
                    type="text"
                    value={newOfficeManagerFirstName}
                    placeholder="Clinic Name"
                    onChange={(e) =>
                      setNewOfficeManagerFirstName(e.target.value)
                    }
                    onFocus={(e) => {
                      e.stopPropagation();
                      setIsInputClicked(true);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsInputClicked(true);
                    }}
                  />
                </span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="flex flex-col"
                >
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={newOfficeManagerLastName}
                    placeholder="Last Name"
                    onChange={(e) =>
                      setNewOfficeManagerLastName(e.target.value)
                    }
                    onFocus={(e) => {
                      e.stopPropagation();
                      setIsInputClicked(true);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsInputClicked(true);
                    }}
                  />
                </span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="flex flex-col"
                >
                  <label>Email</label>
                  <input
                    type="text"
                    value={newOfficeManagerEmail}
                    placeholder="Email"
                    onChange={(e) => setNewOfficeManagerEmail(e.target.value)}
                    onFocus={(e) => {
                      e.stopPropagation();
                      setIsInputClicked(true);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsInputClicked(true);
                    }}
                  />
                </span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="flex flex-col"
                >
                  <label>Password</label>
                  <input
                    type="password"
                    value={newOfficeManagerPassword}
                    placeholder="password"
                    onChange={(e) =>
                      setNewOfficeManagerPassword(e.target.value)
                    }
                    onFocus={(e) => {
                      e.stopPropagation();
                      setIsInputClicked(true);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsInputClicked(true);
                    }}
                  />
                </span>
                <span>
                  <label>Assign Clinic</label>
                  <select
                    value={
                      selectedClinicIdManager !== null
                        ? String(selectedClinicIdManager)
                        : ""
                    }
                    onChange={(e) =>
                      setSelectedClinicIdManager(Number(e.target.value))
                    }
                    className="border-b-2 border-[#CBCCD0] w-full"
                  >
                    <option value="">Clinic Name</option>
                    {clinics.map((clinic) => (
                      <option key={clinic.id} value={clinic.id}>
                        {clinic.name}
                      </option>
                    ))}
                  </select>
                </span>
                <button
                  className="btn-action"
                  onClick={(e) => {
                    e.stopPropagation();
                    addOfficeManager();
                  }}
                >
                  Add Clinic
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="ticket-container flex-col divide-y border-px divide-sec-blue">
          <div className="text-white bg-sec-blue justify-center py-1 text-sm font-semibold px-2">
            <p className="text-left">EMPLOYEES</p>
          </div>
          <div className="flex flex-row w-full divide-x divide-sec-blue border-px border-sec-blue font-medium">
            <span className="w-1/4 pl-2">First Name</span>
            <span className="w-1/4 pl-2">Last Name</span>
            <span className="w-1/4 pl-2">Email</span>
            <span className="w-1/4 pl-2">Clinic ID</span>
            <span className="w-28 bg-sec-blue" />
          </div>
          <ul className="w-full divide-y border-px divide-sec-blue">
            {employees.map((employee) => (
              <li
                className="flex flex-row w-full divide-x divide-sec-blue border-px border-sec-blue"
                key={employee.id}
              >
                <span className="w-1/4 pl-2">{employee.firstName}</span>
                <span className="w-1/4 pl-2">{employee.lastName}</span>
                <span className="w-1/4 pl-2">{employee.email}</span>
                <span className="w-1/4 pl-2">{employee.clinicId}</span>
                <button
                  className="bg-sec-blue text-white font-bold w-20 items-center"
                  onClick={() => sendPasswordRecoveryEmail(employee.email)}
                >
                  Recover
                </button>
                <button
                  className="bg-sec-blue text-white hover:text-[#ff0000] font-bold w-8 items-center justify-center"
                  onClick={() => deleteEmployee(employee.id)}
                >
                  -
                </button>
              </li>
            ))}
          </ul>
          <div
            tabIndex={0}
            onBlur={() => handleBlur()}
            className="bg-sec-blue w-full"
          >
            <span
              className="flex text-white font-bold w-8 items-center justify-center"
              onClick={() => setIsEmployeeOpen((prevState) => !prevState)}
            >
              <p>+</p>
              <div
                className={`${
                  isEmployeeOpen
                    ? "h-[100dvh] w-[100dvw] absolute left-0 top-0 bg-black bg-opacity-75"
                    : ""
                }`}
              />
            </span>
            {isEmployeeOpen ? (
              <div
                className={
                  "ticket-container w-1/4 flex-col p-4 z-40 absolute-center static gap-4"
                }
              >
                <h4>Add an Employee</h4>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="flex flex-col"
                >
                  <label>First Name</label>
                  <input
                    type="text"
                    value={newEmployeeFirstName}
                    placeholder="Clinic Name"
                    onChange={(e) => setNewEmployeeFirstName(e.target.value)}
                    onFocus={(e) => {
                      e.stopPropagation();
                      setIsInputClicked(true);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsInputClicked(true);
                    }}
                  />
                </span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="flex flex-col"
                >
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={newEmployeeLastName}
                    placeholder="Last Name"
                    onChange={(e) => setNewEmployeeLastName(e.target.value)}
                    onFocus={(e) => {
                      e.stopPropagation();
                      setIsInputClicked(true);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsInputClicked(true);
                    }}
                  />
                </span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="flex flex-col"
                >
                  <label>Email</label>
                  <input
                    type="text"
                    value={newEmployeeEmail}
                    placeholder="Email"
                    onChange={(e) => setNewEmployeeEmail(e.target.value)}
                    onFocus={(e) => {
                      e.stopPropagation();
                      setIsInputClicked(true);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsInputClicked(true);
                    }}
                  />
                </span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="flex flex-col"
                >
                  <label>Password</label>
                  <input
                    type="password"
                    value={newEmployeePassword}
                    placeholder="password"
                    onChange={(e) => setNewEmployeePassword(e.target.value)}
                    onFocus={(e) => {
                      e.stopPropagation();
                      setIsInputClicked(true);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsInputClicked(true);
                    }}
                  />
                </span>
                <span>
                  <label>Assign Clinic</label>
                  <select
                    value={
                      selectedClinicIdEmployee !== null
                        ? String(selectedClinicIdEmployee)
                        : ""
                    }
                    onChange={(e) =>
                      setSelectedClinicIdEmployee(Number(e.target.value))
                    }
                    className="border-b-2 border-[#CBCCD0] w-full"
                  >
                    <option value="">Clinic Name</option>
                    {clinics.map((clinic) => (
                      <option key={clinic.id} value={clinic.id}>
                        {clinic.name}
                      </option>
                    ))}
                  </select>
                </span>
                <button
                  className="btn-action"
                  onClick={(e) => {
                    e.stopPropagation();
                    addEmployee();
                  }}
                >
                  Add Clinic
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <h4>Settings</h4>
        <div className="container flex-col ">
          <button className="w-fit" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </div>
    </ProductNavBar>
  );
}
