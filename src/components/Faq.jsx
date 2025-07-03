import React, { useState } from 'react';

const Faq = ({ faqData }) => {
  const [openIndexes, setOpenIndexes] = useState([]);

  const handleToggle = (idx) => {
    setOpenIndexes((prev) =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const renderFaqItem = (item, idx) => {
    const isOpen = openIndexes.includes(idx);
    return (
      <div className={`faq-item${isOpen ? ' open' : ''}`} key={item.question}>
        <button className="faq-question" onClick={() => handleToggle(idx)}>
          <span className={`faq-icon${isOpen ? ' open' : ''}`}>
            <svg width="22" height="22" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={`faq-icon-svg${isOpen ? ' open' : ''}`}>
              <path d="M6 8l4 4 4-4" stroke="#222" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="faq-question-text">{item.question}</span>
        </button>
        <div className="faq-answer-wrapper">
          <div className={`faq-answer ${isOpen ? 'faq-answer-content open' : 'faq-answer-content'}`}>
            <span>{item.answer}</span>
          </div>
        </div>
      </div>
    );
  };

  const leftColumn = faqData.slice(0, Math.ceil(faqData.length / 2));
  const rightColumn = faqData.slice(Math.ceil(faqData.length / 2));

  return (
    <div className="faq-container">
      <h1 className="faq-title">Frequently Asked Questions</h1>
      <div className="faq-grid">
        <div className="faq-column">
          {leftColumn.map((item, i) => renderFaqItem(item, i))}
        </div>
        <div className="faq-column">
          {rightColumn.map((item, i) => renderFaqItem(item, i + leftColumn.length))}
        </div>
      </div>
    </div>
  );
};

export default Faq;
