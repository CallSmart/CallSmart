"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabase";
import { supabaseAdmin } from "@/supabaseAdmin";
import Sidebar from "@/components/sidebar";
import ProductNavBar from "@/components/ProductNavBar";
import ClinicTable from "@/components/ClinicTable";
import ManagerEmployeeTable from "@/components/MananagerEmployeeTable";
import { Card, Text } from "@tremor/react";
import { initialize } from "next/dist/server/lib/render-server";

interface Clinic {
  id: number;
  name: string;
  gotoemail: string;
  gotopassword: string;
  initial_message: string;
}

interface Clinics {
  [key: string]: any;
}

interface ClinicsProps {
  clinics: Clinics[] | null;
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
  const [clinicId, setClinicId] = useState(0);

  useEffect(() => {
    const session = supabase.auth.getSession();
    if (!session) {
      router.push("/"); // Redirect to login if not signed in
    }
    getUser();
  }, [router]);

  const fetchClinics = async (clinics: Clinics[] | null) => {
    // console.log("THESE ARE THE CLINICS IN THE FETCH CLINICS FUNCTION");
    // console.log(clinics);
    if (!clinics) {
      // console.log("No clinics provided.");
      return;
    }

    try {
      const fetchPromises = clinics.map((clinic) =>
        supabase
          .from("clinics")
          .select()
          .eq("id", clinic.clinic_id)
          .order("name", { ascending: true })
      );

      const results = await Promise.all(fetchPromises);

      // Combine the results into a single array
      const allClinicsData = results.flatMap((result) => result.data || []);
      // console.log("All clinics data:", allClinicsData);
      setClinics(allClinicsData);
    } catch (error) {
      console.error("Error fetching clinics:", error);
    }
  };
  const fetchEmployees = async (clinics: Clinics[] | null) => {
    if (!clinics) {
      // console.log("No clinics provided.");
      return;
    }

    try {
      const fetchPromises = clinics.map((clinic) =>
        supabase
          .from("employees")
          .select()
          .eq("clinic_id", clinic.clinic_id)
          .order("last_name", { ascending: true })
      );

      const results = await Promise.all(fetchPromises);
      const allEmployeesData = results.flatMap((result) => result.data || []);
      // console.log("All employees data:", allEmployeesData);
      setEmployees(allEmployeesData);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };
  const fetchManagers = async (clinics: Clinics[] | null) => {
    if (!clinics) {
      // console.log("No clinics provided.");
      return;
    }

    try {
      const fetchPromises = clinics.map((clinic) =>
        supabase
          .from("managers")
          .select()
          .eq("clinic_id", clinic.clinic_id)
          .order("last_name", { ascending: true })
      );

      const results = await Promise.all(fetchPromises);

      // Combine the results into a single array
      const allManagersData = results.flatMap((result) => result.data || []);
      // console.log("All managers data:", allManagersData);
      setManagers(allManagersData);
    } catch (error) {
      console.error("Error fetching managers:", error);
    }
  };

  const getUser = async () => {
    const user = await supabase.auth.getUser();
    const user_id = user?.data?.user?.id;

    setUserId(userId);

    // need to change logic to checking whether the person is an owner, and linking stuff better

    if (user_id) {
      const { data: userData, error } = await supabase
        .from("users")
        .select("first_name, last_name, organization, role, clinic")
        .eq("id", user_id);
      if (error) {
        console.error("Error fetching user:", error.message);
      } else {
        const userRole = userData[0].role;
        setFName(userData?.[0]?.first_name || "");
        setLName(userData?.[0]?.last_name || "");
        setOrganization(userData?.[0]?.organization || "");
        setUserRole(userData?.[0]?.role || "");
        let clinics: { [key: string]: any }[] | null;

        if (userRole == "Owner") {
          const { data, error } = await supabase
            .from("owner_clinics")
            .select("clinic_id")
            .eq("owner", user_id);
          // console.log("Tickets path for Owner");
          clinics = data;
        } else if (userRole == "Manager") {
          const { data, error } = await supabase
            .from("managers")
            .select("clinic_id")
            .eq("user_id", user_id);
          clinics = data;
        } else if (userRole == "Employee") {
          const { data, error } = await supabase
            .from("employees")
            .select("clinic_id")
            .eq("user_id", user_id);
          clinics = data;
        } else {
          // console.log("Tickets path for else");
          clinics = null;
        }

        // console.log(clinics);

        fetchClinics(clinics);
        fetchEmployees(clinics);
        fetchManagers(clinics);
      }
    }
  };

  const addClinic = async (
    e: any,
    name: string,
    email: string,
    password: string,
    initial_message: string
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
          initial_message: initial_message,
        },
      ])
      .select("*");
    // console.log(data);

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
            clinic_id: data[0].id,
          },
        ]);
      if (ownerClinicsError) {
        console.error(
          "Error adding relation to owner_clinics:",
          ownerClinicsError.message
        );
        handleErrorOnAdd();
      } else {
        getUser();
      }
    }
    return;
  };

  const addToUserTable = async (dataToInsert: any) => {
    console.log(await supabase.auth.getUser())
    const { data: insertData, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          first_name: dataToInsert.first_name,
          last_name: dataToInsert.last_name,
          id: dataToInsert.user_id,
          email: dataToInsert.email,
          role: dataToInsert.role,
          clinic: dataToInsert.clinic_id
        },
      ]);

    if (insertError) {
      // console.log("User Table: ", insertError);
      return insertError;
    }
  };

  const addEmployeeClinicRelation = async (
    user: any,
    clinic: any
  ) => {
    console.log(clinic)
    console.log(user)
    
    const { data: insertData, error: insertError } = await supabase
      .from("employee_clinics")
      .insert([
        {
          user: user,
          clinic: clinic
        },
      ]);
    if (insertError) {
      console.log("Employee_clinics Table: ", insertError);
      return insertError;
    }
  }

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
    const response = await fetch('/api/signUpUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const { data, error } = await response.json();

    if (error) {
      console.error("Error creating employee:", error.message);
      handleErrorOnAdd();
    } else {
      const userId = data.user?.id;
      const dataToInsert = {
        first_name: firstName,
        last_name: lastName,
        user_id: userId,
        clinic_id: clinic,
        email: email,
        role: "Manager",
      };



      let insertError = await addToUserTable(dataToInsert);
      if (insertError !== undefined) {
        console.error("Error adding employee:", insertError.message);
        handleErrorOnAdd();
      }

      
      let insertRelationError = await addEmployeeClinicRelation(dataToInsert.user_id, dataToInsert.clinic_id)

      if(insertRelationError){
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
        getUser();
      }
    }
  };

  const addToEmployeeTable = async (dataToInsert: any) => {
    console.log(await supabase.auth.getUser())
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
      // console.log("Employee Table: ", insertError);
      return insertError;
    }
  };

  const addManagerClinicRelation = async (
    user: any,
    clinic: any
  ) => {
    console.log(clinic)
    console.log(user)
    
    const { data: insertData, error: insertError } = await supabase
      .from("manager_clinics")
      .insert([
        {
          user: user,
          clinic: clinic
        },
      ]);
    if (insertError) {
      console.log("Manager_clinics Table: ", insertError);
      return insertError;
    }
  }

  const addManager = async (
    e: any,
    firstName: string,
    lastName: string,
    clinic: number | null,
    email: string,
    password: string
  ) => {
    // console.log(firstName, lastName, clinic, email, password);
    e.preventDefault();
    
    const response = await fetch('/api/signUpUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const { data, error } = await response.json();
    // console.log(data)
    
    if (error) {
      console.error("Error creating office manager:", error.message);
      handleErrorOnAdd();
    } else {
      const userId = data.user?.id;
      const dataToInsert = {
        first_name: firstName,
        last_name: lastName,
        user_id: userId,
        clinic_id: clinic,
        email: email,
        role: "Manager",
      };

      let insertError = await addToUserTable(dataToInsert);
      if (insertError !== undefined) {
        console.error("Error adding manager to users:", insertError.message);
        handleErrorOnAdd();
      }

      let insertRelationError = await addManagerClinicRelation(dataToInsert.user_id, dataToInsert.clinic_id)

      if(insertRelationError){
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
        getUser();
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
      // console.log("Employee Table: ", insertError);
      return insertError;
    }
  };

  const editGoToInfo = async (
    e: any,
    clinicId: number,
    name: string,
    email: string,
    password: string,
    initial_message: string
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
      initial_message: initial_message,
    };

    // console.log(dataToInsertOrUpdate);

    const { error } = await supabase
      .from("clinics")
      .upsert([dataToInsertOrUpdate], {
        onConflict: "id",
      });
    if (error) {
      console.error("Error saving GoTo Information:", error.message);
      handleErrorOnAdd();
    }
    getUser();
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
    const { data: employeeUserIDData, error: employeeUserIDError } =
      await supabase.from("employees").select("user_id").eq("id", id).single();

    if (employeeUserIDError) {
      console.error("Error getting manager user ID:", employeeUserIDError);
    }

    let deletedUserID = await employeeUserIDData?.user_id;

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

    const { error: employeeError2 } = await supabase
    .from("employee_clinics")
    .delete()
    .eq("user", deletedUserID);
    if (employeeError2) {
      console.error(
        "Error deleting manager from employee:",
        employeeError2.message
      );
    }

    const { error: usersError } = await supabase
      .from("users")
      .delete()
      .eq("id", deletedUserID);

    if (usersError) {
      console.error("Error deleting employee from users:", usersError.message);
    }

    const response = await fetch("/api/deleteUserFromAuth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reqData: { deletedUserID } }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    } else {
      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee.id !== id)
      );
    }
  };

  const deleteManager = async (id: number) => {
    const { data: managerUserIDData, error: managerUserIDError } =
      await supabase.from("managers").select("user_id").eq("id", id).single();

    if (managerUserIDError) {
      console.error("Error getting manager user ID:", managerUserIDError);
    }

    let deletedUserID = await managerUserIDData?.user_id;
    console.log('here')
    console.log(deletedUserID);

    const { data: managerUser, error: managerUserError } =
      await supabase.from("users").select("*").eq("id", deletedUserID).single();

    if(managerUserError){
      console.error(managerUserError)
    }
    console.log(managerUser)
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

    const { error: managerError } = await supabase
    .from("manager_clinics")
    .delete()
    .eq("user", deletedUserID);
    if (managerError) {
      console.error(
        "Error deleting manager from managers:",
        managerError.message
      );
    }

    // console.log(deletedUserID)
    // console.log('there')

    const { error: usersError } = await supabase
      .from("users")
      .delete()
      .eq("id", deletedUserID);
    console.log('between')
    if (usersError) {
      console.error("Error deleting manager from users:", usersError.message);
    }

    const response = await fetch("/api/deleteUserFromAuth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reqData: { deletedUserID } }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    } else {
      console.log("Deleted from auth!");
      setManagers((prevManagers) =>
        prevManagers.filter((manager) => manager.id !== id)
      );
    }
  };

  const sendPasswordRecoveryEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        // redirectTo: 'https://callsmartai.ca/account/updatePassword',
        redirectTo: 'https://http://localhost:3000/account/updatePassword',
      });

      if (error) {
        console.error("Error sending password recovery email:", error.message);
      } else {
        // console.log("Password recovery email sent successfully!");
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
