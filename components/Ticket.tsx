import * as Icons from "@/components/svgs";
import TicketProp from "./TicketProp";

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
            <TicketProp type={urgent} closeable={false} onClose={() => null} />
          </div>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <div className="text-xl font-medium">{name}</div>
          <div className="opacity-25">|</div>
          <div className="text-sm opacity-50">{number}</div>
        </div>
        <div className="flex flex-row items-center w-full justify-between">
          <TicketProp type={type} closeable={false} onClose={() => null} />
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
