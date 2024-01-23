import { Card } from "@tremor/react";
import React from "react";
import { useEffect, useState } from "react";

interface Person {
  id: number;
  first_name: string;
  last_name: string;
  clinic_id: number;
  email: string;
}

interface Clinic {
  id: number;
  name: string;
  gotoemail: string;
}

type IDBasedFunction = (id: number) => Promise<void>;

type editFunction = (
  e: React.FormEvent,
  clinicId: number,
  name: string,
  email: string,
  password: string
) => Promise<void>;

type addFunction = (
  e: React.FormEvent,
  firstName: string,
  lastName: string,
  clinic: number | null,
  email: string,
  password: string
) => Promise<void>;

const ManagerEmployeeTable = ({
  label,
  people,
  clinics,
  deleteFunction,
  recoverFunction,
  addFunction,
}: {
  label: string;
  people: Person[];
  clinics: Clinic[];
  deleteFunction: IDBasedFunction;
  recoverFunction: (email: string) => Promise<void>;
  addFunction: addFunction;
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form Values
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("temp");
  const [formFirstName, setFormFirstName] = useState("");
  const [formLastName, setFormLastName] = useState("");
  const [formClinic, setFormClinic] = useState<number | null>(null);

  const [deleteOverlay, setDeleteOverlay] = useState(false);
  const [deleteKey, setDeleteKey] = useState<number | null>(null);

  useEffect(() => {
    resetForm();
  }, [isFormOpen, addFunction, deleteFunction]);

  useEffect(() => {
    setIsFormOpen(false);
  }, [addFunction, deleteFunction]);

  const resetForm = () => {
    setFormEmail("");
    setFormFirstName("");
    setFormLastName("");
    setFormClinic(null);
    setFormPassword("");
  };

  const toSingular = (label: string) => {
    // Split the string by spaces, convert to lowercase, and capitalize each word
    const words = label
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1));

    // Take the last word and convert to singular if it ends with 's'
    const lastIndex = words.length - 1;
    if (words[lastIndex].endsWith("s")) {
      words[lastIndex] = words[lastIndex].slice(0, -1);
    }

    return words.join(" ");
  };

  return (
    <div className="w-full border-[1px] border-sec-blue rounded-lg bg-sec-blue overflow-visible">
      <div className="w-full indent-2 text-white pt-1 font-semibold rounded-t-md">
        {label}
        <div
          style={{ height: `${55 * people.length + 8}px` }}
          className="divide-y overflow-visible bg-white rounded-md my-1 border-y-4 border-prim-blue font-normal transition-all"
        >
          {people.map((person, key) => (
            <div
              className="px-8 flex flex-row justify-between h-[55px] items-center"
              key={key}
            >
              <div className="flex flex-row gap-6">
                <p className="text-sec-blue">
                  {person.first_name} {person.last_name}
                </p>
                <p className="text-gray-300 flex flex-row gap-2 divide-x">
                  <span>Clinic ID: {person.clinic_id}</span>
                  <span className="pl-2">{person.email}</span>
                </p>
              </div>
              <div className="flex flex-row gap-2 divide-x">
                <button
                  className="text-sec-blue hover:text-sec-blue/50"
                  onClick={() => recoverFunction(person.email)}
                >
                  Recover
                </button>
                <div>
                  <button
                    className="static"
                    onClick={() => {
                      setDeleteOverlay((prevState) => !prevState);
                      setDeleteKey(key);
                    }}
                    tabIndex={0}
                    onBlur={() => setDeleteOverlay(false)}
                  >
                    <p className="text-red-500 hover:text-red-300">Delete</p>
                    {deleteOverlay && deleteKey == key ? (
                      <Card
                        decoration="left"
                        className="w-1/3 min-w-[400px] font-normal flex flex-col p-4 gap-2 z-50 absolute-center static text-sec-blue"
                      >
                        <p className="text-sec-blue w-full cursor-default">
                          Are you sure you want to delete?
                        </p>
                        <div className="flex flex-row self-end gap-2 w-fit">
                          <p
                            className="flex bg-gray-500 hover:bg-gray-300 text-white rounded-md px-4 py-2 w-fit text-center cursor-pointer"
                            onClick={() => setDeleteOverlay(false)}
                          >
                            Cancel
                          </p>
                          <p
                            className="flex bg-red-500 hover:bg-red-300 text-white rounded-md px-4 py-2 w-fit text-center cursor-pointer"
                            onClick={() => deleteFunction(person.id)}
                          >
                            Yes
                          </p>
                        </div>
                      </Card>
                    ) : null}
                    <div
                      className={`${
                        deleteOverlay && deleteKey == key
                          ? "h-[100dvh] w-[100dvw] absolute left-0 top-0 bg-black bg-opacity-75"
                          : ""
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full rounded-b-md pb-1 indent-4">
          <span
            className="flex text-white hover:text-gray-500 hover:cursor-pointer font-bold w-8 items-center justify-center"
            onClick={() => setIsFormOpen((prevState) => !prevState)}
          >
            <p>+</p>
            <div
              className={`${
                isFormOpen
                  ? "h-[100dvh] w-[100dvw] absolute left-0 top-0 bg-black bg-opacity-75"
                  : ""
              }`}
            />
          </span>
          {isFormOpen ? (
            <Card
              decoration="left"
              className="w-1/3 min-w-[400px] font-normal flex flex-col p-4 gap-2 z-50 absolute-center static text-sec-blue"
            >
              <form
                onSubmit={(e) => {
                  addFunction(
                    e,
                    formFirstName,
                    formLastName,
                    formClinic,
                    formEmail,
                    formPassword
                  );
                }}
                className="flex flex-col gap-2"
              >
                <div className="form-section">
                  <h4>Add a {toSingular(label)}</h4>
                  <button type="submit" className="btn-submit">
                    Add {toSingular(label)}
                  </button>
                </div>
                <hr className="my-2" />
                <div className="form-section">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={formFirstName}
                    placeholder="First Name"
                    onChange={(e) => setFormFirstName(e.target.value)}
                  />
                </div>
                <div className="form-section">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={formLastName}
                    placeholder="Last Name"
                    onChange={(e) => setFormLastName(e.target.value)}
                  />
                </div>
                <div className="form-section">
                  <label>Email</label>
                  <input
                    type="text"
                    value={formEmail}
                    placeholder="Email"
                    onChange={(e) => setFormEmail(e.target.value)}
                  />
                </div>
                <div className="form-section">
                  <label>Assign Clinic</label>
                  <select
                    value={formClinic !== null ? String(formClinic) : ""}
                    onChange={(e) => setFormClinic(Number(e.target.value))}
                  >
                    <option value="" disabled>
                      Select Clinic
                    </option>
                    {clinics.map((clinic) => (
                      <option key={clinic.id} value={clinic.id}>
                        {clinic.name}
                      </option>
                    ))}
                  </select>
                  <div className="translate-x-1/4 border-4 border-transparent border-t-sec-blue translate-y-1/4 absolute right-8" />
                </div>
              </form>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ManagerEmployeeTable;
