import React from "react";

import logo from "../../icons/BrightR.svg";
import { IoLogoFacebook, IoLogoTwitter, IoLogoInstagram } from "react-icons/io";
// import { BiLogoInstagramAlt } from "react-icons/bi";

const Footer = () => {
  return (
    <footer className="absolute -bottom-[150px] left-1/2 -translate-x-1/2 w-full h-max p-[20px] flex flex-col justify-between items-center bg-mainColor">
      <div className="flex flex-row justify-between items-center">
        <div>
          <img className="h-[37px]" src={logo} alt="" />
        </div>
        <div className="flex flex-row justify-between items-center gap-[10px]">
          <IoLogoFacebook className="text-white text-[24px]" />
          <IoLogoInstagram className="text-white text-[24px]" />
          <IoLogoTwitter className="text-white text-[24px]" />
        </div>
      </div>
      <div></div>
    </footer>
  );
};

export default Footer;
