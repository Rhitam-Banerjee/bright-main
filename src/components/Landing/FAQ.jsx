import React from "react";

import { TiPlus, TiMinus } from "react-icons/ti";

const FAQ = ({ faq, index, toggleFAQ }) => {
  return (
    <div
      className={`relative px-[20px] py-[10px] border-t-[1px] border-secondary ${
        faq.open ? "open" : ""
      }`}
      key={index}
      onClick={() => toggleFAQ(index)}
    >
      <div className="font-semibold text-[11px]">{faq.ques}</div>
      <TiPlus
        className={`${
          faq.open ? "hidden" : ""
        } text-mainColor absolute top-[13px] right-[20px] w-[11px] h-[11px]`}
      />
      <TiMinus
        className={`${
          faq.open ? "" : "hidden"
        } text-mainColor absolute top-[13px] right-[20px] w-[11px] h-[11px]`}
      />
      <div
        className={`text-[10px] transition-all ${
          faq.open ? "mt-[15px] opacity-100 h-max" : "opacity-0 h-0"
        }`}
      >
        {faq.ans}
      </div>
    </div>
  );
};

export default FAQ;
