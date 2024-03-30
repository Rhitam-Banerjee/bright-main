import React from "react";
import { Link } from "react-router-dom";

import logo from "../../icons/BrightR.svg";
import {
  IoLogoFacebook,
  IoLogoTwitter,
  IoLogoInstagram,
  IoMdMail,
} from "react-icons/io";
import { IoCall } from "react-icons/io5";

const Footer = () => {
  return (
    <footer className="absolute -bottom-[350px] left-1/2 -translate-x-1/2 w-full h-max p-[20px] flex flex-col justify-between items-center bg-mainColor">
      <div className="w-full flex flex-row justify-between items-center">
        <Link to={"/"}>
          <img className="h-[37px]" src={logo} alt="" />
        </Link>
        <div className="flex flex-row justify-between items-center gap-[10px]">
          <a
            href="https://www.facebook.com/brightr.clubs"
            target="_blank"
            rel="noreferrer"
          >
            <IoLogoFacebook className="text-white text-[24px]" />
          </a>
          <a
            href="https://www.instagram.com/brightr.club/"
            target="_blank"
            rel="noreferrer"
          >
            <IoLogoInstagram className="text-white text-[24px]" />
          </a>
          <a
            href="https://twitter.com/BrightR_Club"
            target="_blank"
            rel="noreferrer"
          >
            <IoLogoTwitter className="text-white text-[24px]" />
          </a>
        </div>
      </div>
      <div className="mt-[20px] w-full flex flex-col justify-start items-start gap-[20px]">
        <span className="flex flex-row justify-between items-center gap-[10px]">
          <IoCall className="text-white text-[15px]" />
          <span className="text-white text-[12px] font-semibold">
            +91-88266-09863
          </span>
        </span>
        <span className="flex flex-row justify-between items-center gap-[10px]">
          <IoMdMail className="text-white text-[15px]" />
          <span className="text-white text-[12px] font-semibold">
            hello@bukrent.com
          </span>
        </span>
      </div>
      <div className="w-full mt-[40px] flex flex-row justify-start items-start gap-[20px]">
        <div className="flex flex-col justify-center items-start gap-[10px]">
          <span className="text-[12px] font-black text-white ">Policy</span>
          <Link className="text-[10px] text-white " to={"/disclaimer"}>
            Disclaimer
          </Link>
          <Link className="text-[10px] text-white " to={"/privacy-policy"}>
            Privacy Policy
          </Link>
          <Link className="text-[10px] text-white " to={"/refund-policy"}>
            Refund Policy
          </Link>
          <Link
            className="text-[10px] text-white "
            to={"/terms-and-conditions"}
          >
            Terms and Conditions
          </Link>
        </div>
        <div className="mx-auto flex flex-col justify-center items-start gap-[10px]">
          <span className="text-[12px] font-black text-white ">
            Get Connected
          </span>
          <Link className="text-[10px] text-white " to={"/about-us"}>
            About Us
          </Link>
          <Link className="text-[10px] text-white " to={"/contact-us"}>
            Contact Us
          </Link>
          <a href="/#faqs" className="text-[10px] text-white ">
            FAQs
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
