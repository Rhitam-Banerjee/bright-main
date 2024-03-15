import React from "react";
import disclaimerIcon from "../../icons/disclaimerIcon.svg";

const Disclaimer = () => {
  return (
    <div className="mt-[70px] text-[12px] p-[20px] w-full max-w-[513px] mx-auto flex flex-col !justify-center md:justify-start items-center">
      <div className="mb-[20px] flex flex-row justify-center md:!justify-start items-center w-full !text-[20px] font-bold text-mainColor">
        <img
          className="w-[21px] h-[21px]"
          src={disclaimerIcon}
          alt="Disclaimer"
        />
        <h1 className="text-[20px]">Desclaimer</h1>
      </div>
      <div className="pb-[20px] w-full">
        Welcome to BrightR.club! Please read this disclaimer before using our
        website.
      </div>
      <div className="pb-[20px] w-full">
        <p className="text-mainColor font-bold">Content Accuracy:</p>
        Information on our website is provided for general informational
        purposes and may not be accurate, complete, or up-to-date.
      </div>
      <div className="pb-[20px] w-full">
        <p className="text-mainColor font-bold">Liability Limitation:</p>
        We are not liable for any errors or omissions in the content or for
        actions taken based on the information provided.
      </div>
      <div className="pb-[20px] w-full">
        <p className="text-mainColor font-bold">External Links:</p>
        Our website may contain links to external websites, and we are not
        responsible for their content or actions.
      </div>
      <div className="pb-[20px] w-full">
        <p className="text-mainColor font-bold">No Professional Advice:</p>
        Seek professional advice when making important decisions based on the
        information on our website.
      </div>
      <div className="pb-[20px] w-full">
        <p className="text-mainColor font-bold">User Responsibility:</p>
        You are responsible for your actions and decisions.
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

export default Disclaimer;
