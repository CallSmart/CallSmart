"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabase";
import ProductNavBar from "@/components/ProductNavBar";
import SFContainer from "@/components/SFContainer";

export default function DashboardPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [allTickets, setAllTickets] = useState<
    {
      id: number;
      isNew: string;
      urgent: string;
      type: string;
      name: string;
      number: string;
      time: string;
      stage: number;
    }[]
  >([]);
  const [missedTickets, setMissedTickets] = useState<
    {
      id: number;
      isNew: string;
      urgent: string;
      type: string;
      name: string;
      number: string;
      time: string;
      stage: number;
    }[]
  >([]);
  const [pendingTickets, setPendingTickets] = useState<
    {
      id: number;
      isNew: string;
      urgent: string;
      type: string;
      name: string;
      number: string;
      time: string;
      stage: number;
    }[]
  >([]);
  const [completedTickets, setCompletedTickets] = useState<
    {
      id: number;
      isNew: string;
      urgent: string;
      type: string;
      name: string;
      number: string;
      time: string;
      stage: number;
    }[]
  >([]);
  const filterOptions = [
    "cancel",
    "question",
    "book",
    "reschedule",
    "urgent",
    "new",
  ];
  const sortOptions = ["Most Recent", "Oldest"];

  useEffect(() => {
    const session = supabase.auth.getSession();
    if (!session) {
      router.push("/signin"); // Redirect to sign-in if no session found
    }
    fetchAllTickets();
  }, []);

  useEffect(() => {
    settingMissedTickets();
    settingPendingTickets();
    settingCompletedTickets();
  }, [allTickets]);

  const updateTickets = async () => {
    console.log("Updating tickets");
    await settingMissedTickets();
    await settingPendingTickets();
    await settingCompletedTickets();
  };

  const fetchAllTickets = async () => {
    const user = await supabase.auth.getUser();
    const id = user?.data?.user?.id;

    const { data: userRoleData, error: userRoleError } = await supabase
      .from("users")
      .select("role")
      .eq("id", id);

    if (userRoleError) {
      console.log("Error fetching user role");
      return;
    }

    const userRole = userRoleData[0].role;
    console.log(userRole);

    let clinics: { [key: string]: any }[] | null;

    if (userRole == "Owner") {
      const { data, error } = await supabase
        .from("owner_clinics")
        .select("clinic")
        .eq("owner", id);
      clinics = data;
    } else if (userRole == "Manager") {
      const { data, error } = await supabase
        .from("managers")
        .select("clinic_id")
        .eq("user_id", id);
      clinics = data;
    } else if (userRole == "Employee") {
      const { data, error } = await supabase
        .from("employee")
        .select("clinic_id")
        .eq("user_id", id);
      clinics = data;
    } else {
      clinics = null;
    }

    console.log(clinics);

    const clinicIds = clinics?.map((clinic) => clinic.clinic);
    if (!clinicIds) {
      return;
    } else {
      console.log(String(clinicIds));
    }

    const { data: tickets, error: ticketsError } = await supabase
      .from("tickets")
      .select("*")
      .in("clinic", clinicIds);

    if (ticketsError) {
      console.error("Error fetching tickets:", ticketsError);
      return;
    }
    console.log("Got tickets: ", tickets);

    setAllTickets(tickets);
  };

  const settingMissedTickets = async () => {
    const tickets = allTickets.filter((ticket) => {
      if (ticket.stage == 1) {
        return true;
      } else {
        return false;
      }
    });
    setMissedTickets(tickets);
  };

  const settingPendingTickets = async () => {
    const tickets = allTickets.filter((ticket) => {
      if (ticket.stage == 2) {
        return true;
      } else {
        return false;
      }
    });
    setPendingTickets(tickets);
  };

  const settingCompletedTickets = async () => {
    const tickets = allTickets.filter((ticket) => {
      if (ticket.stage == 3) {
        return true;
      } else {
        return false;
      }
    });
    setCompletedTickets(tickets);
  };

  const handleDidNot = async (id: number) => {
    const { data, error } = await supabase
      .from("tickets")
      .update({ stage: 2 })
      .eq("id", id)
      .select();
    if (error) {
      console.log("Error updating ticket stage: ", error);
    } else {
      console.log("Updated ticket stage: ", data);
    }

    await fetchAllTickets();

    console.log("I STILL DID NOT!!!: ", id);
  };

  const handleComplete = async (id: number) => {
    const { data, error } = await supabase
      .from("tickets")
      .update({ stage: 3 })
      .eq("id", id)
      .select();
    if (error) {
      console.log("Error updating ticket stage: ", error);
    } else {
      console.log("Updated ticket stage: ", data);
    }
    await fetchAllTickets();
  };

  return (
    <ProductNavBar>
      <div className="flex h-full w-full min-w-[724px] flex-row gap-4 self-stretch">
        <SFContainer
          label={"Missed"}
          handleComplete={handleComplete}
          handleDidNot={handleDidNot}
          tickets={missedTickets}
          sortOptions={sortOptions}
          filterOptions={filterOptions}
        />
        <SFContainer
          label={"Pending"}
          handleComplete={handleComplete}
          handleDidNot={handleDidNot}
          tickets={pendingTickets}
          sortOptions={sortOptions}
          filterOptions={filterOptions}
        />
        <SFContainer
          label={"Completed"}
          handleComplete={handleComplete}
          handleDidNot={handleDidNot}
          tickets={completedTickets}
          sortOptions={sortOptions}
          filterOptions={filterOptions}
        />
      </div>
    </ProductNavBar>
  );
}
