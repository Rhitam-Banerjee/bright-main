import React from "react";

import tandcIcon from "../../icons/tandcIcon.svg";
const TermsAndConditions = () => {
  return (
    <div className="mt-[70px] text-[12px] p-[20px] w-full max-w-[513px] mx-auto flex flex-col !justify-center md:justify-start items-center">
      <div className="mb-[20px] flex flex-row justify-center md:!justify-start items-center w-full !text-[20px] font-bold text-mainColor">
        <img
          className="w-[21px] h-[21px]"
          src={tandcIcon}
          alt="TermsAndConditions"
        />
        <h1 className="text-[20px]">Terms and Conditions</h1>
      </div>
      <div className="pb-[20px] w-full">
        Welcome to BrightR.club! These terms and conditions ("Terms") govern
        your use of our website and services. By using our website, you agree to
        these Terms.
      </div>
      <div className="pb-[20px] w-full">
        <p className="text-mainColor font-bold">User Responsibilities:</p>
        <ul>
          <li className="list-disc ml-[20px]">
            You must be at least 18 years old or have parental/guardian consent
            to use our services.
          </li>
          <li className="list-disc ml-[20px]">
            You are responsible for maintaining the confidentiality of your
            account information.
          </li>
          <li className="list-disc ml-[20px]">
            You agree not to engage in any illegal or harmful activities on our
            website.
          </li>
        </ul>
      </div>
      <div className="pb-[20px] w-full">
        <p className="text-mainColor font-bold">Membership:</p>
        <ul>
          <li className="list-disc ml-[20px]">
            We offer a standard 6-month membership.
          </li>
          <li className="list-disc ml-[20px]">
            Membership fees are non-refundable.
          </li>
        </ul>
      </div>
      <div className="pb-[20px] w-full">
        <p className="text-mainColor font-bold">Book Borrowing and Returns:</p>
        <ul>
          <li className="list-disc ml-[20px]">
            Books must be returned in the condition they were received.
          </li>
          <li className="list-disc ml-[20px]">
            Lost books may require replacement or payment.
          </li>
        </ul>
      </div>
      <div className="pb-[20px] w-full">
        <p className="text-mainColor font-bold">Intellectual Property:</p>
        <ul>
          <li className="list-disc ml-[20px]">
            All content on our website is protected by copyright and may not be
            used without permission.
          </li>
        </ul>
      </div>
      <div className="pb-[20px] w-full">
        <p className="text-mainColor font-bold">Privacy and Data Handling:</p>
        <ul>
          <li className="list-disc ml-[20px]">
            We collect and use your data as described in our Privacy Policy.
          </li>
        </ul>
      </div>
      <div className="pb-[20px] w-full">
        <p className="text-mainColor font-bold">Termination</p>
        <ul>
          <li className="list-disc ml-[20px]">
            We reserve the right to terminate memberships for violations of
            these Terms.
          </li>
        </ul>
      </div>
      <div className="pb-[20px] w-full">
        <p className="text-mainColor font-bold">Dispute Resolution</p>
        <ul>
          <li className="list-disc ml-[20px]">
            Any disputes will be resolved through arbitration in accordance with
            both the parties.
          </li>
        </ul>
      </div>
      <div className="pb-[20px] w-full">
        <p className="text-mainColor font-bold">Limitation of Liability:</p>
        <ul>
          <li className="list-disc ml-[20px]">
            We are not liable for any direct or indirect damages.
          </li>
        </ul>
      </div>
      <div className="pb-[20px] w-full">
        <b>9. Changes to Terms of Use</b>
        <ul>
          <li className="list-disc ml-[20px]">
            We may update these Terms, and you will be notified of changes.
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

export default TermsAndConditions;
