"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabase";
import Sidebar from "@/components/sidebar";
import ProductNavBar from "@/components/ProductNavBar";

interface Clinic {
  id: number;
  name: string;
  gotoemail: string;
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
  const [newOfficeManagerFirstName, setNewOfficeManagerFirstName] =
    useState("");
  const [newOfficeManagerLastName, setNewOfficeManagerLastName] = useState("");
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

  const [goToEmail, setGoToEmail] = useState("");
  const [goToPassword, setGoToPassword] = useState("");
  const [goToClinic, setGoToClinic] = useState<number | null>(null);

  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("");

  const [isClinicOpen, setIsClinicOpen] = useState(false);
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [isEmployeeOpen, setIsEmployeeOpen] = useState(false);
  const [isGoToOpen, setIsGoToOpen] = useState(false);
  const [editedClinicId, setEditedClinicId] = useState<number | null>(null);

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
    setNewEmployeeEmail("");
    setNewEmployeePassword("");
    setSelectedClinicIdEmployee(null);
  }, [isEmployeeOpen]);

  useEffect(() => {
    setNewOfficeManagerFirstName("");
    setNewOfficeManagerLastName("");
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

  const addClinic = async (e: any) => {
    e.preventDefault();
    setIsClinicOpen(false);
    if (!newClinicName.slice()) {
      e.preventDefault();
      handleErrorOnAdd();
      return;
    }
    const { error } = await supabase.from("clinics").insert([
      {
        name: newClinicName,
        gotoemail: goToEmail,
        gotopassword: goToPassword,
      },
    ]);
    if (error) {
      console.error("Error adding clinic:", error.message);
      handleErrorOnAdd();
    } else {
      setNewClinicName("");
      setGoToEmail("");
      setGoToPassword("");
      fetchClinics();
    }
    setIsClinicOpen(false);
  };

  const addEmployee = async (e: any) => {
    e.preventDefault();
    setIsEmployeeOpen(false);

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
            clinic_id: selectedClinicIdEmployee,
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
  };

  const addOfficeManager = async (e: any) => {
    e.preventDefault();
    setIsManagerOpen(false);
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
            clinicId: selectedClinicIdManager,
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
        setSelectedClinicIdManager(null);
        fetchOfficeManagers();
      }
    }
  };

  const addGoToInfo = async (e: any, clinicId: number, name: string) => {
    e.preventDefault();
    setIsGoToOpen(false);
    if (!goToPassword.slice() || !goToEmail.slice()) {
      handleErrorOnAdd();
      return;
    }

    const dataToInsertOrUpdate = {
      gotoemail: goToEmail,
      gotopassword: goToPassword,
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
    } else {
      setGoToClinic(null);
      setGoToEmail("");
      setGoToPassword("");
    }
    setIsGoToOpen(false);
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
        <div className="w-full border-2 border-sec-blue rounded-lg bg-white overflow-scroll">
          <table className="w-full table-auto border-sec-blue overflow-hidden">
            <thead className="bg-sec-blue text-white text-sm font-semibold overflow-scroll">
              <tr>
                <th colSpan={5} className="py-1 px-2 text-left">
                  CLINICS
                </th>
              </tr>
              <tr className="font-medium indent-2 text-left">
                <th>ID</th>
                <th>Clinic Name</th>
                <th>GoTo Email</th>
                <th colSpan={2}></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sec-blue overflow-scroll">
              {clinics.map((clinic, key) => (
                <tr className="divide-x divide-sec-blue indent-2" key={key}>
                  <td className="max-w-[100px] overflow-scroll bg-sec-blue text-white font-semibold px-2 indent-0">
                    {clinic.id}
                  </td>
                  <td className="w-1/2 max-w-[100px] overflow-scroll">
                    {clinic.name}
                  </td>
                  <td className="w-1/2 max-w-[100px] overflow-scroll">
                    {clinic.gotoemail}
                  </td>
                  <td className="w-fit bg-sec-blue">
                    <button
                      className="bg-sec-blue text-white font-bold w-24 items-center justify-center"
                      onClick={() => {
                        setIsGoToOpen((prevState) => !prevState);
                        setEditedClinicId(clinic.id);
                      }}
                    >
                      Edit Info
                      {key == 1 ? (
                        <div
                          className={`${
                            isGoToOpen
                              ? "h-[100dvh] w-[100dvw] absolute left-0 top-0 bg-black bg-opacity-75"
                              : ""
                          }`}
                        />
                      ) : (
                        ""
                      )}
                    </button>
                  </td>
                  <td className="w-fit pl-2 pr-4 bg-sec-blue">
                    <button
                      className="bg-sec-blue text-white hover:text-[#ff0000] font-bold w-8 items-center justify-center"
                      onClick={() => deleteClinic(clinic.id)}
                    >
                      -
                    </button>
                    {isGoToOpen && clinic.id === editedClinicId ? (
                      <form
                        onSubmit={(e) =>
                          addGoToInfo(e, editedClinicId, clinic.name)
                        }
                        className={
                          "ticket-container w-1/4 flex-col p-4 z-40 absolute-center text-left static gap-4"
                        }
                      >
                        <h4>Edit GoTo Info</h4>
                        <span>
                          <label>GoTo Email</label>
                          <input
                            type="text"
                            value={goToEmail}
                            placeholder="Email"
                            onChange={(e) => setGoToEmail(e.target.value)}
                          />
                        </span>
                        <span>
                          <label>GoTo Password</label>
                          <input
                            type="password"
                            value={goToPassword}
                            placeholder="Password (Case sensitive)"
                            onChange={(e) => setGoToPassword(e.target.value)}
                          />
                        </span>
                        <button type="submit" className="btn-action">
                          Save GoTo Info
                        </button>
                      </form>
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-sec-blue w-full">
              <tr>
                <td colSpan={5}>
                  <span
                    className="flex text-white hover:text-gray-500 hover:cursor-pointer font-bold w-8 items-center justify-center"
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
                    <form
                      className="ticket-container w-1/4 flex-col p-4 z-40 absolute-center static gap-4"
                      onSubmit={addClinic}
                    >
                      <h4>Add a Clinic</h4>
                      <span>
                        <label>Clinic Name</label>
                        <input
                          type="text"
                          value={newClinicName}
                          placeholder="Clinic Name"
                          onChange={(e) => setNewClinicName(e.target.value)}
                        ></input>
                      </span>
                      <span>
                        <label>GoTo Email</label>
                        <input
                          type="text"
                          value={goToEmail}
                          placeholder="Email"
                          onChange={(e) => setGoToEmail(e.target.value)}
                        />
                      </span>
                      <span>
                        <label>GoTo Password</label>
                        <input
                          type="password"
                          value={goToPassword}
                          placeholder="Password (Case sensitive)"
                          onChange={(e) => setGoToPassword(e.target.value)}
                        />
                      </span>
                      <button className="btn-action" type="submit">
                        Add Clinic
                      </button>
                    </form>
                  ) : (
                    ""
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="w-full border-2 border-sec-blue rounded-lg bg-white overflow-scroll">
          <table className="w-full table-auto border-sec-blue overflow-hidden ">
            <thead className="bg-sec-blue text-white text-sm font-semibold overflow-scroll">
              <tr>
                <th colSpan={6} className="py-1 px-2 text-left">
                  OFFICE MANAGERS
                </th>
              </tr>
              <tr className="font-medium indent-2 text-left">
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Clinic ID</th>
                <th colSpan={2}></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sec-blue overflow-scroll">
              {officeManagers.map((manager) => (
                <tr
                  className="divide-x divide-sec-blue indent-2"
                  key={manager.id}
                >
                  <td className="w-1/4 max-w-[100px] overflow-scroll">
                    {manager.firstName}
                  </td>
                  <td className="w-1/4 max-w-[100px] overflow-scroll">
                    {manager.lastName}
                  </td>
                  <td className="w-1/4 max-w-[100px] overflow-scroll">
                    {manager.email}
                  </td>
                  <td className="w-1/4 max-w-[100px] overflow-scroll">
                    {manager.clinicId}
                  </td>
                  <td className="w-fit bg-sec-blue">
                    <button
                      className="text-white font-bold items-center"
                      onClick={() => sendPasswordRecoveryEmail(manager.email)}
                    >
                      Recover
                    </button>
                  </td>
                  <td className="w-fit pl-2 pr-4 bg-sec-blue">
                    <button
                      className="text-white hover:text-[#ff0000] font-bold items-center justify-center"
                      onClick={() => deleteOfficeManager(manager.id)}
                    >
                      -
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-sec-blue w-full">
              <tr>
                <td colSpan={6}>
                  <span
                    className="flex text-white hover:text-gray-500 hover:cursor-pointer font-bold w-8 items-center justify-center"
                    onClick={() => setIsManagerOpen((prevState) => !prevState)}
                  >
                    <p>+</p>
                    <div
                      className={`${
                        isManagerOpen
                          ? "h-[100dvh] w-[100dvw] absolute left-0 top-0 bg-black bg-opacity-75"
                          : ""
                      }`}
                    />
                  </span>
                  {isManagerOpen ? (
                    <form
                      onSubmit={addOfficeManager}
                      className={
                        "ticket-container w-1/4 flex-col p-4 z-40 absolute-center static gap-4"
                      }
                    >
                      <h4>Add an Office Manager</h4>
                      <span>
                        <label>First Name</label>
                        <input
                          type="text"
                          value={newOfficeManagerFirstName}
                          placeholder="Clinic Name"
                          onChange={(e) =>
                            setNewOfficeManagerFirstName(e.target.value)
                          }
                        />
                      </span>
                      <span>
                        <label>Last Name</label>
                        <input
                          type="text"
                          value={newOfficeManagerLastName}
                          placeholder="Last Name"
                          onChange={(e) =>
                            setNewOfficeManagerLastName(e.target.value)
                          }
                        />
                      </span>
                      <span>
                        <label>Email</label>
                        <input
                          type="text"
                          value={newOfficeManagerEmail}
                          placeholder="Email"
                          onChange={(e) =>
                            setNewOfficeManagerEmail(e.target.value)
                          }
                        />
                      </span>
                      <span>
                        <label>Password</label>
                        <input
                          type="password"
                          value={newOfficeManagerPassword}
                          placeholder="password"
                          onChange={(e) =>
                            setNewOfficeManagerPassword(e.target.value)
                          }
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
                      <button className="btn-action" type="submit">
                        Add Manager
                      </button>
                    </form>
                  ) : null}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="w-full border-2 border-sec-blue rounded-lg bg-white overflow-scroll">
          <table className="w-full table-auto border-sec-blue overflow-hidden">
            <thead className="bg-sec-blue text-white text-sm font-semibold overflow-scroll">
              <tr>
                <th colSpan={6} className="py-1 indent-2 text-left">
                  EMPLOYEES
                </th>
              </tr>
              <tr className="font-medium indent-2 text-left">
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Clinic ID</th>
                <th colSpan={2}></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sec-blue overflow-scroll">
              {employees.map((employee) => (
                <tr
                  className="divide-x divide-sec-blue indent-2"
                  key={employee.id}
                >
                  <td className="w-1/4 max-w-[100px] overflow-scroll">
                    {employee.firstName}
                  </td>
                  <td className="w-1/4 max-w-[100px] overflow-scroll">
                    {employee.lastName}
                  </td>
                  <td className="w-1/4 max-w-[100px] overflow-scroll">
                    {employee.email}
                  </td>
                  <td className="w-1/4 max-w-[100px] overflow-scroll">
                    {employee.clinicId}
                  </td>
                  <td className="w-fit bg-sec-blue">
                    <button
                      className="text-white font-bold items-center"
                      onClick={() => sendPasswordRecoveryEmail(employee.email)}
                    >
                      Recover
                    </button>
                  </td>
                  <td className="w-fit pl-2 pr-4 bg-sec-blue">
                    <button
                      className="text-white hover:text-[#ff0000] font-bold items-center justify-center"
                      onClick={() => deleteEmployee(employee.id)}
                    >
                      -
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-sec-blue w-full">
              <tr>
                <td colSpan={6}>
                  <span
                    className="flex text-white hover:text-gray-500 hover:cursor-pointer font-bold w-8 items-center justify-center"
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
                    <form
                      onSubmit={addEmployee}
                      className={
                        "ticket-container w-1/4 flex-col p-4 z-40 absolute-center static gap-4"
                      }
                    >
                      <h4>Add an Employee</h4>
                      <span>
                        <label>First Name</label>
                        <input
                          type="text"
                          value={newEmployeeFirstName}
                          placeholder="Clinic Name"
                          onChange={(e) =>
                            setNewEmployeeFirstName(e.target.value)
                          }
                        />
                      </span>
                      <span>
                        <label>Last Name</label>
                        <input
                          type="text"
                          value={newEmployeeLastName}
                          placeholder="Last Name"
                          onChange={(e) =>
                            setNewEmployeeLastName(e.target.value)
                          }
                        />
                      </span>
                      <span>
                        <label>Email</label>
                        <input
                          type="text"
                          value={newEmployeeEmail}
                          placeholder="Email"
                          onChange={(e) => setNewEmployeeEmail(e.target.value)}
                        />
                      </span>
                      <span>
                        <label>Password</label>
                        <input
                          type="password"
                          value={newEmployeePassword}
                          placeholder="password"
                          onChange={(e) =>
                            setNewEmployeePassword(e.target.value)
                          }
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
                      <button type="submit" className="btn-action">
                        Add Employee
                      </button>
                    </form>
                  ) : (
                    ""
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <h4>Settings</h4>
        <div className="container flex-col gap-2">
          <button
            className="w-fit hover:text-prim-blue"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      </div>
    </ProductNavBar>
  );
}
