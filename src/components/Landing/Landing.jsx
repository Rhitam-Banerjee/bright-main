import React, { useEffect } from "react";
import axios from "axios";
import devUrls from "../../utils/devUrls";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  flushRegisterDetails,
  setAlert,
  setRegisterDetails,
} from "../../reducers/mainSlice";

import bookInfo from "../../icons/bookQuestionIcon.svg";
import { FaArrowRightLong } from "react-icons/fa6";
import heroBg from "../../icons/Hero.png";

const Landing = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    isLoggedIn,
    registerDetails: { mobileNumber },
  } = useSelector((store) => store.main);

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
      <section className="relative h-[380px] w-full">
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
            <span className="ml-2 pl-2 border-l-[1px] border-secondary">
              Doorstep Delivery
            </span>
          </div>
          {!isLoggedIn && (
            <form className="mt-[25px] flex flex-row items-center justify-between w-[282px] h-[36px] border-[2px] font-semibold border-mainColor rounded-[5px] p-[4px]">
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
      <section></section>
    </main>
  );
};

export default Landing;
