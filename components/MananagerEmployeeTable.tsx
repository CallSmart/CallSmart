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
      <table className="w-full table-auto border-sec-blue overflow-hidden ">
        <thead className="bg-sec-blue text-white text-sm font-semibold overflow-scroll">
          <tr>
            <th colSpan={6} className="py-1 px-2 text-left">
              {label}
            </th>
          </tr>
          <tr className="font-medium indent-2 text-left">
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Clinic ID</th>
            <th colSpan={2}></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sec-blue overflow-scroll">
          {people.map((person) => (
            <tr className="divide-x divide-sec-blue indent-2" key={person.id}>
              <td className="w-1/4 max-w-[100px] overflow-scroll">
                {person.firstName}
              </td>
              <td className="w-1/4 max-w-[100px] overflow-scroll">
                {person.lastName}
              </td>
              <td className="w-1/4 max-w-[100px] overflow-scroll">
                {person.email}
              </td>
              <td className="w-1/4 max-w-[100px] overflow-scroll">
                {person.clinicId}
              </td>
              <td className="w-fit bg-sec-blue">
                <button
                  className="text-white font-bold items-center"
                  onClick={() => recoverFunction(person.email)}
                >
                  Recover
                </button>
              </td>
              <td className="w-fit pl-2 pr-4 bg-sec-blue">
                <button
                  className="text-white hover:text-[#ff0000] font-bold items-center justify-center"
                  onClick={() => deleteFunction(person.id)}
                >
                  -
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-sec-blue w-full">
          <tr>
            <td colSpan={6}>
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
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ManagerEmployeeTable;
