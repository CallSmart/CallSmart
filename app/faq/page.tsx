"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabase";
import ProductNavBar from "@/components/ProductNavBar";
import * as Icons from "@/components/svgs";
import FAQComponent from "@/components/FAQComponent";
import { Card } from "@tremor/react";

export default function AnalyticsPage() {
  const router = useRouter();

  useEffect(() => {
    const session = supabase.auth.getSession();
    if (!session) {
      router.push("/signin"); // Redirect to sign-in if no session found
    }
  }, []);

  const QnA = [
    {
      question: "question",
      answer: "answer",
    },
  ];

  return (
    <ProductNavBar>
      <div className="flex flex-col gap-2">
        <h4>Frequently Asked Questions</h4>
        <div className="flex flex-row items-center gap-2 py-1">
          <Icons.SearchIcon className="text-xl text-sec-blue" />
          <input placeholder="Search" className="w-full border-0" />
        </div>
        <hr />
        {QnA.map((question, key) => (
          <FAQComponent
            key={key}
            question={question.question}
            answer={question.answer}
          />
        ))}
      </div>
    </ProductNavBar>
  );
}
