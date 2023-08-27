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
  const [deleteOverlay, setDeleteOverlay] = useState(false);
  const [deleteKey, setDeleteKey] = useState<number | null>(null);

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
    <div className="w-full border-[1px] border-sec-blue rounded-lg bg-sec-blue overflow-visible">
      <div className="w-full indent-2 text-white pt-1 font-semibold rounded-t-md">
        CLINICS
        <div
          style={{ height: `${55 * clinics.length + 8}px` }}
          className={`${"divide-y overflow-visible bg-white rounded-md my-1 border-y-4 border-prim-blue font-normal transition-height duration-300 ease-out"}`}
        >
          {clinics.map((clinic, key) => (
            <div
              className="px-8 flex flex-row justify-between items-center h-[55px]"
              key={key}
            >
              <div className="flex flex-row gap-6">
                <p className="text-sec-blue"> {clinic.name}</p>
                <p className="text-gray-300 flex flex-row gap-2 divide-x">
                  <span>ID: {clinic.id}</span>
                  <span className="pl-2">{clinic.gotoemail}</span>
                </p>
              </div>
              <div className="flex flex-row gap-2 divide-x ">
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
                <div className="w-fit">
                  <button
                    className="relative z-0"
                    onClick={() => {
                      setDeleteOverlay((prevState) => !prevState);
                      setDeleteKey(key);
                    }}
                    tabIndex={0}
                    onBlur={() => setDeleteOverlay(false)}
                  >
                    <p className="text-red-500 hover:text-red-300">Delete</p>
                    {deleteOverlay && deleteKey == key ? (
                      <div className="absolute -top-16 right-0 border border-y-4 drop-shadow-md border-sec-blue rounded-lg px-4 py-2 bg-white">
                        <p className="text-sec-blue w-36 cursor-default">
                          Are you sure you want to delete?
                        </p>
                        <p
                          className="text-red-500 hover:text-red-300"
                          onClick={() => deleteFunction(clinic.id)}
                        >
                          Yes
                        </p>
                      </div>
                    ) : null}
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
                        "ticket-container w-1/4 flex-col p-4 z-50 absolute-center text-left static gap-4 text-sec-blue indent-0"
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
        <div className="w-full rounded-b-md pb-1 indent-4">
          <span
            className="flex text-white hover:text-gray-500 hover:cursor-pointer w-fit pr-4 font-bold items-center"
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
              className="ticket-container w-1/4 flex-col p-4 z-50 absolute-center static gap-4"
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
  );
};

export default ClinicTable;
