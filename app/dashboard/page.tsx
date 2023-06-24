"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabase";
import Sidebar from "@/components/sidebar";
import ProductNavBar from "@/components/ProductNavBar";
import Ticket from "@/components/Ticket";
import Multiselect from "@/components/Multiselect";

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
  const [selectedFilters, setSelectedFilters] = useState<string[]>();

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
    const tickets = [
      {
        isNew: "new",
        urgent: "urgent",
        type: "cancel",
        name: "Bartek Kowalski",
        number: "+1 905 599 3866",
        time: "1:32pm",
      },
      {
        isNew: "not",
        urgent: "not",
        type: "book",
        name: "Marcelo Chaman",
        number: "+1 905 599 3866",
        time: "1:32pm",
      },
    ];

    setMissedTickets(tickets);
  };

  const fetchPendingTickets = async () => {
    // const userId = localStorage.getItem("userId");
    // const token = localStorage.getItem("token"); // are we using same logic here?
    //api call for all notes here
    const tickets = [
      {
        isNew: "new",
        urgent: "urgent",
        type: "cancel",
        name: "Bartek Kowalski",
        number: "+1 905 599 3866",
        time: "1:32pm",
      },
      {
        isNew: "not",
        urgent: "not",
        type: "book",
        name: "Marcelo Chaman",
        number: "+1 905 599 3866",
        time: "1:32pm",
      },
    ];

    setPendingTickets(tickets);
  };

  const fetchCompletedTickets = async () => {
    // const userId = localStorage.getItem("userId");
    // const token = localStorage.getItem("token"); // are we using same logic here?
    //api call for all notes here
    const tickets = [
      {
        isNew: "new",
        urgent: "urgent",
        type: "cancel",
        name: "Bartek Kowalski",
        number: "+1 905 599 3866",
        time: "1:32pm",
      },
      {
        isNew: "not",
        urgent: "not",
        type: "book",
        name: "Marcelo Chaman",
        number: "+1 905 599 3866",
        time: "1:32pm",
      },
    ];

    setCompletedTickets(tickets);
  };

  const handleFilterChange = (options: string[]) => {
    setSelectedFilters(options);
  };

  return (
    <ProductNavBar>
      <div className="flex h-full w-full">
        <div className="flex flex-row w-full gap-4 self-stretch">
          <div className="flex flex-col gap-4  w-[calc(33%-0.5rem)]">
            <div className="flex flex-row items-center gap-1">
              <div className="flex items-center justify-center h-[25px] w-[25px] bg-sec-blue text-white font-semibold text-sm rounded-full">
                {missedTickets.length}
              </div>
              <h3>Missed Calls</h3>
            </div>
            <div className="sf-container flex-col gap-2">
              <div className="flex flex-row w-full gap-4 justify-between">
                Sort{" "}
              </div>
              <div className="flex flex-row w-full gap-4 justify-between">
                Filter{" "}
                <Multiselect
                  options={filterOptions}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
            <div className="backlog-container flex-col">
              {missedTickets.map((ticket) => (
                <Ticket
                  isNew={ticket?.isNew}
                  urgent={ticket?.urgent}
                  type={ticket?.type}
                  name={ticket?.name}
                  number={ticket?.number}
                  time={ticket?.time}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4  w-[calc(33%-0.5rem)]">
            <div className="flex flex-row items-center gap-1">
              <div className="flex items-center justify-center h-[25px] w-[25px] bg-sec-blue text-white font-semibold text-sm rounded-full">
                {pendingTickets.length}
              </div>
              <h3>Pending</h3>
            </div>
            <div className="sf-container flex-col gap-2">
              <div>Sort</div>
              {/* needs sort and filter components */}
              <div>Filter</div>
            </div>
            <div className="backlog-container flex-col">
              {pendingTickets.map((ticket) => (
                <Ticket
                  isNew={ticket?.isNew}
                  urgent={ticket?.urgent}
                  type={ticket?.type}
                  name={ticket?.name}
                  number={ticket?.number}
                  time={ticket?.time}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4  w-[calc(33%-0.5rem)]">
            <div className="flex flex-row items-center gap-1">
              <div className="flex items-center justify-center h-[25px] w-[25px] bg-sec-blue text-white font-semibold text-sm rounded-full">
                {completedTickets.length}
              </div>
              <h3>Completed</h3>
            </div>
            <div className="sf-container flex-col gap-2">
              <div>Sort</div>
              {/* needs sort and filter components */}
              <div>Filter</div>
            </div>
            <div className="backlog-container flex-col">
              {completedTickets.map((ticket) => (
                <Ticket
                  isNew={ticket?.isNew}
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
