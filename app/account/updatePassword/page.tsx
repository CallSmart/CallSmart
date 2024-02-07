"use client";
import React, { useState } from "react";
import ProductNavBar from "@/components/ProductNavBar";
import { supabase } from "../../../supabase"; // Uncomment if supabase is used
import { redirect } from "next/dist/server/api-utils";
import { Card } from "@tremor/react";

function Page() {
  const [pswd, setPswd] = useState("");

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPswd(event.target.value);
  };

  const handlePasswordSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    console.log(pswd); // For demonstration, replace with your function
    // Add your logic to handle password submission
    await supabase.auth.updateUser({ password: pswd });
    alert("You may now log in");
  };

  return (
    <ProductNavBar>
      <Card className="flex flex-col w-1/2 border-prim-blue" decoration="top">
        <p className="font-semibold">Update Password</p>
        <form className="flex flex-col gap-4" onSubmit={handlePasswordSubmit}>
          <input
            type="password"
            name="password"
            placeholder="Enter New Password"
            value={pswd}
            onChange={handlePasswordChange}
          />
          <button className="btn-submit" type="submit">
            Submit
          </button>
        </form>
      </Card>
    </ProductNavBar>
  );
}

export default Page;
