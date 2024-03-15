import React from "react";

import privacyIcon from "../../icons/privacyIcon.svg";

const PrivacyPolicy = () => {
  return (
    <div className="mt-[70px] text-[12px] p-[20px] w-full max-w-[513px] mx-auto flex flex-col !justify-center md:justify-start items-center">
      <div className="mb-[20px] flex flex-row justify-center md:!justify-start items-center w-full !text-[20px] font-bold text-mainColor">
        <img
          className="w-[21px] h-[21px]"
          src={privacyIcon}
          alt="PrivacyPolicy"
        />
        <h1 className="text-[20px]">Privacy Policy</h1>
      </div>
      <div className="pb-[20px] w-full">
        Welcome to BrightR.club! This Privacy Policy explains how we collect,
        use, and protect your data when you use our services.{" "}
      </div>
      <div className="pb-[20px] w-full">
        <p className="text-mainColor font-bold">Cookies and Tracking:</p>
        We use cookies and similar technologies for to enable personalized
        experiences, targeted advertising, and for website analytics.
      </div>
      <div className="pb-[20px] w-full">
        <p className="text-mainColor font-bold">Data Security:</p>
        We employ security measures to protect your data
      </div>
      <div className="pb-[20px] w-full">
        <p className="text-mainColor font-bold">User Rights:</p>You have the
        right to access, correct, and delete your data.
      </div>
      <div className="pb-[20px] w-full">
        <p className="text-mainColor font-bold">Children's Privacy:</p> We do
        not knowingly collect data from children under 13 without
        parental/guardian consent.
      </div>
      <div className="pb-[20px] w-full">
        <p className="text-mainColor font-bold">Consent:</p>
        By using our services, you consent to our data practices.
      </div>
      <div className="pb-[20px] w-full">
        <p className="text-mainColor font-bold">Changes to Policy:</p>
        We will notify you of changes to this policy.
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

export default PrivacyPolicy;
