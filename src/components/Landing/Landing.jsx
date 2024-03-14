import React, { useEffect, useState } from "react";
import axios from "axios";
import devUrls from "../../utils/devUrls";

import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "swiper/css/virtual";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Virtual } from "swiper/modules";

import {
  flushRegisterDetails,
  setAlert,
  setRegisterDetails,
} from "../../reducers/mainSlice";

import { FaArrowRightLong } from "react-icons/fa6";

import heroBg from "../../icons/Hero.png";

import bookInfo from "../../icons/bookQuestionIcon.svg";
import userIconHero from "../../icons/createAccountIcon.svg";
import readingListIcon from "../../icons/readingListIcon.svg";
import deliveryIconHero from "../../icons/deliveryIconHero.svg";
import bookIcon from "../../icons/bookIconOrange.svg";
import videoIcon from "../../icons/videoIcon.svg";

import BookScroll from "./BookScroll";
import VideoScroll from "./VideoScroll";

import { planDetails, allFaqs } from "./constants";

import FAQ from "./FAQ";

const Landing = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    isLoggedIn,
    registerDetails: { mobileNumber },
  } = useSelector((store) => store.main);

  const [faqs, setFaqs] = useState(allFaqs);
  const toggleFAQ = (index) => {
    setFaqs(
      faqs.map((faq, i) => {
        if (i === index) {
          faq.open = !faq.open;
        } else {
          faq.open = false;
        }

        return faq;
      })
    );
  };

  const goToRegister = async (event) => {
    event.preventDefault();
    if (mobileNumber.length !== 10)
      return dispatch(
        setAlert({ text: "Invalid mobile number", color: "#F75549" })
      );
    try {
      const response = await axios.post(
        devUrls.submitMobileNumber,
        { mobile_number: mobileNumber },
        {
          withCredentials: true,
        }
      );
      const data = response.data;
      if (data.user) {
        dispatch(
          setRegisterDetails({
            paymentStatus: data.user.payment_status,
          })
        );
      }
      if (data.redirect.includes("login")) navigate("/login");
      else {
        dispatch(setRegisterDetails({ mobileNumber, otpSent: true }));
        navigate("/register");
      }
    } catch (err) {
      dispatch(
        setAlert({ text: err.response?.data?.message, color: "#F75549" })
      );
      console.log(err);
    }
  };
  useEffect(() => {
    dispatch(flushRegisterDetails());
  }, []);

  return (
    <main className="mt-[50px]">
      <section className="relative h-[570px] w-full">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundPosition: "50% 50%",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        />
        <div className="absolute top-0 left-0 bottom-0 right-0 bg-[#ffffff59]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[150px] w-full flex flex-col justify-center items-center bg-[#ffffffd0]">
          <div className="text-mainColor text-[19px] font-bold">
            Library
            <span className="px-2 text-secondary">-</span>
            Home Delivered
          </div>
          <div className="text-[15px] font-bold text-unHighlightDark">
            <span>World class books</span>
            <span className="ml-2 pl-2 border-l-[2px] border-secondary">
              Doorstep Delivery
            </span>
          </div>
          {!isLoggedIn && (
            <form className="mt-[25px] flex flex-row items-center justify-between w-[282px] h-[36px] border-[2px] text-[12px] font-semibold border-mainColor rounded-[5px] p-[4px]">
              <input
                className="flex-1 bg-transparent"
                type="number"
                placeholder="Enter mobile number to explore"
                onChange={({ target: { value } }) =>
                  dispatch(setRegisterDetails({ mobileNumber: value }))
                }
              />
              <button
                className="grid place-items-center bg-[#3b72ff85] h-[28px] w-[52px] rounded-[5px]"
                type="submit"
                value="Get Started"
                onClick={goToRegister}
              >
                <FaArrowRightLong className="w-[22px] text-white" />
              </button>
            </form>
          )}
        </div>
      </section>
      <section className="p-[30px] flex flex-col justify-center items-center gap-[10px] bg-mainColor w-full">
        <div>
          <img src={bookInfo} alt="BookIconInfo" />
        </div>
        <div className="text-[15px] text-white font-bold">
          <span>How It Works</span>
        </div>
        <div className="text-[13px] text-white font-semibold">
          <span>Unlocking the worls of books simplified!</span>
        </div>
        <div className="mt-[20px] w-full max-w-[400px] m-auto flex flex-row justify-between items-center gap-[10px]">
          <div className="flex flex-col justify-center items-center gap-[11px] text-white text-[11px]">
            <img src={userIconHero} alt="heroIconUser" />
            <span>Create Account</span>
          </div>
          <div className="flex flex-col justify-center items-center gap-[11px] text-white text-[11px]">
            <img src={readingListIcon} alt="heroIconReading" />
            <span>Build Readinglist</span>
          </div>
          <div className="flex flex-col justify-center items-center gap-[11px] text-white text-[11px]">
            <img src={deliveryIconHero} alt="heroIconDelivery" />
            <span>Doorstep Delivery</span>
          </div>
        </div>
      </section>
      <section className="p-[30px] flex flex-col justify-center items-center gap-[10px]">
        <div>
          <img className="w-[24px]" src={bookIcon} alt="BookIcon" />
        </div>
        <p className="text-[15px] font-bold text-mainColor">
          Explore our extensive library
        </p>
        <p className="text-center text-[13px] font-bold">
          Keep track of chat toppers across <br />
          Amazon, Goodreads, New York Times
        </p>
      </section>
      <BookScroll />
      <div className="mt-[30px] h-[36px] w-[108px] mx-auto bg-secondary rounded-[5px] flex items-center justify-center">
        <Link
          to={"/browse-library"}
          className="text-white text-[12px] font-bold"
        >
          Browse Library
        </Link>
      </div>
      <section className="mt-[30px] p-[30px] pb-[12px] flex flex-col justify-center items-center gap-[10px] bg-mainColor w-full">
        <div>
          <img className="w-[24px]" src={videoIcon} alt="BookIcon" />
        </div>
        <p className="text-[15px] font-bold text-white">
          Explore books through glimpses
        </p>
        <p className="text-center text-[13px] font-bold text-white">
          Discover through video summaries before you dive in!
        </p>
      </section>
      <VideoScroll />
      <section className="mt-[16px] py-[30px] flex flex-col justify-center items-center gap-[10px] w-full bg-mainColor">
        <span className="text-[13px] text-white font-semibold">
          Select a plan based on the books you reed per week
        </span>
        <div className="flex flex-row justify-center items-center gap-[8px]">
          {planDetails.map((plan, index) => {
            return (
              <div
                key={index}
                className={`relative flex flex-col justify-center items-center w-[100px] h-[100px] rounded-[5px] ${
                  plan.popular
                    ? "text-mainColor bg-white"
                    : "text-unHighlightDark bg-mainColorLight"
                }`}
              >
                <span className="text-[30px] font-extrabold">{plan.books}</span>
                <span className="text-[10px] font-semibold">Book/Week</span>
                <span className="text-[13px] font-bold pt-[14px] ">
                  Rs.{plan.price}
                </span>
                <div
                  className={`${
                    plan.popular ? "" : "hidden"
                  } absolute -top-[2px] -right-[5px] w-[45px] h-[15px] flex items-center justify-center bg-secondary text-white rounded-[2px] rounded-br-none text-[8px] z-[2]`}
                >
                  Popular
                </div>
                <div
                  className={`${
                    plan.popular ? "" : "hidden"
                  } absolute top-[13px] -right-[5px] bg-[#db8726] w-[5px] h-[7px] `}
                  style={{
                    clipPath: "polygon(0% 0%, 100% 0%, 0% 100%)",
                  }}
                ></div>
              </div>
            );
          })}
        </div>
        <div className="mt-[30px] h-[36px] w-[108px] mx-auto bg-secondary rounded-[5px] flex items-center justify-center">
          <Link to={"/register"} className="text-white text-[12px] font-bold">
            Explore Pricing
          </Link>
        </div>
      </section>
      <section className="mt-[20px] px-[30px] pb-[12px] flex flex-col justify-center items-center gap-[10px] w-full">
        <p className="text-[15px] font-bold text-mainColor">
          Answers to your questions
        </p>
        <p className="text-center text-[13px] font-bold">
          Find your solutions here
        </p>
      </section>
      <section className="w-full mx-auto">
        {faqs.map((faq, index) => (
          <FAQ faq={faq} index={index} key={index} toggleFAQ={toggleFAQ} />
        ))}
      </section>
    </main>
  );
};

export default Landing;
