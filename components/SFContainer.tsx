import { useEffect, useState } from "react";
import Multiselect from "@/components/Multiselect";
import Select from "@/components/Select";
import Ticket from "@/components/Ticket";

type FunctionType = (option: any) => void;

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
  tickets: {
    id: number;
    isNew: string;
    urgent: string;
    type: string;
    name: string;
    number: string;
    time: string;
    stage: number;
  }[];
  sortOptions: string[];
  filterOptions: string[];
}) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState(sortOptions[0]);

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

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Simulate a delay before expanding the div
    const timer = setTimeout(() => {
      setIsExpanded(true);
    }, 200); // delay of 1 second before expanding

    return () => clearTimeout(timer); // Clear timer on component unmount
  }, []);

  return (
    <div className="flex flex-col gap-4 w-[calc(33%-0.5rem)]">
      <div className="flex flex-row items-center gap-2">
        <div className="flex items-center justify-center h-[28px] w-[28px] bg-sec-blue text-white font-semibold text-sm rounded-full">
          {tickets.length}
        </div>
        <h3>{label}</h3>
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
              isNew={ticket?.isNew}
              id={ticket?.id}
              onComplete={handleComplete}
              onDidNot={handleDidNot}
              urgent={ticket?.urgent}
              type={ticket?.type}
              name={ticket?.name}
              number={ticket?.number}
              time={ticket?.time}
              stage={ticket?.stage}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SFContainer;
