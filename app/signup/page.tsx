"use client";
import HomeNavBar from "@/components/HomeNavBar";
import { useRouter } from "next/navigation";
// import { useRouter } from 'next/router';
import React from "react";

const choosePlan = () => {
  const router = useRouter();

  const option = () => {
    router.push("/signup/contactForm");
  };

  return (
    <HomeNavBar>
      <h1 className="text-center">Choose Your Plan</h1>
      <div className="grid grid-cols-3 gap-2 w-3/4">
        <div className="container flex-col gap-2 items-center">
          <h4 className="text-prim-blue">Local Clinic</h4>
          <h4>
            <em>$39.99</em>
          </h4>
          <button className="btn-action" onClick={() => option()}>
            Select
          </button>
        </div>
        <div className="container flex-col gap-2 items-center">
          <h4 className="text-prim-blue">Multiple Clinic Company</h4>
          <h4>
            <em>$99.99</em>
          </h4>
          <button className="btn-action" onClick={() => option()}>
            Select
          </button>
        </div>
        <div className="container flex-col gap-2 items-center">
          <h4 className="text-prim-blue">Corporation</h4>
          <h4>
            <em>$299.99</em>
          </h4>
          <button className="btn-action" onClick={() => option()}>
            Select
          </button>
        </div>
      </div>
    </HomeNavBar>
  );
};

export default choosePlan;
