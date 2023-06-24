import React, { useEffect, useState } from "react";
import TicketProp from "./TicketProp";
import * as Icons from "./svgs";

type FunctionType = (option: string[]) => void;

function Multiselect({
  onChange,
  options,
}: {
  onChange: FunctionType;
  options: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const toggleOption = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(
        selectedOptions.filter((selectedOption) => selectedOption !== option)
      );
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  useEffect(() => {
    if (isOpen) setHighlightedIndex(0);
  }, [isOpen]);

  useEffect(() => {
    onChange(selectedOptions);
  }, [selectedOptions]);

  return (
    <div
      tabIndex={0}
      onBlur={() => setIsOpen(false)}
      className="flex flex-row items-center relative"
    >
      {selectedOptions.length > 0 ? (
        <div className="flex flex-row flex-wrap gap-2 w-fit justify-end">
          {selectedOptions.map((option) => (
            <span onClick={() => setIsOpen((prevState) => !prevState)}>
              <TicketProp
                type={option}
                closeable={true}
                onClose={toggleOption}
              />
            </span>
          ))}
        </div>
      ) : (
        <em className="opacity-50">No Filter</em>
      )}
      <div
        className="translate-x-1/4 w-[1px] font-semibold text-sec-blue px-2 z-40"
        onClick={() => {
          if (selectedOptions.length === options.length) {
            setSelectedOptions([]);
          } else {
            setIsOpen((prevState) => !prevState);
          }
        }}
      >
        {selectedOptions.length === options.length ? <span>&times;</span> : "+"}
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
              className={`${"py-1"} ${
                selectedOptions.includes(option) ? "hidden" : ""
              }`}
            >
              <TicketProp
                type={option}
                closeable={false}
                onClose={() => null}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// add <button className={styles["clear-btn"]}>&times;</button> to option when rendered in the filter values

export default Multiselect;
