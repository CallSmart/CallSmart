import * as Icons from "@/components/svgs";

const TicketProp = ({ type }: { type: any }) => {
  return (
    <div>
      {type == "question" ? (
        <div className="ticket-prop text-[#611C9A] bg-[#EEDBFF]">
          <Icons.QuestionIcon />
          Question for Staff
        </div>
      ) : type == "book" ? (
        <div className="ticket-prop text-[#54976C] bg-[#DEECDC]">
          <Icons.AddIcon />
          Book Appointment
        </div>
      ) : type == "cancel" ? (
        <div className="ticket-prop text-[#E44D43] bg-[#FAE3DE]">
          <Icons.CancelIcon />
          Cancel Appointment
        </div>
      ) : type == "reschedule" ? (
        <div className="ticket-prop text-[#CA7C32] bg-[#FAEDCC]">
          <Icons.CalendarIcon />
          Reschedule Appointment
        </div>
      ) : type == "new" ? (
        <div className="ticket-prop text-[#53A5E9] bg-[#DDEFFC]">
          <Icons.PersonAddIcon />
          New Client
        </div>
      ) : type == "urgent" ? (
        <div className="ticket-prop text-[#E44D43] bg-[#FAE3DE]">
          <Icons.ErrorIcon />
          URGENT
        </div>
      ) : (
        "hidden"
      )}
    </div>
  );
};

const Ticket = ({
  isNew,
  urgent,
  type,
  name,
  number,
  time,
}: {
  isNew: string;
  urgent: string;
  type: string;
  name: string;
  number: string;
  time: string;
}) => {
  return (
    <div className="ticket-container leading-tight ">
      <div className="flex flex-col px-4 py-3 gap-2">
        <div
          className={`${
            isNew == "new" || urgent == "urgent" ? "w-fit h-fit" : "hidden"
          } ${"flex flex-row gap-2"}`}
        >
          <div className={isNew !== "new" ? "hidden" : ""}>
            <TicketProp type={isNew} />
          </div>
          <div className={urgent !== "urgent" ? "hidden" : ""}>
            <TicketProp type={urgent} />
          </div>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <div className="text-2xl font-medium">{name}</div>
          <div className="opacity-25">|</div>
          <div className="text-sm opacity-50">{number}</div>
        </div>
        <div className="flex flex-row items-center w-full justify-between">
          <TicketProp type={type} />
          <div className="opacity-50 text-sm">{time}</div>
        </div>
      </div>
      <div className="text-white bg-sec-blue justify-center py-1 text-sm font-semibold">
        <p className="text-center">CLICK TO SEE DETAILS</p>
      </div>
    </div>
  );
};

export default Ticket;
