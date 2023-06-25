import React, { useEffect, useState } from "react";
import TicketProp from "./TicketProp";
import * as Icons from "./svgs";

type FunctionType = (options: string[]) => void;

function Select({
  onChange,
  options,
}: {
  onChange: FunctionType;
  options: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string>(options[0]);

  const toggleOption = (option: string) => {
    setSelectedOption(option);
  };

  useEffect(() => {
    onChange([selectedOption]);
  }, [selectedOption]);

  return (
    <div
      tabIndex={0}
      onBlur={() => setIsOpen(false)}
      className="flex flex-row items-center relative"
    >
      <div className="flex flex-row flex-wrap gap-2 w-fit justify-end">
        {selectedOption}
      </div>
      <div
        className="translate-x-1/4 w-[1px] font-semibold text-sec-blue px-2 z-50"
        onClick={() => setIsOpen((prevState) => !prevState)}
      >
        <div
          className={`${"translate-x-1/4 border-4 border-transparent"} ${
            isOpen
              ? "border-b-sec-blue -translate-y-1/4"
              : "border-t-sec-blue translate-y-1/4"
          }`}
        />
        <ul
          className={`${"flex flex-col bg-white w-max px-2 py-1 border-[1px] border-[#CBCCD0] rounded-lg flex-col rounded-md absolute top-5 right-0 divide-y divide-grey-light"} ${
            isOpen ? "flex" : "hidden"
          }`}
        >
          {options?.map((option, index) => (
            <li
              onClick={(e) => {
                e.stopPropagation();
                toggleOption(option);
                setIsOpen(false);
              }}
              onMouseEnter={() => setHighlightedIndex(index)}
              key={index}
              className="py-1"
            >
              {option}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// add <button className={styles["clear-btn"]}>&times;</button> to option when rendered in the filter values

export default Select;
