import React from "react";

import contactIcon from "../../icons/contactBook.svg";
import { BiSolidBuildingHouse } from "react-icons/bi";
import { FaMapLocationDot } from "react-icons/fa6";
import { IoMdMail } from "react-icons/io";
import { IoCall } from "react-icons/io5";

import contactMap from "../../icons/contactMap.svg";
const ContactUs = () => {
  return (
    <main className="mt-[70px] text-[12px] p-[20px] w-full max-w-[513px] mx-auto flex flex-col !justify-center md:justify-start items-center">
      <div className="w-full flex flex-row justify-center md:justify-start items-center gap-[10px]">
        <img className="w-[20px]" src={contactIcon} alt="ContactIcon" />
        <span className="text-[20px] text-mainColor font-bold">Contact Us</span>
      </div>
      <p className="mt-[20px] text-[12px] font-semibold text-unHighlightDark">
        We're here to help and answer any questions you might have. Feel free to
        reach out to us using any of the methods below:
      </p>
      <div className="mt-[50px] w-full max-w-[350px] mx-auto flex flex-col justify-center items-center gap-[30px]">
        <div className="w-full flex flex-row justify-between items-center">
          <IoCall className="text-mainColor text-[15px]" />
          <span className="text-[12px] font-semibold">+91-88266-09863</span>
        </div>
        <div className="w-full flex flex-row justify-between items-start">
          <IoMdMail className="text-mainColor text-[15px]" />
          <span className="text-[12px] font-semibold">hello@bukrent.com</span>
        </div>
        <div className="w-full flex flex-row justify-between items-start">
          <BiSolidBuildingHouse className="text-mainColor text-[15px]" />
          <span className="w-[200px] text-right text-[12px] font-semibold">
            Bukrent, Shahid Bhagat singh Marg,Gol Market, New Delhi-110001:
          </span>
        </div>
      </div>
      <div className="mt-[50px]">
        <img className="w-[200px]" src={contactMap} alt="" />
      </div>
      <a
        href="https://maps.app.goo.gl/bphttYvdts9bMSfB7"
        target="_blank"
        rel="noreferrer"
        className="mt-[40px] w-full bg-secondary py-[10px] text-white text-[12px] flex flex-row justify-center items-center gap-[10px] rounded-[5px]"
      >
        <FaMapLocationDot className="text-[20px] text-white" />
        <span>View on map</span>
      </a>
    </main>
  );
};

export default ContactUs;
