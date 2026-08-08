interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
}

export default function FAQSection({ faqs }: FAQSectionProps) {
  if (!faqs?.length) return null;

  return (
    <div className="mt-10 space-y-3">
      <h2 className="font-serif text-2xl mb-4">Frequently Asked Questions</h2>
      {faqs.map((faq, i) => (
        <details 
          key={i} 
          className="border rounded-xl p-4 group" 
          style={{ borderColor: "var(--border-color)" }}
        >
          <summary className="font-medium cursor-pointer list-none flex justify-between items-center">
            {faq.question}
            <span className="transition-transform group-open:rotate-180">▼</span>
          </summary>
          <p className="mt-2 text-sm text-sage-600 dark:text-sage-400">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
