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
  closeable,
  onClose,
}: {
  type: TicketType;
  closeable: boolean;
  onClose: Function;
}) => {
  const toggleClose = (type: string) => {
    onClose(type);
  };
  return (
    <div
      className={
        type == "question"
          ? "ticket-prop text-[#611C9A] bg-[#EEDBFF]"
          : type == "book"
          ? "ticket-prop text-[#54976C] bg-[#DEECDC]"
          : type == "cancel"
          ? "ticket-prop text-[#E44D43] bg-[#FAE3DE]"
          : type == "reschedule"
          ? "ticket-prop text-[#CA7C32] bg-[#FAEDCC]"
          : type == "new"
          ? "ticket-prop text-[#53A5E9] bg-[#DDEFFC]"
          : type == "urgent"
          ? "ticket-prop text-[#E44D43] bg-[#FAE3DE]"
          : ""
      }
    >
      {type == "question" ? (
        <div className="flex flex-row gap-1 items-center whitespace-nowrap">
          <Icons.QuestionIcon />
          Question
        </div>
      ) : type == "book" ? (
        <div className="flex flex-row gap-1 items-center whitespace-nowrap">
          <Icons.AddIcon />
          Book
        </div>
      ) : type == "cancel" ? (
        <div className="flex flex-row gap-1 items-center whitespace-nowrap">
          <Icons.CancelIcon />
          Cancel
        </div>
      ) : type == "reschedule" ? (
        <div className="flex flex-row gap-1 items-center whitespace-nowrap">
          <Icons.CalendarIcon />
          Reschedule
        </div>
      ) : type == "new" ? (
        <div className="flex flex-row gap-1 items-center whitespace-nowrap">
          <Icons.PersonAddIcon />
          New Client
        </div>
      ) : type == "urgent" ? (
        <div className="flex flex-row gap-1 items-center whitespace-nowrap">
          <Icons.ErrorIcon />
          URGENT
        </div>
      ) : (
        ""
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
