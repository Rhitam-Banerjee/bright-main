import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import devUrls from "../../utils/devUrls";

import bookIcon from "../../icons/bookIconBlue.svg";
import bookIconWhite from "../../icons/bookIcon.svg";
import deliveryIconBlue from "../../icons/deliveryIconBlue.svg";
import deliveryIconWhite from "../../icons/deliveryIconWhite.svg";

import razorpay from "../../icons/razorpayIcon.svg";

import { FaArrowRightLong } from "react-icons/fa6";

import {
  nextStepRegister,
  setAlert,
  setRegisterDetails,
  setSelectedSubscription,
} from "../../reducers/mainSlice";
import { planDetails, stepsComplete } from "./constants";
import { useNavigate } from "react-router-dom";

const FirststepRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    registerDetails: { mobileNumber, selectedPlan, selectedSubscription },
  } = useSelector((store) => store.main);

  const [planType, setPlanType] = useState(true);

  const selectPlan = async () => {
    try {
      await axios.post(
        devUrls.choosePlan,
        { mobile_number: mobileNumber, plan: selectedPlan.planId },
        {
          withCredentials: true,
        }
      );
      await axios.post(
        devUrls.chooseSubscription,
        { mobile_number: mobileNumber, plan_duration: selectedSubscription },
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const checkNumber = async () => {
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
    } catch (err) {
      dispatch(
        setAlert({ text: err.response?.data?.message, color: "#F75549" })
      );
      console.log(err);
    }
  };

  const initiatePayment = async () => {
    if (!mobileNumber) {
      dispatch(setAlert({ text: "Enter a Mobile Number", color: "#ff0000" }));
      window.scrollTo(0, 0);
      return;
    } else if (mobileNumber.length !== 10) {
      dispatch(
        setAlert({ text: "Not a Valid Mobile Number", color: "#ff0000" })
      );
      window.scrollTo(0, 0);
      return;
    }
    await checkNumber();
    await selectPlan();

    // window.scrollTo(0, 0);
    // stepsComplete.forEach((step, index) => {
    //   if (index !== 2) {
    //     step.isComplete = true;
    //     step.isOnStep = false;
    //   }
    // });
    // stepsComplete[2].isOnStep = true;
    // dispatch(setRegisterDetails({ paymentDone: true, paymentStatus: "Paid" }));
    // dispatch(nextStepRegister());
    // navigate("/register");

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
          window.scrollTo(0, 0);
          stepsComplete.forEach((step, index) => {
            if (index !== 2) {
              step.isComplete = true;
              step.isOnStep = false;
            }
          });
          stepsComplete[2].isOnStep = true;
          dispatch(
            setRegisterDetails({ paymentDone: true, paymentStatus: "Paid" })
          );
          dispatch(nextStepRegister());
          navigate("/register");
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
    window.scrollTo(0, 200);
  }, []);

  return (
    <>
      <section className="w-full max-w-[340px] p-[10px] flex flex-col justify-center items-center gap-[10px]">
        <span className="my-[10px] text-[13px] text-secondary font-bold">
          Plan &amp; Pricing
        </span>
        <div className="max-w-[340px] w-full flex flex-row justify-between items-center">
          <span className="text-[11px] font-semibold">Change plan anytime</span>
          <div className="h-[12px] w-[1px] bg-secondary" />
          <span className="text-[11px] font-semibold">Pause anytime</span>
          <div className="h-[12px] w-[1px] bg-secondary" />
          <span className="text-[11px] font-semibold ">Reschedule anytime</span>
        </div>
        <div className="flex flex-row items-center gap-[10px]">
          <span
            className={`${
              planType ? "text-mainColor" : "text-unHighlightLight"
            } text-[11px] font-bold `}
          >
            Semi
          </span>
          <span
            className="relative w-[54px] h-[25px] bg-mainColor rounded-[25px] p-[2px]"
            onClick={() => {
              setPlanType((prev) => {
                return (prev = !planType);
              });
              dispatch(setSelectedSubscription(`${!planType ? 6 : 12}`));
            }}
          >
            <span
              className={`${
                planType === true
                  ? "left-[2px] right-auto"
                  : "left-auto right-[2px]"
              } absolute top-1/2 -translate-y-1/2 w-[21px] h-[21px] bg-white rounded-full`}
            ></span>
          </span>
          <span
            className={`${
              !planType ? "text-mainColor" : "text-unHighlightLight"
            } text-[11px] font-bold `}
          >
            Annual
          </span>
        </div>
        <div className="w-full flex flex-col justify-center items-center gap-[8px]">
          {planDetails[`${planType ? 0 : 1}`].map((plan, index) => {
            return (
              <div
                key={index}
                className={`mt-[10px] p-[15px] pt-[18px] relative flex flex-col justify-between items-center w-full h-[150px] rounded-[5px] cursor-pointer ${
                  plan.planId === selectedPlan.planId
                    ? "text-white bg-mainColor"
                    : "text-mainColor bg-mainColorLight"
                }`}
                onClick={() =>
                  dispatch(setRegisterDetails({ selectedPlan: plan }))
                }
              >
                <div className="w-full flex flex-row justify-between items-center">
                  <div className="flex flex-col">
                    <div className="flex flex-row justify-start items-center">
                      <span className="text-[20px] font-semibold pr-[10px]">
                        {plan.title}
                      </span>
                      <img
                        className="h-[20px]"
                        src={
                          plan.planId === selectedPlan.planId
                            ? plan.activeIcon
                            : plan.icon
                        }
                        alt="PlanIcon"
                      />
                    </div>
                    <span className="text-[13px] font-semibold">
                      {plan.books} {plan.books > 1 ? "Books" : "Book"} / week
                    </span>
                  </div>
                  <div className="ml-auto flex flex-col justify-between items-center">
                    <span
                      className={`${
                        plan.planId === selectedPlan.planId
                          ? "text-secondary"
                          : "text-mainColor"
                      } text-[24px] font-black`}
                    >
                      &#8377; {plan.price}/-
                    </span>
                    <span
                      className={`${
                        plan.planId === selectedPlan.planId
                          ? "text-secondary"
                          : "text-unHighlightLight"
                      } tetx-[10px]`}
                    >
                      per {plan.duration}
                    </span>
                  </div>
                </div>
                <div className="w-full flex flex-col justify-center items-center">
                  <div className="w-full flex flex-row justify-between items-center">
                    <div className="flex flex-row">
                      <img
                        className="w-[10px] mr-[10px]"
                        src={
                          plan.planId === selectedPlan.planId
                            ? bookIconWhite
                            : bookIcon
                        }
                        alt=""
                      />
                      <span className="text-[13px] font-semibold">
                        Books - <b className="font-black">{plan.totalBooks}</b>
                      </span>
                    </div>
                    <span
                      className={`${
                        plan.planId === selectedPlan.planId
                          ? "text-white"
                          : "text-unHighlightLight"
                      } text-[9px] font-light ml-auto`}
                    >
                      Avg. member reads books worth
                    </span>
                  </div>
                  <div className="w-full flex flex-row justify-between items-center">
                    <div className="flex flex-row">
                      <img
                        className="w-[12px] mr-[10px]"
                        src={
                          plan.planId === selectedPlan.planId
                            ? deliveryIconWhite
                            : deliveryIconBlue
                        }
                        alt=""
                      />
                      <span className="text-[13px] font-semibold">
                        Deliveries -
                        <b className="pl-1 font-black">
                          {plan.totalDeliveries}
                        </b>
                      </span>
                    </div>
                    <span
                      className={`${
                        plan.planId === selectedPlan.planId
                          ? "text-white"
                          : "text-unHighlightLight"
                      } text-[9px] font-light ml-auto`}
                    >
                      Rs. {plan.avgRead} +
                    </span>
                  </div>
                </div>
                <div
                  className={`${
                    plan.popular ? "" : "hidden"
                  } absolute top-1 -right-[5px] w-[65px] h-[18px] flex items-center justify-center bg-secondary text-white rounded-[2px] rounded-br-none text-[10px] z-[2]`}
                >
                  {planType ? "Popular" : "Saver"}
                </div>
                <div
                  className={`${
                    plan.popular ? "" : "hidden"
                  } absolute top-[17px] -right-[5px] bg-[#db8726] w-[5px] h-[7px] `}
                  style={{
                    clipPath: "polygon(0% 0%, 100% 0%, 0% 100%)",
                  }}
                ></div>
              </div>
            );
          })}
        </div>
        <div className="w-full max-w-[360px] mx-auto">
          {mobileNumber.length !== 10 && (
            <form className="mt-[20px] flex flex-col items-center justify-between w-full max-w-[350px] h-[36px] mx-auto text-[12px] font-semibold">
              <input
                className="w-full flex-1 p-[4px] rounded-[5px] bg-transparent placeholder-[#FF9F30] placeholder-opacity-70"
                type="text"
                maxLength={10}
                value={mobileNumber}
                placeholder="Enter mobile number"
                style={{
                  border: "2px solid #FF9F30",
                }}
                onChange={({ target: { value } }) => {
                  if (value.match(/^[0-9]*$/)) {
                    dispatch(setRegisterDetails({ mobileNumber: value }));
                  }
                }}
              />
            </form>
          )}
          <span
            className={`${
              mobileNumber.length === 10
                ? "opacity-100 pointer-events-auto cursor-pointer"
                : "opacity-50 pointer-events-none !cursor-not-allowed"
            }
            bg-secondary mt-[20px] flex flex-row justify-center items-center w-full max-w-[350px] mx-auto px-[65px] py-[11px] text-white text-[12px] rounded-[5px] cursor-pointer`}
            // onClick={initiatePayment}
            onClick={initiatePayment}
          >
            Make Payment <FaArrowRightLong className="ml-[10px]" />
          </span>
          <span className="mt-[20px] flex flex-row justify-center items-center text-[10px] text-unHighlightDark">
            Powered by <img src={razorpay} alt="RazorPay" />
          </span>
        </div>
      </section>
    </>
  );
};

export default FirststepRegister;
