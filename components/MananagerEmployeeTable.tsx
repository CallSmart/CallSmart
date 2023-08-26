import React from "react";
import { useEffect, useState } from "react";

interface Person {
  id: number;
  firstName: string;
  lastName: string;
  clinicId: number;
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
  const [formPassword, setFormPassword] = useState("");
  const [formFirstName, setFormFirstName] = useState("");
  const [formLastName, setFormLastName] = useState("");
  const [formClinic, setFormClinic] = useState<number | null>(null);

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

  return (
    <div className="w-full border-2 border-sec-blue rounded-lg bg-white overflow-scroll">
      <div className="w-full table-auto border-sec-blue overflow-hidden divide-y divide-sec-blue">
        <div className="w-full bg-sec-blue indent-2 text-white font-semibold py-1">
          {label}
        </div>
        <div className="divide-y overflow-scroll">
          {people.map((person, key) => (
            <div className="py-4 px-8 flex flex-row justify-between" key={key}>
              <div className="flex flex-row gap-6">
                <p className="text-sec-blue">
                  {" "}
                  {person.firstName} {person.lastName}
                </p>
                <p className="text-black/20 flex flex-row gap-2 divide-x">
                  <span>Clinic ID: {person.clinicId}</span>
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
                <button
                  className="text-[#ff0000] hover:text-[#ff0000]/50 pl-2"
                  onClick={() => deleteFunction(person.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-sec-blue w-full">
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
              className={
                "ticket-container w-1/4 flex-col p-4 z-40 absolute-center static gap-4"
              }
            >
              <h4>Add an Office Manager</h4>
              <span>
                <label>First Name</label>
                <input
                  type="text"
                  value={formFirstName}
                  placeholder="Clinic Name"
                  onChange={(e) => setFormFirstName(e.target.value)}
                />
              </span>
              <span>
                <label>Last Name</label>
                <input
                  type="text"
                  value={formLastName}
                  placeholder="Last Name"
                  onChange={(e) => setFormLastName(e.target.value)}
                />
              </span>
              <span>
                <label>Email</label>
                <input
                  type="text"
                  value={formEmail}
                  placeholder="Email"
                  onChange={(e) => setFormEmail(e.target.value)}
                />
              </span>
              <span>
                <label>Password</label>
                <input
                  type="password"
                  value={formPassword}
                  placeholder="password"
                  onChange={(e) => setFormPassword(e.target.value)}
                />
              </span>
              <span>
                <label>Assign Clinic</label>
                <select
                  value={formClinic !== null ? String(formClinic) : ""}
                  onChange={(e) => setFormClinic(Number(e.target.value))}
                  className="border-b-2 border-[#CBCCD0] w-full"
                >
                  <option value="">Clinic Name</option>
                  {clinics.map((clinic) => (
                    <option key={clinic.id} value={clinic.id}>
                      {clinic.name}
                    </option>
                  ))}
                </select>
              </span>
              <button className="btn-action" type="submit">
                Add Manager
              </button>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ManagerEmployeeTable;
