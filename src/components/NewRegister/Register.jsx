import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import devUrls from "../../utils/devUrls";

import badgeIcon from "../../icons/badgeIconOrange.svg";
import tickIconWhite from "../../icons/tickIconWhite.svg";
import bookIcon from "../../icons/bookIconBlue.svg";
import pouchMoney from "../../icons/moneyBagIconGrey.svg";
import cycleIconGrey from "../../icons/cycleIconBlue.svg";
import watchIconGrey from "../../icons/watchIconGrey.svg";
import infoIcon from "../../icons/infoIconGrey.svg";

import razorpay from "../../icons/razorpayIcon.svg";

import { FaArrowRightLong } from "react-icons/fa6";

import { features, planDetails, stepsComplete } from "./constants";

import {
  nextStepRegister,
  setAlert,
  setRegisterDetails,
} from "../../reducers/mainSlice";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    isLoggedIn,
    registerDetails: {
      mobileNumber,
      selectedPlan,
      paymentDone,
      registrationDone,
      paymentStatus,
      selectedSubscription,
    },
  } = useSelector((store) => store.main);

  const selectPlan = async () => {
    try {
      await axios.post(
        devUrls.choosePlan,
        { mobile_number: mobileNumber, plan: selectedPlan.planId },
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      console.log(err);
    }
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

  const initiatePayment = async () => {
    await selectPlan();
    try {
      const response = await axios.post(
        devUrls.generateOrderId,
        { mobile_number: mobileNumber, card: selectedSubscription },
        { withCredentials: true }
      );
      const instance = window.Razorpay({
        ...response.data,
        handler: async (data) => {
          await axios.post(
            devUrls.verifyOrder,
            {
              payment_id: data.razorpay_payment_id,
              order_id: data.razorpay_order_id,
              signature: data.razorpay_signature,
            },
            { withCredentials: true }
          );
          await axios.post(
            devUrls.orderSuccessful,
            {
              order_id: data.razorpay_order_id,
              payment_id: data.razorpay_payment_id,
              mobile_number: mobileNumber,
            },
            { withCredentials: true }
          );
          dispatch(
            setRegisterDetails({ paymentDone: true, paymentStatus: "Paid" })
          );
          dispatch(nextStepRegister());
        },
      });
      instance.on("payment.failed", (response) => {
        dispatch(
          setAlert({ text: "Payment failed! Try again later", color: "F75549" })
        );
      });
      instance.open();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/login");
    }
  }, []);

  return (
    <main className="mt-[90px] flex flex-col justify-center items-center gap-[30px]">
      <section className="flex flex-col justify-center items-center max-w-[230px] text-center">
        <div className="mb-[20px]">
          <img className="w-[27px] h-[27px]" src={badgeIcon} alt="BadgeIcon" />
        </div>
        <p className="text-[15px] font-bold text-mainColor">
          Become a Brightr Club member
        </p>
        <p className="text-[13px] font-semibold">
          Illuminate your reading journey
        </p>
      </section>
      <section className="mt-[20px] flex flex-row justify-between w-full max-w-[320px] mx-auto gap-[25px]">
        {features.map((feature, index) => {
          return (
            <div
              key={index}
              className="flex flex-col justify-center items-center gap-[15px]"
            >
              <span>
                <img
                  className="w-[20px] h-[20px]"
                  src={feature.icon}
                  alt="FeatureIcon"
                />
              </span>
              <span className="text-[13px] text-mainColor font-semibold text-center">
                {feature.title}
              </span>
            </div>
          );
        })}
      </section>
      <form className="mt-[20px] flex flex-row items-center justify-between w-[282px] h-[36px] border-[2px] text-[12px] font-semibold border-mainColor rounded-[5px] p-[4px]">
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
      <section className="mt-[20px] relative w-full max-w-[353px] flex flex-row justify-between items-center">
        {stepsComplete.map((step, index) => {
          return (
            <div
              key={index}
              className="flex flex-col justify-between items-center gap-[11px]"
            >
              <span
                className={` ${
                  step.isOnStep ? "bg-mainColor" : "bg-unHighlight"
                } w-[16px] h-[16px] rounded-full grid place-items-center`}
              >
                {step.isComplete && (
                  <img className="w-[8px]" src={tickIconWhite} alt="Complete" />
                )}
              </span>
              <span className="text-[13px] text-mainColor font-semibold">
                {step.title}
              </span>
            </div>
          );
        })}
        <div className="absolute top-[6px] left-1/2 -translate-x-1/2 h-[3px] w-[297px] bg-unHighlight -z-[1]">
          {stepsComplete[0].isComplete && (
            <div
              className={`${
                stepsComplete[1].isComplete ? "w-3/4 from-50%" : "w-1/2 from-0%"
              } bg-gradient-to-r from-mainColor to-unHighlight h-full`}
            ></div>
          )}
        </div>
      </section>
      <section className="w-full max-w-[360px] flex flex-col justify-center items-center gap-[10px]">
        <span className="mt-[10px] text-[13px] font-bold">
          Select a plan based on the books you reed per week
        </span>
        <div className="flex flex-row justify-center items-center gap-[8px]">
          {planDetails.map((plan, index) => {
            return (
              <div
                key={index}
                className={`mt-[10px] relative flex flex-col justify-center items-center w-[100px] h-[100px] rounded-[5px] cursor-pointer ${
                  plan.planId === selectedPlan.planId
                    ? "text-white bg-mainColor"
                    : "text-unHighlightDark bg-mainColorLight"
                }`}
                onClick={() =>
                  dispatch(setRegisterDetails({ selectedPlan: plan }))
                }
              >
                <span className="text-[30px] font-extrabold">{plan.books}</span>
                <span className="text-[10px] font-semibold">
                  {plan.books > 1 ? "Books" : "Book"} / Week
                </span>
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
        <div className="mt-[40px] w-full grid grid-cols-2 gap-[13px]">
          {selectedPlan && (
            <>
              <div className="flex flex-col justify-center items-center bg-lightGrey rounded-[5px] py-[10px] w-full">
                <span className="flex flex-row items-center justify-center text-[13px] text-unHighlightDark font-bold">
                  <img
                    className="mr-[10px] w-[13px] "
                    src={pouchMoney}
                    alt="Pouch Book"
                  />{" "}
                  Price Per Book
                </span>
                <span className="text-[14px] text-mainColor font-bold">
                  Rs.{selectedPlan.pricePerBook}/-
                </span>
              </div>
              <div className="flex flex-col justify-center items-center bg-lightGrey rounded-[5px] py-[10px] w-full">
                <span className="flex flex-row items-center justify-center text-[13px] text-unHighlightDark font-bold">
                  <img
                    className="mr-[10px] w-[13px]  saturate-0"
                    src={bookIcon}
                    alt="Book Icon"
                  />
                  Number of books
                </span>
                <span className="text-[14px] text-mainColor font-bold">
                  {selectedPlan.totalBooks}
                </span>
              </div>
              <div className="flex flex-col justify-center items-center bg-lightGrey rounded-[5px] py-[10px] w-full">
                <span className="flex flex-row items-center justify-center text-[13px] text-unHighlightDark font-bold">
                  <img
                    className="mr-[10px] w-[13px]  saturate-0"
                    src={cycleIconGrey}
                    alt="Delivery Icon"
                  />
                  Number of Delivery
                </span>
                <span className="text-[14px] text-mainColor font-bold">
                  {selectedPlan.totalDeliveries}
                </span>
              </div>
              <div className="flex flex-col justify-center items-center bg-lightGrey rounded-[5px] py-[10px] w-full">
                <span className="flex flex-row items-center justify-center text-[13px] text-unHighlightDark font-bold">
                  <img
                    className="mr-[10px] w-[13px] "
                    src={watchIconGrey}
                    alt="Pouch Book"
                  />
                  Duration
                </span>
                <span className="text-[14px] text-mainColor font-bold">
                  {selectedPlan.duration}
                </span>
              </div>
            </>
          )}
        </div>
        <div className="w-full max-w-[360px] mx-auto">
          <span className="flex flex-row justify-center items-center text-[10px] text-unHighlightDark">
            <img className="w-[13px] mr-[5px]" src={infoIcon} alt="Info" /> The
            price mentioned above is for a 6 month plan paid in full
          </span>
          <span
            className="mt-[20px] flex flex-row justify-center items-center max-w-[260px] w-full mx-auto px-[65px] py-[11px] text-white text-[12px] bg-mainColor rounded-[5px] cursor-pointer"
            // onClick={initiatePayment}
          >
            Make Payment <FaArrowRightLong className="ml-[10px]" />
          </span>
          <span className="mt-[20px] flex flex-row justify-center items-center text-[10px] text-unHighlightDark">
            Powered by <img src={razorpay} alt="RazorPay" />
          </span>
        </div>
      </section>
    </main>
  );
};

export default Register;
