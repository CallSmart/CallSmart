import React from "react";
import { useEffect, useState } from "react";

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
  clinicName: string,
  email: string,
  password: string
) => Promise<void>;

const ClinicTable = ({
  clinics,
  deleteFunction,
  editFunction,
  addFunction,
}: {
  clinics: Clinic[];
  deleteFunction: IDBasedFunction;
  editFunction: editFunction;
  addFunction: addFunction;
}) => {
  const [isGoToOpen, setIsGoToOpen] = useState(false);
  const [isClinicOpen, setIsClinicOpen] = useState(false);
  const [editedClinicId, setEditedClinicId] = useState<number | null>(null);

  // Form Values
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formName, setFormName] = useState("");

  useEffect(() => {
    resetForm();
  }, [isGoToOpen, isClinicOpen, addFunction, editFunction, deleteFunction]);

  useEffect(() => {
    setIsClinicOpen(false);
    setIsGoToOpen(false);
  }, [addFunction, editFunction, deleteFunction]);

  const resetForm = () => {
    setFormEmail("");
    setFormName("");
    setFormPassword("");
  };

  return (
    <div>
      <div className="w-full border-2 border-sec-blue rounded-lg bg-white overflow-scroll">
        <table className="w-full table-auto border-sec-blue overflow-hidden">
          <thead className="bg-sec-blue text-white text-sm font-semibold overflow-scroll">
            <tr>
              <th colSpan={5} className="py-1 px-2 text-left">
                CLINICS
              </th>
            </tr>
            <tr className="font-medium indent-2 text-left">
              <th>ID</th>
              <th>Clinic Name</th>
              <th>GoTo Email</th>
              <th colSpan={2}></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sec-blue overflow-scroll">
            {clinics.map((clinic, key) => (
              <tr className="divide-x divide-sec-blue indent-2" key={key}>
                <td className="max-w-[100px] overflow-scroll bg-sec-blue text-white font-semibold px-2 indent-0">
                  {clinic.id}
                </td>
                <td className="w-1/2 max-w-[100px] overflow-scroll">
                  {clinic.name}
                </td>
                <td className="w-1/2 max-w-[100px] overflow-scroll">
                  {clinic.gotoemail}
                </td>
                <td className="w-fit bg-sec-blue">
                  <button
                    className="bg-sec-blue text-white font-bold w-24 items-center justify-center"
                    onClick={() => {
                      setIsGoToOpen((prevState) => !prevState);
                      setEditedClinicId(clinic.id);
                    }}
                  >
                    Edit Info
                    {key == 1 ? (
                      <div
                        className={`${
                          isGoToOpen
                            ? "h-[100dvh] w-[100dvw] absolute left-0 top-0 bg-black bg-opacity-75"
                            : ""
                        }`}
                      />
                    ) : (
                      ""
                    )}
                  </button>
                </td>
                <td className="w-fit pl-2 pr-4 bg-sec-blue">
                  <button
                    className="bg-sec-blue text-white hover:text-[#ff0000] font-bold w-8 items-center justify-center"
                    onClick={() => deleteFunction(clinic.id)}
                  >
                    -
                  </button>
                  {isGoToOpen && clinic.id === editedClinicId ? (
                    <form
                      onSubmit={(e) =>
                        editFunction(
                          e,
                          editedClinicId,
                          clinic.name,
                          formEmail,
                          formPassword
                        )
                      }
                      className={
                        "ticket-container w-1/4 flex-col p-4 z-40 absolute-center text-left static gap-4"
                      }
                    >
                      <h4>Edit GoTo Info</h4>
                      <span>
                        <label>GoTo Email</label>
                        <input
                          type="text"
                          value={formEmail}
                          placeholder="Email"
                          onChange={(e) => setFormEmail(e.target.value)}
                        />
                      </span>
                      <span>
                        <label>GoTo Password</label>
                        <input
                          type="password"
                          value={formPassword}
                          placeholder="Password (Case sensitive)"
                          onChange={(e) => setFormPassword(e.target.value)}
                        />
                      </span>
                      <button type="submit" className="btn-action">
                        Save GoTo Info
                      </button>
                    </form>
                  ) : (
                    ""
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-sec-blue w-full">
            <tr>
              <td colSpan={5}>
                <span
                  className="flex text-white hover:text-gray-500 hover:cursor-pointer font-bold w-8 items-center justify-center"
                  onClick={() => setIsClinicOpen((prevState) => !prevState)}
                >
                  <p>+</p>
                  <div
                    className={`${
                      isClinicOpen
                        ? "h-[100dvh] w-[100dvw] absolute left-0 top-0 bg-black bg-opacity-75"
                        : ""
                    }`}
                  />
                </span>
                {isClinicOpen ? (
                  <form
                    className="ticket-container w-1/4 flex-col p-4 z-40 absolute-center static gap-4"
                    onSubmit={(e) => {
                      addFunction(e, formName, formEmail, formPassword);
                      resetForm();
                    }}
                  >
                    <h4>Add a Clinic</h4>
                    <span>
                      <label>Clinic Name</label>
                      <input
                        type="text"
                        value={formName}
                        placeholder="Clinic Name"
                        onChange={(e) => setFormName(e.target.value)}
                      ></input>
                    </span>
                    <span>
                      <label>GoTo Email</label>
                      <input
                        type="text"
                        value={formEmail}
                        placeholder="Email"
                        onChange={(e) => setFormEmail(e.target.value)}
                      />
                    </span>
                    <span>
                      <label>GoTo Password</label>
                      <input
                        type="password"
                        value={formPassword}
                        placeholder="Password (Case sensitive)"
                        onChange={(e) => setFormPassword(e.target.value)}
                      />
                    </span>
                    <button className="btn-action" type="submit">
                      Add Clinic
                    </button>
                  </form>
                ) : (
                  ""
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ClinicTable;
