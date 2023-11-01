import { useEffect, useState } from "react";
import Multiselect from "@/components/Multiselect";
import Select from "@/components/Select";
import Ticket from "@/components/Ticket";
import {
  Card,
  Table,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";
import TicketProp from "./TicketProp";

type FunctionType = (option: any) => void;

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

const SFContainer = ({
  label,
  handleComplete,
  handleDidNot,
  tickets,
  sortOptions,
  filterOptions,
}: {
  label: string;
  handleComplete: FunctionType;
  handleDidNot: FunctionType;
  tickets: TicketType[];
  sortOptions: string[];
  filterOptions: string[];
}) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState(sortOptions[0]);
  const [showBacklog, setShowBacklog] = useState(false);

  const handleSortSelection = (option: any) => {
    setSortOption(option[0]);
  };

  const handleFilterChange = (options: string[]) => {
    setSelectedFilters(options);
  };

  const sfTickets = tickets
    .filter((ticket) => {
      if (selectedFilters.length === 0) {
        return true;
      }
      if (!ticket) {
        return false;
      }
      return selectedFilters.every((filter) => {
        if (
          filter === "cancel" ||
          filter === "book" ||
          filter === "question" ||
          filter === "reschedule"
        ) {
          return ticket.type === filter; // Match type property for "cancel" and "book" filters
        } else if (filter === "new") {
          return ticket.new_client === true; // Match isNew property for "new" filter
        } else if (filter === "urgent") {
          return ticket.urgent === true; // Match isNew property for "new" filter
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

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Simulate a delay before expanding the div
    const timer = setTimeout(() => {
      setIsExpanded(true);
    }, 200); // delay of 1 second before expanding

    return () => clearTimeout(timer); // Clear timer on component unmount
  }, []);

  const customDateFormat = (time: string) => {
    const date = new Date(time);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[date.getMonth()];

    const day = date.getDate();

    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const amPm = hours >= 12 ? "pm" : "am";

    hours = hours % 12;
    hours = hours || 12; // To display "12" instead of "0" for noon and midnight

    return `${month} ${day}, ${year} - ${hours}:${minutes}${amPm}`;
  };

  const customPhoneNumberFormat = (phoneNumber: string) => {
    // Ensure that the input is a string of digits
    if (!/^\d+$/.test(phoneNumber)) {
      throw new Error("Invalid phone number format.");
    }

    const countryCode = phoneNumber.slice(0, -10);
    const areaCode = phoneNumber.slice(-10, -7);
    const firstPart = phoneNumber.slice(-7, -4);
    const lastPart = phoneNumber.slice(-4);

    // If there's a country code, add the "+" prefix
    const formattedCountryCode = countryCode ? `+${countryCode} ` : "";

    return `${formattedCountryCode}(${areaCode}) ${firstPart} ${lastPart}`;
  };

  // Test
  const phoneNumber = "19055993866";
  console.log(customPhoneNumberFormat(phoneNumber)); // Outputs: +1 (905) 599 3866

  return (
    <div className="flex flex-col gap-4 w-[calc(33%-0.5rem)]">
      <div className="flex flex-row items-center gap-2">
        <div className="flex items-center justify-center h-[28px] w-[28px] bg-sec-blue text-white font-semibold text-sm rounded-full">
          {tickets.length}
        </div>
        <div className="flex justify-between w-[90%] items-center">
          <h3>{label}</h3>
          {label == "Completed" ? (
            <em
              className="hover:text-gray-500 cursor-pointer"
              onClick={() => setShowBacklog(true)}
            >
              View All
            </em>
          ) : null}
        </div>
      </div>
      <div className="sf-container flex-col gap-2">
        <div className="flex flex-row w-full gap-4 justify-between min-h-[28px] items-center">
          Sort <Select onChange={handleSortSelection} options={sortOptions} />
        </div>
        <div className="flex flex-row w-full gap-4 justify-between min-h-[28px] items-center">
          Filter{" "}
          <Multiselect options={filterOptions} onChange={handleFilterChange} />
        </div>
      </div>
      <div
        className={`bg-white overflow-hidden rounded-xl transition-height duration-100 ease-out ${
          isExpanded ? "h-full" : "h-0"
        }`}
      >
        <div
          className={`backlog-container flex-col transition-height duration-500 ease-in ${
            isExpanded ? "h-full gap-4" : "h-0 -gap-4"
          }`}
        >
          {sfTickets.map((ticket, key) => (
            <Ticket
              key={key}
              new_client={ticket?.new_client}
              id={ticket?.id}
              onComplete={handleComplete}
              onDidNot={handleDidNot}
              urgent={ticket?.urgent}
              type={ticket?.type}
              name={ticket?.name}
              number={ticket?.number}
              time={ticket?.time}
              stage={ticket?.stage}
              summary={ticket?.summary}
              conversation={ticket?.conversation}
              times_pending={ticket?.times_pending}
            />
          ))}
        </div>
      </div>
      {showBacklog ? (
        <Card className="absolute-center fixed min-w-max w-2/3 indent-0 z-50">
          <div className="flex justify-between">
            <h3 className="select-none mb-2 text-prim-blue">
              Completed Tickets History
            </h3>
            <p
              className="text-black opacity-50 hover:text-red-500 cursor-pointer"
              onClick={() => setShowBacklog(false)}
            >
              Close
            </p>
          </div>
          <Table>
            <TableHead>
              <TableHeaderCell>Client Name</TableHeaderCell>
              <TableHeaderCell>Call Type</TableHeaderCell>
              <TableHeaderCell>Client Phone Number</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell />
            </TableHead>
            {tickets.map((ticket, key) => (
              <TableRow key={key}>
                <TableCell>{ticket?.name}</TableCell>
                <TableCell>
                  <TicketProp
                    type={ticket?.type}
                    urgent={null}
                    new_client={null}
                    closeable={false}
                    onClose={() => null}
                  />
                </TableCell>
                <TableCell>{customPhoneNumberFormat(ticket?.number)}</TableCell>
                <TableCell>{customDateFormat(ticket?.time)}</TableCell>
                {/* <TableCell>
                  <em>View Conversation</em>
                </TableCell> */}
              </TableRow>
            ))}
          </Table>
        </Card>
      ) : (
        ""
      )}
      <div
        className={
          showBacklog
            ? `bg-black/25 fixed absolute-center w-[100dvw] h-[100dvh]`
            : "hidden"
        }
      />
    </div>
  );
};

export default SFContainer;
