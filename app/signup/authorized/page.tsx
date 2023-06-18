"use client";
import { useRouter } from "next/navigation";
// import { useRouter } from 'next/router';
import React from "react";

const authorized = () => {
    const router = useRouter();

  const option = (option: string) => {
    router.push(`/signup/makeAccount?option=${option}`);
  };

  return (
    <div>
      <h1>Choose Plan</h1>
      <div className="grid grid-cols-4 gap-4 ">
        <div className="col-span-1 flex flex-col items-center">
          <h2>Option 1</h2>
          <button onClick={() => option('1')}>Select</button>
        </div>
        <div className="col-span-1 flex flex-col items-center">
          <h2>Option 2</h2>
          <button onClick={() => option('2')}>Select</button>
        </div>
        <div className="col-span-1 flex flex-col items-center">
          <h2>Option 3</h2>
          <button onClick={() => option('3')}>Select</button>
        </div>
        <div className="col-span-1 flex flex-col items-center">
          <h2>Option 4</h2>
          <button onClick={() => option('4')}>Select</button>
        </div>
      </div>
    </div>
  );
};

export default authorized;