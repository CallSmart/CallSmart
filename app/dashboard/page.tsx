"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabase";
import ProductNavBar from "@/components/ProductNavBar";
import SFContainer from "@/components/SFContainer";

export default function DashboardPage() {
  interface TicketType {
    id: number;
    new_client: boolean;
    urgent: boolean;
    type: string;
    name: string;
    number: string;
    time: string;
    stage: number;
    conversation: JSON;
    conversation_active: boolean;
    summary: string;
    times_pending: number;
  }

  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [allTickets, setAllTickets] = useState<TicketType[]>([]);
  const [missedTickets, setMissedTickets] = useState<TicketType[]>([]);
  const [pendingTickets, setPendingTickets] = useState<TicketType[]>([]);
  const [completedTickets, setCompletedTickets] = useState<TicketType[]>([]);
  const filterOptions = [
    "cancel",
    "question",
    "book",
    "reschedule",
    "urgent",
    "new",
  ];
  const sortOptions = ["Oldest", "Most Recent"];

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
    // console.log("Updating tickets");
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
    // console.log(userRole);

    let clinics: { [key: string]: any }[] | null;

    if (userRole == "Owner") {
      const { data, error } = await supabase
        .from("owner_clinics")
        .select("clinic_id")
        .eq("owner", id);
      // console.log("Tickets path for Owner");
      clinics = data;
    } else if (userRole == "Manager") {
      const { data, error } = await supabase
        .from("managers")
        .select("clinic_id")
        .eq("user_id", id);
      clinics = data;
    } else if (userRole == "Employee") {
      const { data, error } = await supabase
        .from("employees")
        .select("clinic_id")
        .eq("user_id", id);
      clinics = data;
    } else {
      // console.log("Tickets path for else");
      clinics = null;
    }

    // console.log(clinics);

    const clinicIds = clinics?.map((clinic) => clinic.clinic_id);
    if (!clinicIds) {
      return;
    } else {
      // console.log(String(clinicIds));
    }

    const { data: tickets, error: ticketsError } = await supabase
      .from("tickets")
      .select("*")
      .in("clinic", clinicIds)
      .eq("information_recieved", true)
      .filter(
        "time",
        "gte",
        new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString()
      );
    if (ticketsError) {
      console.error("Error fetching tickets:", ticketsError);
      return;
    }
    // const response = await fetch('/api/getTickets', { method: "POST" });
    // const data = await response.json(); // Parsing the response as JSON

    // Assuming the JSON structure has a 'tickets' property
    // setAllTickets(data.tickets);
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
    let { data: timesPendingArray, error: error1 } = await supabase
      .from("tickets")
      .select("times_pending")
      .eq("id", id);

    if (error1) {
      console.log("Error fetching times_pending: ", error1);
    }

    // Ensure there's data and extract the times_pending value.
    if (timesPendingArray && timesPendingArray.length > 0) {
      let times_pending_incremented = timesPendingArray[0].times_pending;
      times_pending_incremented += 1;

      if (times_pending_incremented > 3) {
        const { data, error } = await supabase
          .from("tickets")
          .update({ stage: 4, times_pending: times_pending_incremented })
          .eq("id", id)
          .select();
        if (error) {
          console.log("Error updating ticket stage: ", error);
        } else {
          console.log("Updated ticket stage: ", data);
        }
      } else {
        const { data, error } = await supabase
          .from("tickets")
          .update({ stage: 2, times_pending: times_pending_incremented })
          .eq("id", id)
          .select();
        if (error) {
          console.log("Error updating ticket stage: ", error);
        } else {
          console.log("Updated ticket stage: ", data);
        }
      }
    }

    await fetchAllTickets();
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

  const handleDelete = async (id: number) => {
    const { data, error } = await supabase
      .from("tickets")
      .delete()
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
          handleDelete={handleDelete}
          handleDidNot={handleDidNot}
          tickets={missedTickets}
          sortOptions={sortOptions}
          filterOptions={filterOptions}
        />
        <SFContainer
          label={"Pending"}
          handleComplete={handleComplete}
          handleDelete={handleDelete}
          handleDidNot={handleDidNot}
          tickets={pendingTickets}
          sortOptions={sortOptions}
          filterOptions={filterOptions}
        />
        <SFContainer
          label={"Completed"}
          handleComplete={handleComplete}
          handleDelete={handleDelete}
          handleDidNot={handleDidNot}
          tickets={completedTickets}
          sortOptions={sortOptions}
          filterOptions={filterOptions}
        />
      </div>
    </ProductNavBar>
  );
}
