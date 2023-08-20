"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabase";
import Sidebar from "@/components/sidebar";
import ProductNavBar from "@/components/ProductNavBar";
import Ticket from "@/components/Ticket";
import Multiselect from "@/components/Multiselect";
import Select from "@/components/Select";

export default function DashboardPage() {
  const router = useRouter();
  const [missedTickets, setMissedTickets] = useState<
    {
      isNew: string;
      urgent: string;
      type: string;
      name: string;
      number: string;
      time: string;
    }[]
  >([]);
  const [pendingTickets, setPendingTickets] = useState<
    {
      isNew: string;
      urgent: string;
      type: string;
      name: string;
      number: string;
      time: string;
    }[]
  >([]);
  const [completedTickets, setCompletedTickets] = useState<
    {
      isNew: string;
      urgent: string;
      type: string;
      name: string;
      number: string;
      time: string;
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

  const handleSortSelection = (option: any) => {
    setSortOption(option[0]);
  };

  const [selectedFiltersM, setSelectedFiltersM] = useState<string[]>([]);
  const [selectedFiltersP, setSelectedFiltersP] = useState<string[]>([]);
  const [selectedFiltersC, setSelectedFiltersC] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("Most Recent");

  useEffect(() => {
    const session = supabase.auth.getSession();
    if (!session) {
      router.push("/signin"); // Redirect to sign-in if no session found
    }
    fetchMissedTickets();
    fetchPendingTickets();
    fetchCompletedTickets();
  }, []);

  const fetchMissedTickets = async () => {
    // const userId = localStorage.getItem("userId");
    // const token = localStorage.getItem("token"); // are we using same logic here?
    //api call for all notes here

    const token = localStorage.getItem("token") as string;
    const user = await supabase.auth.getUser();
    const id = user?.data?.user?.id;

    console.log("Got user: ", id);

    const { data: clinics, error: clinicsError } = await supabase
      .from("owner_clinics")
      .select("clinic")
      .eq("owner", id);

    if (clinicsError) {
      console.error("Error fetching clinics:", clinicsError);
      return;
    }

    console.log("Got clinics: ", clinics);

    const clinicIds = clinics.map((clinic) => clinic.clinic);
    console.log("Got clinic IDs: ", clinicIds);

    const { data: tickets, error: ticketsError } = await supabase
      .from("tickets")
      .select("*")
      .in("clinic", clinicIds)
      .eq("stage", 1);

    if (ticketsError) {
      console.error("Error fetching tickets:", ticketsError);
      return;
    }
    console.log("Got tickets: ", tickets);

    setMissedTickets(tickets);
  };

  const fetchPendingTickets = async () => {
    // const tickets = [];
    // setPendingTickets(tickets);
  };

  const fetchCompletedTickets = async () => {
    // const tickets = [];
    // setCompletedTickets(tickets);
  };

  const handleFilterChangeM = (options: string[]) => {
    setSelectedFiltersM(options);
  };

  const handleFilterChangeP = (options: string[]) => {
    setSelectedFiltersP(options);
  };

  const handleFilterChangeC = (options: string[]) => {
    setSelectedFiltersC(options);
  };

  const sfMissedTickets = missedTickets
    .filter((ticket) => {
      if (selectedFiltersM.length === 0) {
        return true;
      }
      if (!ticket) {
        return false;
      }
      return selectedFiltersM.every((filter) => {
        if (
          filter === "cancel" ||
          filter === "book" ||
          filter === "question" ||
          filter === "reschedule"
        ) {
          return ticket.type === filter; // Match type property for "cancel" and "book" filters
        } else if (filter === "new") {
          return ticket.isNew === "new"; // Match isNew property for "new" filter
        } else if (filter === "urgent") {
          return ticket.urgent === "urgent"; // Match isNew property for "new" filter
        }
        return false; // Return false for unknown filters
      });
    })
    .sort((a, b) => {
      if (sortOption == "Most Recent") {
        return b?.time.localeCompare(a?.time);
      } else if (sortOption == "Oldest") {
        return a?.time.localeCompare(b?.time);
      }
      return 0;
    });

  const sfPendingTickets = pendingTickets
    .filter((ticket) => {
      if (selectedFiltersP.length === 0) {
        return true;
      }
      if (!ticket) {
        return false;
      }
      return selectedFiltersP.some((filter) => {
        // Use some() instead of every()
        if (
          filter === "cancel" ||
          filter === "book" ||
          filter === "question" ||
          filter === "reschedule"
        ) {
          return ticket.type === filter; // Match type property for these filters
        } else if (filter === "new") {
          return ticket.isNew === "new"; // Match isNew property for "new" filter
        } else if (filter === "urgent") {
          return ticket.urgent === "urgent"; // Match urgent property for "urgent" filter
        }
        return false; // Return false for unknown filters
      });
    })
    .sort((a, b) => {
      if (sortOption == "Most Recent") {
        return b?.time.localeCompare(a?.time);
      } else if (sortOption == "Oldest") {
        return a?.time.localeCompare(b?.time);
      }
      return 0;
    });

  const sfCompletedTickets = completedTickets
    .filter((ticket) => {
      if (selectedFiltersC.length === 0) {
        return true;
      }
      if (!ticket) {
        return false;
      }
      return selectedFiltersC.every((filter) => {
        if (
          filter === "cancel" ||
          filter === "book" ||
          filter === "question" ||
          filter === "reschedule"
        ) {
          return ticket.type === filter; // Match type property for "cancel" and "book" filters
        } else if (filter === "new") {
          return ticket.isNew === "new"; // Match isNew property for "new" filter
        } else if (filter === "urgent") {
          return ticket.urgent === "urgent"; // Match isNew property for "new" filter
        }
        return false; // Return false for unknown filters
      });
    })
    .sort((a, b) => {
      if (sortOption == "Most Recent") {
        return b?.time.localeCompare(a?.time);
      } else if (sortOption == "Oldest") {
        return a?.time.localeCompare(b?.time);
      }
      return 0;
    });

  const handleDidNot = (id: string) => {
    console.log("I STILL DID NOT!!!");
  };

  const handleComplete = (id: string) => {
    console.log("I STILL DID!!!");
  };

  return (
    <ProductNavBar>
      <div className="flex h-full w-full">
        <div className="flex flex-row w-full gap-4 self-stretch">
          <div className="flex flex-col gap-4 w-[calc(33%-0.5rem)]">
            <div className="flex flex-row items-center gap-1">
              <div className="flex items-center justify-center h-[25px] w-[25px] bg-sec-blue text-white font-semibold text-sm rounded-full">
                {missedTickets.length}
              </div>
              <h3>Missed Calls</h3>
            </div>
            <div className="sf-container flex-col gap-2">
              <div className="flex flex-row w-full gap-4 justify-between">
                Sort{" "}
                <Select onChange={handleSortSelection} options={sortOptions} />
              </div>
              <div className="flex flex-row w-full gap-4 justify-between">
                Filter{" "}
                <Multiselect
                  options={filterOptions}
                  onChange={handleFilterChangeM}
                />
              </div>
            </div>
            <div className="backlog-container flex-col">
              {sfMissedTickets.map((ticket, key) => (
                <Ticket
                  key={key}
                  isNew={ticket?.isNew}
                  // id={ticket,id}
                  id={"key"}
                  onComplete={handleComplete}
                  onDidNot={handleDidNot}
                  urgent={ticket?.urgent}
                  type={ticket?.type}
                  name={ticket?.name}
                  number={ticket?.number}
                  time={ticket?.time}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4 w-[calc(33%-0.5rem)]">
            <div className="flex flex-row items-center gap-1">
              <div className="flex items-center justify-center h-[25px] w-[25px] bg-sec-blue text-white font-semibold text-sm rounded-full">
                {pendingTickets.length}
              </div>
              <h3>Pending</h3>
            </div>
            <div className="sf-container flex-col gap-2">
              <div className="flex flex-row w-full gap-4 justify-between">
                Sort{" "}
                <Select onChange={handleSortSelection} options={sortOptions} />
              </div>
              <div className="flex flex-row w-full gap-4 justify-between">
                Filter{" "}
                <Multiselect
                  options={filterOptions}
                  onChange={handleFilterChangeP}
                />
              </div>
            </div>
            <div className="backlog-container flex-col">
              {sfPendingTickets.map((ticket, key) => (
                <Ticket
                  key={key}
                  isNew={ticket?.isNew}
                  // id={ticket,id}
                  id={"key"}
                  onComplete={handleComplete}
                  onDidNot={handleDidNot}
                  urgent={ticket?.urgent}
                  type={ticket?.type}
                  name={ticket?.name}
                  number={ticket?.number}
                  time={ticket?.time}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4 w-[calc(33%-0.5rem)]">
            <div className="flex flex-row items-center gap-1">
              <div className="flex items-center justify-center h-[25px] w-[25px] bg-sec-blue text-white font-semibold text-sm rounded-full">
                {completedTickets.length}
              </div>
              <h3>Completed</h3>
            </div>
            <div className="sf-container flex-col gap-2">
              <div className="flex flex-row w-full gap-4 justify-between">
                Sort{" "}
                <Select onChange={handleSortSelection} options={sortOptions} />
              </div>
              <div className="flex flex-row w-full gap-4 justify-between">
                Filter{" "}
                <Multiselect
                  options={filterOptions}
                  onChange={handleFilterChangeC}
                />
              </div>
            </div>
            <div className="backlog-container flex-col">
              {sfCompletedTickets.map((ticket, key) => (
                <Ticket
                  key={key}
                  isNew={ticket?.isNew}
                  // id={ticket,id}
                  id={"key"}
                  onComplete={handleComplete}
                  onDidNot={handleDidNot}
                  urgent={ticket?.urgent}
                  type={ticket?.type}
                  name={ticket?.name}
                  number={ticket?.number}
                  time={ticket?.time}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProductNavBar>
  );
}
