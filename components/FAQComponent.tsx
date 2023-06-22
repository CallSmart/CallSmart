const FAQComponent = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  return (
    <div className="container flex-col">
      <h4>{question}</h4>
      <div>{answer}</div>
    </div>
  );
};

export default FAQComponent;
