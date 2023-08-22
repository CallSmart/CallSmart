"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabase";
import ProductNavBar from "@/components/ProductNavBar";
import SFContainer from "@/components/SFContainer";

export default function DashboardPage() {
  const router = useRouter();
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
    let clinics: { [key: string]: any }[] | null;

    console.log("Got user: ", id);

    console.log("Trying owner_clinicss");
    const { data, error } = await supabase
      .from("owner_clinics")
      .select("clinic")
      .eq("owner", id);
    clinics = data;

    if (clinics?.length == 0) {
      console.log("Not in owner_clinics, trying manager");
      const { data, error } = await supabase
        .from("managers")
        .select("clinic")
        .eq("userId", id);
      clinics = data;
    } else if (clinics?.length == 0) {
      console.log("Not in managers, trying employees");
      const { data, error } = await supabase
        .from("employees")
        .select("clinic_id")
        .eq("userId", id);
      clinics = data;
    } else if (clinics?.length == 0 || clinics == null) {
      console.log("Not in employees, error fetching clinics");
      return;
    }

    console.log("Got clinics: ", clinics);

    const clinicIds = clinics?.map((clinic) => clinic.clinic);
    if (!clinicIds) {
      return;
    }

    console.log("Got clinic IDs: ", clinicIds);

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
    console.log("setting missed tickets");
    const tickets = allTickets.filter((ticket) => {
      if (ticket.stage == 1) {
        return true;
      } else {
        return false;
      }
    });
    setMissedTickets(tickets);
    console.log("set missed tickets");
  };

  const settingPendingTickets = async () => {
    console.log("setting pending tickets");
    const tickets = allTickets.filter((ticket) => {
      if (ticket.stage == 2) {
        return true;
      } else {
        return false;
      }
    });
    setPendingTickets(tickets);
    console.log("set pending tickets");
  };

  const settingCompletedTickets = async () => {
    console.log("setting completed tickets");
    const tickets = allTickets.filter((ticket) => {
      if (ticket.stage == 3) {
        return true;
      } else {
        return false;
      }
    });
    setCompletedTickets(tickets);
    console.log("set completed tickets");
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
      <div className="flex h-full w-full">
        <div className="flex flex-row w-full gap-4 self-stretch">
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
      </div>
    </ProductNavBar>
  );
}
