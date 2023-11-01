import * as Icons from "@/components/svgs";
import TicketProp from "./TicketProp";
import { useEffect, useState } from "react";
type FunctionType = (id: number) => void;

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
}

const Ticket = ({
  id,
  onDidNot,
  onComplete,
  new_client,
  urgent,
  type,
  name,
  number,
  time,
  stage,
  conversation,
  summary,
  times_pending,
}: {
  id: number;
  onDidNot: FunctionType;
  onComplete: FunctionType;
  new_client: boolean;
  urgent: boolean;
  type: string;
  name: string;
  number: string;
  time: string;
  stage: number;
  conversation: JSON;
  summary: string;
  times_pending: number;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [textOpen, setTextOpen] = useState(false);

  const handleDidNot = (id: number) => {
    console.log("I DID NOT!!!");
    onDidNot(id);
  };

  const handleComplete = (id: number) => {
    console.log("I DID!!!");
    onComplete(id);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

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

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const amPm = hours >= 12 ? "pm" : "am";

    hours = hours % 12;
    hours = hours || 12; // To display "12" instead of "0" for noon and midnight

    return `${month} ${day}, ${hours}:${minutes}${amPm}`;
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

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Simulate a delay before expanding the div
    const timer = setTimeout(() => {
      setIsExpanded(true);
    }, 1); // delay of 1 second before expanding

    return () => clearTimeout(timer); // Clear timer on component unmount
  }, []);

  return (
    <div
      className={`ticket-container leading-tight static transition-height duration-300 ease-out ${
        isExpanded
          ? new_client || urgent
            ? "h-[142.5px]"
            : "h-[108.75px]"
          : "h-0"
      }`}
    >
      <span
        className="cursor-pointer"
        onClick={() => setIsOpen((prevState) => !prevState)}
      >
        <div className="flex flex-col px-3 py-3 gap-2">
          <div
            className={`${
              new_client == true || urgent == true ? "w-fit h-fit" : "hidden"
            } ${"flex flex-row gap-2"}`}
          >
            <div className={new_client !== true ? "hidden" : ""}>
              <TicketProp
                type={""}
                urgent={null}
                new_client={true}
                closeable={false}
                onClose={() => null}
              />
            </div>
            <div className={urgent !== true ? "hidden" : ""}>
              <TicketProp
                type={""}
                urgent={true}
                new_client={null}
                closeable={false}
                onClose={() => null}
              />
            </div>
          </div>
          <div className="flex flex-row gap-2 items-center divide-x divide-gray-500">
            <div className="text-xl font-medium whitespace-nowrap overflow-hidden truncate ">
              {name}
            </div>
            <div className="text-sm opacity-50 pl-2">
              {customPhoneNumberFormat(number)}
            </div>
          </div>
          <div className="flex flex-row gap-4 items-center w-full justify-between">
            <TicketProp
              type={type}
              urgent={null}
              new_client={null}
              closeable={false}
              onClose={() => null}
            />
            <div className="opacity-50 text-sm whitespace-nowrap overflow-hidden truncate">
              {customDateFormat(time)}
            </div>
          </div>
        </div>
        <div className="text-white bg-sec-blue justify-center py-1 text-sm font-semibold">
          <p className="text-center">CLICK TO SEE DETAILS</p>
        </div>
        <div
          className={`${
            isOpen
              ? "h-[100dvh] w-[100dvw] absolute left-0 top-0 bg-black bg-opacity-75"
              : ""
          }`}
        />
      </span>
      {isOpen ? (
        <div className="ticket-container flex-col gap-2 absolute-center static w-1/2 min-w-[600px] h-fit z-50">
          <div className="flex flex-col gap-2 px-3 pt-3 pb-14">
            <div
              className={`${
                new_client == true || urgent == true ? "w-fit h-fit" : "hidden"
              } ${"flex flex-row gap-2"}`}
            >
              <div className={new_client !== true ? "hidden" : ""}>
                <TicketProp
                  type={""}
                  new_client={true}
                  urgent={null}
                  closeable={false}
                  onClose={() => null}
                />
              </div>
              <div className={urgent !== true ? "hidden" : ""}>
                <TicketProp
                  type={""}
                  urgent={true}
                  new_client={null}
                  closeable={false}
                  onClose={() => null}
                />
              </div>
            </div>
            <div className="flex flex-row gap-2 items-center divide-x divide-gray-500">
              <div className="text-xl font-medium">{name}</div>
              <div className="text-sm opacity-50 pl-2">
                {customPhoneNumberFormat(number)}
              </div>
            </div>
            <div className="flex flex-row items-center w-full justify-between">
              <TicketProp
                type={type}
                urgent={null}
                new_client={null}
                closeable={false}
                onClose={() => null}
              />
            </div>
            <div className="ticket-container">
              <div className="flex flex-row justify-center text-white bg-sec-blue px-3 py-1 text-sm font-semibold w-full h-fit">
                <p className="text-center">SUMMARY</p>
              </div>
              <div className="w-full h-fit py-4 px-8">{summary}</div>
            </div>
            <div className="ticket-container text-sm transition-all duration-300 ease-in ">
              <div
                onClick={() => setTextOpen((prevState) => !prevState)}
                className="flex flex-row justify-center items-center gap-2 text-white bg-sec-blue px-3 py-1 text-sm font-semibold w-full h-fit"
              >
                <p className="text-center">TEXT CONVERSATION</p>
                <div
                  className={`${"translate-x-1/4 border-4 border-transparent"} ${
                    textOpen
                      ? "border-b-white -translate-y-1/4"
                      : "border-t-white translate-y-1/4"
                  }`}
                />
              </div>
              <div
                className={`w-full transition-all duration-300 ease-in px-8 flex flex-col overflow-scroll ${
                  !textOpen ? "h-0" : "h-80 py-4 "
                }`}
              >
                {Array.isArray(conversation) &&
                  conversation.map((message: any, index: number) => (
                    <div key={index} className={`message ${message.sender}`}>
                      {message.content}
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-between items-center text-white bg-sec-blue px-3 py-2 text-sm font-semibold absolute bottom-0 w-full h-fit">
            <em className="opacity-50 text-sm font-normal">
              Ticket ID: {id} - {customDateFormat(time)}
            </em>
            {stage == 3 ? null : (
              <div className="flex flex-row gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDidNot(id);
                  }}
                  className="btn-action2"
                >
                  DID NOT PICK UP
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleComplete(id);
                  }}
                  className="btn-action2"
                >
                  COMPLETED
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Ticket;
