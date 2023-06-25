"use client";
import HomeNavBar from "@/components/HomeNavBar";
import { useRouter } from "next/navigation";
// import { useRouter } from 'next/router';
import React from "react";

const authorized = () => {
  const router = useRouter();

  const option = (option: string) => {
    router.push(`/signup/makeAccount?option=${option}`);
  };

  return (
    <HomeNavBar>
      <h1 className="text-center">Welcome to the Family.</h1>
      <div className="grid grid-cols-3 gap-2 w-3/4">
        <div className="container flex-col gap-2 items-center">
          <h4 className="text-prim-blue">Local Clinic</h4>
          <h4>
            <em>$39.99</em>
          </h4>
          <button className="btn-action" onClick={() => option("1")}>
            Select
          </button>
        </div>
        <div className="container flex-col gap-2 items-center">
          <h4 className="text-prim-blue">Multiple Clinic Company</h4>
          <h4>
            <em>$99.99</em>
          </h4>
          <button className="btn-action" onClick={() => option("2")}>
            Select
          </button>
        </div>
        <div className="container flex-col gap-2 items-center">
          <h4 className="text-prim-blue">Corporation</h4>
          <h4>
            <em>$299.99</em>
          </h4>
          <button className="btn-action" onClick={() => option("3")}>
            Select
          </button>
        </div>
      </div>
    </HomeNavBar>
  );
};

export default authorized;
