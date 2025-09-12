import React, { useState } from 'react';

// FAQ для компании: список вопросов-ответов
const CompanyFAQ = ({ faqs = [] }) => {
  const [openIdx, setOpenIdx] = useState(null);
  if (!faqs.length) return <div className="text-gray-500">Вопросы и ответы пока не добавлены.</div>;
  return (
    <div className="my-6">
      <h2 className="text-xl font-semibold mb-4">Вопросы и ответы (FAQ)</h2>
      <div className="space-y-2">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border rounded bg-white">
            <button
              className="w-full text-left px-4 py-2 font-medium hover:bg-gray-50 focus:outline-none"
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
            >
              {faq.question}
            </button>
            {openIdx === idx && (
              <div className="px-4 py-2 text-gray-700 border-t bg-gray-50">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyFAQ;
