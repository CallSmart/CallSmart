import { Card } from "@tremor/react";
import { set } from "date-fns";
import React, { use } from "react";
import { useEffect, useState } from "react";

interface Clinic {
  id: number;
  name: string;
  gotoemail: string;
  gotopassword: string;
  initial_message: string;
  notification_email: string,
  send_notifications: Boolean
}

type IDBasedFunction = (id: number) => Promise<void>;

type editFunction = (
  e: React.FormEvent,
  clinicId: number,
  name: string,
  email: string,
  password: string,
  initial_message: string,
  notification_email: string,
  send_notifications: Boolean
) => Promise<void>;

type addFunction = (
  e: React.FormEvent,
  clinicName: string,
  email: string,
  password: string,
  initial_message: string,
  notification_email: string,
  send_notifications: Boolean
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
  const [goToOpenKey, setGoToOpenKey] = useState(0);
  const [isClinicOpen, setIsClinicOpen] = useState(false);
  const [editedClinicId, setEditedClinicId] = useState<number | null>(null);
  const [deleteOverlay, setDeleteOverlay] = useState(false);
  const [deleteKey, setDeleteKey] = useState<number | null>(null);

  // Form Values
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formName, setFormName] = useState("");
  const [formNotificationEmail, setFormNotificationEmail] = useState("")
  const [formNotificationOn, setFormNotificationOn] = useState(false)

  const populateFormInformation = async (clinic: Clinic) => {
    console.log("calling populate form information:", clinic);
    setFormEmail(clinic.gotoemail);
    setFormPassword(clinic.gotopassword);
    setFormMessage(clinic.initial_message);
    setFormNotificationEmail(clinic.notification_email)
    if(clinic.send_notifications){
      setFormNotificationOn(true)
    }else{
      setFormNotificationOn(false)
    }
  };

  useEffect(() => {
    setIsClinicOpen(false);
    setIsGoToOpen(false);
    resetForm();
  }, [addFunction, editFunction, deleteFunction]);

  const resetForm = () => {
    setFormEmail("");
    setFormName("");
    setFormPassword("");
    setFormMessage("");
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
                    populateFormInformation(clinic);
                    setIsGoToOpen((prevState) => !prevState);
                    setGoToOpenKey(key);
                    setEditedClinicId(clinic.id);
                  }}
                >
                  Edit Info
                  {goToOpenKey == key ? (
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
                    className=""
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
                            onClick={() => deleteFunction(clinic.id)}
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
                  {isGoToOpen && clinic.id === editedClinicId ? (
                    <Card
                      decoration="left"
                      className="w-1/2 min-w-[400px] flex flex-col p-4 gap-2 z-50 absolute-center static text-sec-blue"
                    >
                      <form
                        onSubmit={(e) => {
                          editFunction(
                            e,
                            editedClinicId,
                            clinic.name,
                            formEmail,
                            formPassword,
                            formMessage,
                            formNotificationEmail,
                            formNotificationOn
                          );
                        }}
                        className="flex flex-col gap-2"
                      >
                        <div className="form-section">
                          <h4>Edit Clinic Info</h4>
                          <button type="submit" className="btn-submit">
                            Save
                          </button>
                        </div>
                        <hr className="my-2" />
                        <div className="form-section">
                          <label>GoTo Email</label>
                          <input
                            type="text"
                            value={formEmail}
                            placeholder="Email"
                            onChange={(e) => setFormEmail(e.target.value)}
                          />
                        </div>
                        <div className="form-section">
                          <label>GoTo Password</label>
                          <input
                            type="password"
                            value={formPassword}
                            placeholder="Password (Case sensitive)"
                            onChange={(e) => setFormPassword(e.target.value)}
                          />
                        </div>
                        <div className="form-section">
                          <label>Initial Message</label>
                          <textarea
                            value={formMessage}
                            placeholder="First message to send client..."
                            onChange={(e) => setFormMessage(e.target.value)}
                            className="h-32 resize-none overflow-auto whitespace-normal"
                          />
                        </div>
                        <div className="form-section">
                          <label>Notification Email</label>
                          <div
                            style={{
                              width: '50px',
                              height: '30px',
                              backgroundColor: formNotificationOn ? 'green' : 'red',
                              cursor: 'pointer',
                              borderRadius: '15px',
                              textAlign: 'center',
                              lineHeight: '30px',
                              color: 'white',
                              marginLeft: 'auto',
                              padding: 'auto',
                             
                            }}
                            onClick={() => setFormNotificationOn(!formNotificationOn)}
                          >
                            <div className="pr-2">
                            {formNotificationOn ? 'ON' : 'OFF'}
                            </div>
                          </div>
                          <input
                            value={formNotificationEmail}
                            placeholder="Email for ticket notifications"
                            onChange={(e) => setFormNotificationEmail(e.target.value)}
                            // className="h-32 resize-none overflow-auto whitespace-normal"
                          />
                        </div>

                      </form>
                    </Card>
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
            onClick={() => {
              resetForm();
              setIsClinicOpen((prevState) => !prevState);
            }}
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
            <Card
              decoration="left"
              className="w-1/2 min-w-[400px] font-normal flex flex-col p-4 gap-2 z-50 absolute-center static text-sec-blue"
            >
              <form
                onSubmit={(e) => {
                  addFunction(
                    e,
                    formName,
                    formEmail,
                    formPassword,
                    formMessage,
                    formNotificationEmail,
                    formNotificationOn
                  );
                  resetForm();
                }}
                className="flex flex-col gap-2"
              >
                <div className="form-section">
                  <h4>Add a Clinic</h4>
                  <button type="submit" className="btn-submit">
                    Add
                  </button>
                </div>
                <hr className="my-2" />
                <div className="form-section">
                  <label>Clinic Name</label>
                  <input
                    type="text"
                    value={formName}
                    placeholder="Clinic Name"
                    onChange={(e) => setFormName(e.target.value)}
                  ></input>
                </div>
                <div className="form-section">
                  <label>VoIP Provider</label>
                  <select
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                  >
                    <option selected>GoTo</option>
                  </select>
                  <div className="translate-x-1/4 border-4 border-transparent border-t-sec-blue translate-y-1/4 absolute right-8" />
                </div>
                <div className="form-section">
                  <label>VoIP Email</label>
                  <input
                    type="text"
                    value={formEmail}
                    placeholder="Email"
                    onChange={(e) => setFormEmail(e.target.value)}
                  />
                </div>
                <div className="form-section">
                  <label>VoIP Password</label>
                  <input
                    type="password"
                    value={formPassword}
                    placeholder="Password (Case sensitive)"
                    onChange={(e) => setFormPassword(e.target.value)}
                  />
                </div>
                <div className="form-section">
                  <label>Initial Message</label>
                  <textarea
                    value={formMessage}
                    placeholder="First message to send client..."
                    onChange={(e) => setFormMessage(e.target.value)}
                    className="h-32 resize-none overflow-auto whitespace-normal"
                  />
                </div>
              </form>
            </Card>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default ClinicTable;
