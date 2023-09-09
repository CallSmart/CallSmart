"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import { Auth } from '@supabase/ui';
import { supabase } from "../../../supabase";
import { redirect } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Session } from "@supabase/auth-helpers-nextjs";
import HomeNavBar from "@/components/HomeNavBar";
import { Card } from "@tremor/react";

const SignupPage = () => {
  const router = useRouter();
  // const params = useParams();
  const searchParams = useSearchParams();
  const [session, setSession] = useState<Session>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [numClinics, setNumClinics] = useState(1);
  const [referral, setReferral] = useState("");
  const [referralName, setReferralName] = useState<string>("");

  const option = searchParams.get("option");
  console.log(option);

  const handleSignup = async () => {
    console.log(email, password);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.log("Signup error:", error.message);
    } else {
      console.log(data);
      const { error } = await supabase.from("users").insert([
        {
          id: data?.user?.id,
          email,
          first_name: firstName,
          last_name: lastName,
          num_clinics: numClinics,
          referral: referral,
          referral_name: referralName,
        },
      ]);
      if (!error) {
        if (data.session != null) {
          setSession(data.session);
          localStorage.setItem("token", data.session.access_token as string);
        }

        router.push(`/signup/tier${option}`);
      } else {
        console.log(error);
      }
    }
  };

  return (
    <HomeNavBar>
      <h1>You're almost there</h1>
      <Card
        decoration="top"
        className="w-1/2 min-w-[400px] z-50 static text-sec-blue"
      >
        <form
          className="flex flex-col gap-2 indent-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSignup();
          }}
        >
          <h3 className="text-center text-4xl font-semibold">
            Create your Account
          </h3>
          <hr className="my-2" />
          <div className="form-section">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="callsmart@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-section">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="123SuperSecure!"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-section">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="form-section">
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              type="text"
              placeholder="Smith"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="form-section">
            <label>Number of Clinics?</label>
            <input
              type="number"
              min="1"
              value={numClinics}
              onChange={(e) => setNumClinics(Number(e.target.value))}
            />
            required
          </div>
          <div className="form-section">
            <label>How did you hear about us?</label>
            <select
              value={referral}
              onChange={(e) => setReferral(e.target.value)}
            >
              <option>Recommended</option>
              <option>On my own</option>
              <option>Sales Member</option>
            </select>
            <div className="appearance-1 translate-x-1/4 border-4 border-transparent border-t-sec-blue translate-y-1/4 absolute right-8" />
          </div>
          {referral == "Sales Member" ? (
            <div className="form-section">
              <label>Sales Member Name</label>
              <input
                type="text"
                value={referralName}
                placeholder="Sales Member Name"
                onChange={(e) => setReferralName(e.target.value)}
              />
            </div>
          ) : (
            ""
          )}
          <hr className="my-2" />
          <button type="submit" className="btn-submit self-center">
            Sign up!
          </button>
        </form>
      </Card>
    </HomeNavBar>
  );
};

export default SignupPage;
