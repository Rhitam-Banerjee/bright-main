import React from "react";

import aboutIcon from "../../icons/aboutUsIcon.svg";
import { IoCall } from "react-icons/io5";
import { Link } from "react-router-dom";
const AboutUs = () => {
  return (
    <main className="mt-[70px] text-[12px] p-[20px] w-full max-w-[513px] mx-auto flex flex-col !justify-center md:justify-start items-center">
      <div className="w-full flex flex-row justify-center md:justify-start items-center gap-[10px]">
        <img className="w-[20px]" src={aboutIcon} alt="ContactIcon" />
        <span className="text-[20px] text-mainColor font-bold">About Us</span>
      </div>
      <p className="mt-[20px] text-[12px] font-semibold">
        We are a team of highly motivated individuals (&amp; techies, parents,
        veterans, wanderers, homebodies, outdoor enthusiasts) offering a book
        rental home delivery service.
        <br />
        <br /> We embrace books as cherished objects and are committed to our
        mission of improving access and affordability for readers everywhere.
        <br />
        <br /> We are here for folks who favour reuse and love to flip real
        pages.
      </p>
      <Link
        to={"/contact-us"}
        className="mt-[40px] w-full py-[10px] bg-white flex flex-row justify-center items-center gap-[10px] rounded-[5px]"
        style={{
          border: "2px solid #3B72FF",
        }}
      >
        <IoCall className="text-[20px] text-mainColor" />
        <span className="text-mainColor font-bold text-[12px]">Contact us</span>
      </Link>
    </main>
  );
};
/* <p>We are a team of highly motivated individuals (&amp; techies, parents, veterans, wanderers, homebodies, outdoor enthusiasts) offering a book rental home delivery service.
  We embrace books as cherished objects and are committed to our mission of improving access and affordability for readers everywhere.
  We are here for folks who favour reuse and love to flip real pages.</p> */
export default AboutUs;
