import { Card } from "@tremor/react";

const FAQComponent = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  return (
    <Card decoration="left" className="flex flex-col border-prim-blue">
      <h4>{question}</h4>
      <div>{answer}</div>
    </Card>
  );
};

export default FAQComponent;
