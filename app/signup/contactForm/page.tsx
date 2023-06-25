"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import HomeNavBar from "@/components/HomeNavBar";

const ContactPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [showConf, setShowConf] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Perform any additional form validation here (e.g., check if required fields are filled)

    // Send the form data to the API route
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, phone }),
      });

      // Reset form fields
      setName("");
      setEmail("");
      setPhone("");
      // Optionally display a success message to the user
      // console.log("router pushgin postContact");
      // router.push("/signup/confirmation");
      setShowConf(true);
    } catch (error) {
      console.error(error);
      // Optionally display an error message to the user
      alert("Failed to submit the form.");
    }
  };

  return (
    <HomeNavBar>
      <h1 className="w-2/3 text-center">Thanks for your interest!</h1>
      {!showConf ? (
        <form
          className="flex flex-col p-8 gap-6 w-1/3 bg-white border-2 border-[#CBCCD0] rounded-xl"
          onSubmit={handleSubmit}
        >
          <h3 className="text-center text-4xl font-semibold">
            Please enter your contact information.
          </h3>

          <span className="flex flex-col">
            <label>Name</label>
            <input
              type="text"
              value={name}
              placeholder="Marcelo Chaman Mallqui"
              onChange={(e) => setName(e.target.value)}
            />
          </span>
          <span className="flex flex-col">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              placeholder="callsmart@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </span>
          <span className="flex flex-col">
            <label>Phone:</label>
            <input
              type="tel"
              value={phone}
              placeholder="+1 (905) 599 3866"
              onChange={(e) => setPhone(e.target.value)}
            />
          </span>
          <div className="flex w-full gap-4 items-center">
            <button type="submit" className="btn-action">
              Submit
            </button>
            <em>
              <a href="/signin" className="hover:opacity-50">
                Already have an account?
              </a>
            </em>
          </div>
        </form>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <h4>We will be in touch in the coming days!</h4>
          <a className="btn-action" href={"/"}>
            Go Home
          </a>
        </div>
      )}
    </HomeNavBar>
  );
};

export default ContactPage;
