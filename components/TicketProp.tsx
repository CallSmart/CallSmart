import { useEffect } from "react";
import * as Icons from "./svgs";
type FunctionType = (option: string[]) => void;

type TicketType =
  | "question"
  | "book"
  | "cancel"
  | "reschedule"
  | "new"
  | "urgent"
  | string;

const TicketProp = ({
  type,
  urgent,
  new_client,
  closeable,
  onClose,
}: {
  type: TicketType | null;
  urgent: boolean | null;
  new_client: boolean | null;
  closeable: boolean;
  onClose: Function;
}) => {
  const toggleClose = (type: string | null) => {
    if (null) {
      return;
    }
    onClose(type);
  };

  function toCamelCase(input: string | null) {
    if (!input || !input.split) {
      return null;
    }
    const words = input
      ?.split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1));
    return words?.join(" ");
  }

  return (
    <div
      className={`leading-none ${
        type == "question"
          ? "ticket-prop text-[#611C9A] bg-[#EEDBFF]"
          : type == "book"
          ? "ticket-prop text-[#54976C] bg-[#DEECDC]"
          : type == "cancel"
          ? "ticket-prop text-[#E44D43] bg-[#FAE3DE]"
          : type == "reschedule"
          ? "ticket-prop text-[#CA7C32] bg-[#FAEDCC]"
          : new_client === true
          ? "ticket-prop text-[#53A5E9] bg-[#DDEFFC]"
          : urgent === true
          ? "ticket-prop text-[#E44D43] bg-[#FAE3DE]"
          : ""
      }`}
    >
      {type == "question" ? (
        <div className="flex flex-row gap-1 items-center justify-center whitespace-nowrap">
          <Icons.QuestionIcon />
          Question
        </div>
      ) : type == "book" ? (
        <div className="flex flex-row gap-1 items-center justify-center whitespace-nowrap">
          <Icons.AddIcon />
          Book
        </div>
      ) : type == "cancel" ? (
        <div className="flex flex-row gap-1 items-center justify-center whitespace-nowrap">
          <Icons.CancelIcon />
          Cancel
        </div>
      ) : type == "reschedule" ? (
        <div className="flex flex-row gap-1 items-center justify-center whitespace-nowrap">
          <Icons.CalendarIcon />
          Reschedule
        </div>
      ) : new_client === true ? (
        <div className="flex flex-row gap-1 items-center justify-center whitespace-nowrap">
          <Icons.PersonAddIcon />
          New Client
        </div>
      ) : urgent === true ? (
        <div className="flex flex-row gap-1 items-center justify-center whitespace-nowrap">
          <Icons.ErrorIcon />
          URGENT
        </div>
      ) : (
        <div>{toCamelCase(type)}</div>
      )}
      {closeable ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleClose(type);
          }}
        >
          &times;
        </button>
      ) : (
        ""
      )}
    </div>
  );
};

export default TicketProp;
