import * as Icons from "@/components/svgs";
import TicketProp from "./TicketProp";
import { useState } from "react";
type FunctionType = (id: number) => void;

const Ticket = ({
  id,
  onDidNot,
  onComplete,
  isNew,
  urgent,
  type,
  name,
  number,
  time,
  stage,
}: {
  id: number;
  onDidNot: FunctionType;
  onComplete: FunctionType;
  isNew: string;
  urgent: string;
  type: string;
  name: string;
  number: string;
  time: string;
  stage: number;
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

  return (
    <div
      tabIndex={0}
      onBlur={() => handleBlur()}
      className="ticket-container leading-tight static"
    >
      <span
        className="cursor-pointer"
        onClick={() => setIsOpen((prevState) => !prevState)}
      >
        <div className="flex flex-col px-3 py-3 gap-2">
          <div
            className={`${
              isNew == "new" || urgent == "urgent" ? "w-fit h-fit" : "hidden"
            } ${"flex flex-row gap-2"}`}
          >
            <div className={isNew !== "new" ? "hidden" : ""}>
              <TicketProp type={isNew} closeable={false} onClose={() => null} />
            </div>
            <div className={urgent !== "urgent" ? "hidden" : ""}>
              <TicketProp
                type={urgent}
                closeable={false}
                onClose={() => null}
              />
            </div>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <div className="text-xl font-medium">{name}</div>
            <div className="opacity-25">|</div>
            <div className="text-sm opacity-50">{number}</div>
          </div>
          <div className="flex flex-row items-center w-full justify-between">
            <TicketProp type={type} closeable={false} onClose={() => null} />
            <div className="opacity-50 text-sm">{customDateFormat(time)}</div>
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
        <div className="ticket-container flex-col gap-2 absolute-center static w-1/2 h-fit z-50">
          <div className="flex flex-col gap-2 px-3 pt-3 pb-14">
            <div
              className={`${
                isNew == "new" || urgent == "urgent" ? "w-fit h-fit" : "hidden"
              } ${"flex flex-row gap-2"}`}
            >
              <div className={isNew !== "new" ? "hidden" : ""}>
                <TicketProp
                  type={isNew}
                  closeable={false}
                  onClose={() => null}
                />
              </div>
              <div className={urgent !== "urgent" ? "hidden" : ""}>
                <TicketProp
                  type={urgent}
                  closeable={false}
                  onClose={() => null}
                />
              </div>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <div className="text-xl font-medium">{name}</div>
              <div className="opacity-25">|</div>
              <div className="text-sm opacity-50">{number}</div>
            </div>
            <div className="flex flex-row items-center w-full justify-between">
              <TicketProp type={type} closeable={false} onClose={() => null} />
            </div>
            <div className="ticket-container">
              <div className="flex flex-row justify-center text-white bg-sec-blue px-3 py-1 text-sm font-semibold w-full h-fit">
                <p className="text-center">SUMMARY</p>
              </div>
              <div className="w-full h-24"></div>
            </div>
            <div
              onClick={() => setTextOpen((prevState) => !prevState)}
              className="ticket-container"
            >
              <div className="flex flex-row justify-center items-center gap-2 text-white bg-sec-blue px-3 py-1 text-sm font-semibold w-full h-fit">
                <p className="text-center">TEXT CONVERSATION</p>
                <div
                  className={`${"translate-x-1/4 border-4 border-transparent"} ${
                    textOpen
                      ? "border-b-white -translate-y-1/4"
                      : "border-t-white translate-y-1/4"
                  }`}
                />
              </div>
              {textOpen ? <div className="w-full h-10" /> : ""}
            </div>
          </div>
          <div className="flex flex-row justify-between items-center text-white bg-sec-blue px-3 py-2 text-sm font-semibold absolute bottom-0 w-full h-fit">
            <em className="opacity-50 text-sm font-normal">
              Ticket ID: {id} - {customDateFormat(time)}
            </em>
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
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Ticket;
