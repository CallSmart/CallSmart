"use client";
import { useRouter } from "next/navigation";
// import { useRouter } from 'next/router';
import React from "react";

const choosePlan = () => {
    const router = useRouter();

  const option1 = () => {
    console.log("Option 1");
    router.push('/signup/makeAccount?option=1');
  }

  const option2 = () => {
    console.log("Option 2");
  }    

  const option3 = () => {
    console.log("Option 3");
  }

  const option4 = () => {
    console.log("Option 4");
  }

  return (
    <div>
      <h1>Choose Plan</h1>
      <div className="grid grid-cols-4 gap-4 ">
        <div className="col-span-1 flex flex-col items-center">
          <h2>Option 1</h2>
          <button onClick={() => option1()}>Select</button>
        </div>
        <div className="col-span-1 flex flex-col items-center">
          <h2>Option 2</h2>
          <button onClick={() => option2()}>Select</button>
        </div>
        <div className="col-span-1 flex flex-col items-center">
          <h2>Option 3</h2>
          <button onClick={() => option3()}>Select</button>
        </div>
        <div className="col-span-1 flex flex-col items-center">
          <h2>Option 4</h2>
          <button onClick={() => option4()}>Select</button>
        </div>
      </div>
    </div>
  );
};

export default choosePlan;