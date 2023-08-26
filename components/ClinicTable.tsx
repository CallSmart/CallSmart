import React from "react";
import { useEffect, useState } from "react";

interface Clinic {
  id: number;
  name: string;
  gotoemail: string;
  gotopassword: string;
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
      <div className="w-full border-2 border-sec-blue rounded-lg bg-white overflow-scroll ">
        <div className="w-full table-auto border-sec-blue overflow-hidden divide-y divide-sec-blue">
          <div className="w-full bg-sec-blue indent-2 text-white py-1 font-semibold">
            CLINICS
          </div>
          <div className="divide-y overflow-scroll">
            {clinics.map((clinic, key) => (
              <div
                className="py-4 px-8 flex flex-row justify-between"
                key={key}
              >
                <div className="flex flex-row gap-6">
                  <p className="text-sec-blue"> {clinic.name}</p>
                  <p className="text-black/20 flex flex-row gap-2 divide-x">
                    <span>ID: {clinic.id}</span>
                    <span className="pl-2">{clinic.gotoemail}</span>
                    <span className="pl-2 text-white hover:text-black/20">
                      {clinic.gotopassword}
                    </span>
                  </p>
                </div>
                <div className="flex flex-row gap-2 divide-x">
                  <button
                    className="text-sec-blue hover:text-sec-blue/50"
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
                  <div className="w-fit pl-2">
                    <button
                      className="text-[#ff0000] hover:text-[#ff0000]/50"
                      onClick={() => deleteFunction(clinic.id)}
                    >
                      Delete
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
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-sec-blue w-full">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicTable;
