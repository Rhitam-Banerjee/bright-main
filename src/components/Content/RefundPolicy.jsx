import React from "react";

import refundIcon from "../../icons/refundIcon.svg";
const RefundPolicy = () => {
  return (
    <div className="mt-[70px] text-[12px] p-[20px] w-full max-w-[513px] mx-auto flex flex-col !justify-center md:justify-start items-center">
      <div className="mb-[20px] flex flex-row justify-center md:!justify-start items-center w-full !text-[20px] font-bold text-mainColor">
        <img
          className="w-[21px] h-[21px]"
          src={refundIcon}
          alt="RefundPolicy"
        />
        <h1 className="text-[20px]">Refund Policy</h1>
      </div>
      <div className="pb-[20px] w-full">
        Welcome to BrightR.club! This Refund Policy outlines our refund
        procedures.
      </div>
      <div className="pb-[20px] w-full">
        <p className="text-mainColor font-bold">Refund Process:</p>
        <ul>
          <li className="list-disc ml-[20px]">
            To request a refund, please contact us at ops@brightr.club |
            +91-88266-09863.
          </li>
          <li className="list-disc ml-[20px]">
            Refunds may take [Refund Timeframe] to process.
          </li>
        </ul>
      </div>
      <div className="pb-[20px] w-full">
        For inquiries, please contact us at
        <p className="text-mainColor font-bold">
          ops@brightr.club <span className="text-secondary px-1">|</span>
          +91-88266-09863
        </p>
      </div>
      <div className="font-bold text-[10px] w-full text-unHighlightDark">
        Last updated: 1st July 2023
      </div>
    </div>
  );
};

export default RefundPolicy;
