import React from "react";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import devUrls from "../../utils/devUrls";

import bookIcon from "../../icons/bookIconBlue.svg";
import pouchMoney from "../../icons/moneyBagIconGrey.svg";
import cycleIconGrey from "../../icons/cycleIconBlue.svg";
import watchIconGrey from "../../icons/watchIconGrey.svg";
import infoIcon from "../../icons/infoIconGrey.svg";

import razorpay from "../../icons/razorpayIcon.svg";

import { FaArrowRightLong } from "react-icons/fa6";

import {
  nextStepRegister,
  setAlert,
  setRegisterDetails,
} from "../../reducers/mainSlice";
import { planDetails, stepsComplete } from "./constants";
import { useNavigate } from "react-router-dom";

const FirststepRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    registerDetails: { mobileNumber, selectedPlan, selectedSubscription },
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

    window.scrollTo(0, 0);
    stepsComplete.forEach((step, index) => {
      if (index !== 2) {
        step.isComplete = true;
        step.isOnStep = false;
      }
    });
    stepsComplete[2].isOnStep = true;
    dispatch(setRegisterDetails({ paymentDone: true, paymentStatus: "Paid" }));
    dispatch(nextStepRegister());

    // try {
    //   const response = await axios.post(
    //     devUrls.generateOrderId,
    //     { mobile_number: mobileNumber, card: selectedSubscription },
    //     { withCredentials: true }
    //   );
    //   const instance = window.Razorpay({
    //     ...response.data,
    //     handler: async (data) => {
    //       await axios.post(
    //         devUrls.verifyOrder,
    //         {
    //           payment_id: data.razorpay_payment_id,
    //           order_id: data.razorpay_order_id,
    //           signature: data.razorpay_signature,
    //         },
    //         { withCredentials: true }
    //       );
    //       await axios.post(
    //         devUrls.orderSuccessful,
    //         {
    //           order_id: data.razorpay_order_id,
    //           payment_id: data.razorpay_payment_id,
    //           mobile_number: mobileNumber,
    //         },
    //         { withCredentials: true }
    //       );
    //       window.scrollTo(0, 0);
    //       dispatch(nextStepRegister());
    //       stepsComplete.forEach((step, index) => {
    //         if (index !== 2) {
    //           step.isComplete = true;
    //           step.isOnStep = false;
    //         }
    //       });
    //       dispatch(
    //         setRegisterDetails({ paymentDone: true, paymentStatus: "Paid" })
    //       );
    //       stepsComplete[2].isOnStep = true;
    //     },
    //   });
    //   instance.on("payment.failed", (response) => {
    //     dispatch(
    //       setAlert({ text: "Payment failed! Try again later", color: "F75549" })
    //     );
    //   });
    //   instance.open();
    // } catch (err) {
    //   console.log(err);
    // }
  };

  return (
    <>
      <form className="mt-[20px] flex flex-col items-center justify-between w-[282px] h-[36px] text-[12px] font-semibold">
        <span className="w-full text-mainColor mr-1 mb-2">Mobile Number</span>
        <input
          className="w-full flex-1 p-[4px] rounded-[5px] bg-transparent"
          type="number"
          value={mobileNumber}
          placeholder="Enter mobile number to explore"
          style={{
            border: "2px solid #3B72FF",
          }}
          onChange={({ target: { value } }) =>
            dispatch(setRegisterDetails({ mobileNumber: value }))
          }
        />
      </form>
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
                  />
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
