import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import devUrls from "../../utils/devUrls";

import { getFormattedDate, getApiAgeGroup, getAge } from "../../utils";

import badgeIcon from "../../icons/badgeIconOrange.svg";
import tickIconWhite from "../../icons/tickIconWhite.svg";
import bookIcon from "../../icons/bookIconBlue.svg";
import pouchMoney from "../../icons/moneyBagIconGrey.svg";
import cycleIconGrey from "../../icons/cycleIconBlue.svg";
import watchIconGrey from "../../icons/watchIconGrey.svg";
import infoIcon from "../../icons/infoIconGrey.svg";

import whatsappIcon from "../../icons/whatsappicon.svg";
import userIcon from "../../icons/userIcon.svg";
import addressIcon from "../../icons/addressIcon.svg";
import pinCodeIcon from "../../icons/pinCodeIcon.svg";
import childIcon from "../../icons/childIcon.svg";
import nameDetailsIcon from "../../icons/nameDetailsIcon.svg";
import calenderBlueIcon from "../../icons/calenderIconBlue.svg";

import celebrateIcon from "../../icons/celebrateIcon.svg";
import mobileIcon from "../../icons/mobileIcon.svg";
import privacyIconFill from "../../icons/privacyIconFill.svg";

import razorpay from "../../icons/razorpayIcon.svg";

import { FaArrowRightLong, FaPlus } from "react-icons/fa6";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

import { features, planDetails, stepsComplete } from "./constants";

import {
  addChildToRegisterDetails,
  flushRegisterDetails,
  login,
  nextStepRegister,
  setAlert,
  setRegisterDetails,
} from "../../reducers/mainSlice";

const Register = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    isLoggedIn,
    registrationStep,
    registerDetails: {
      mobileNumber,

      name,
      address,
      pinCode,
      childName,
      childDateOfBirth,
      children,
      contactNumber,

      selectedPlan,
      paymentDone,
      registrationDone,
      paymentStatus,
      selectedSubscription,
    },
  } = useSelector((store) => store.main);

  const [mobileNumberWhatsApp, setMobileNumberWhatsApp] = useState(true);
  const [password, setPassword] = useState("12345");
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const addChild = async () => {
    if (!childName && !childDateOfBirth && !children.length)
      return dispatch(
        setAlert({ text: "Add atleast 1 child", color: "#F75549" })
      );
    if (childName && childDateOfBirth) {
      dispatch(addChildToRegisterDetails());
    }
  };

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
    // dispatch(nextStepRegister());
    // stepsComplete.forEach((step, index) => {
    //   if (index !== 2) {
    //     step.isComplete = true;
    //     step.isOnStep = false;
    //   }
    // });
    // dispatch(setRegisterDetails({ paymentDone: true, paymentStatus: "Paid" }));
    // stepsComplete[2].isOnStep = true;

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
          window.scrollTo(0, 0);
          dispatch(nextStepRegister());
          stepsComplete.forEach((step, index) => {
            if (index !== 2) {
              step.isComplete = true;
              step.isOnStep = false;
            }
          });
          stepsComplete[2].isOnStep = true;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim().length)
      return dispatch(setAlert({ text: "Enter your name", color: "#ff0000" }));
    if (!children.length)
      return dispatch(
        setAlert({ text: "Add atleast 1 child", color: "#ff0000" })
      );
    if (
      !address.trim() ||
      !pinCode.trim() ||
      (!mobileNumberWhatsApp && !contactNumber.trim())
    )
      return dispatch(
        setAlert({ text: "Enter all the details", color: "#ff0000" })
      );
    await addChild(e);
    try {
      await axios.post(
        devUrls.signup,
        {
          name: name,
          mobile_number: mobileNumber,
          address,
          pin_code: pinCode,
          contact_number: mobileNumberWhatsApp ? mobileNumber : contactNumber,
          children: children.map((child) => {
            return {
              name: child.name,
              dob: getFormattedDate(child.dateOfBirth),
              age_group: getApiAgeGroup(child.dateOfBirth),
            };
          }),
        },
        { withCredentials: true }
      );
      dispatch(setRegisterDetails({ registrationDone: true }));
    } catch (err) {
      dispatch(setAlert({ text: err, color: "#ff0000" }));
      console.log(err);
    }
  };

  const finishRegistration = async () => {
    try {
      if (!password || password.length < 5)
        dispatch(
          setAlert({
            text: "Password should be atleast of 5 characters",
            color: "#F75549",
          })
        );
      await axios.post(
        devUrls.changePassword,
        { password },
        { withCredentials: true }
      );
      const response = await axios.get(devUrls.getUser, {
        withCredentials: true,
      });
      dispatch(login({ user: response.data.user }));
      navigate("/browse-library");
      dispatch(flushRegisterDetails());
      dispatch(setAlert({ text: "Registered successfully", color: "#14D027" }));
    } catch (err) {
      dispatch(setAlert({ text: err.response.data.message, color: "#ff0000" }));
      console.log(err);
    }
  };

  // useEffect(() => {
  //   if (stepsComplete[1].isComplete && registrationStep !== 1) {
  //     dispatch(nextStepRegister());
  //   }
  // }, []);

  return (
    <main className="mt-[90px] flex flex-col justify-center items-center gap-[30px]">
      {!registrationDone && (
        <section className="flex flex-col justify-center items-center max-w-[230px] text-center">
          <div className="mb-[20px]">
            <img
              className="w-[27px] h-[27px]"
              src={badgeIcon}
              alt="BadgeIcon"
            />
          </div>
          <p className="text-[15px] font-bold text-mainColor">
            Become a Brightr Club member
          </p>
          <p className="text-[13px] font-semibold">
            Illuminate your reading journey
          </p>
        </section>
      )}
      {registrationStep === 0 && !paymentDone && !registrationDone && (
        <>
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

          <form className="mt-[20px] flex flex-col items-center justify-between w-[282px] h-[36px] text-[12px] font-semibold">
            <span className="w-full text-mainColor mr-1 mb-2">
              Mobile Number
            </span>
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
        </>
      )}
      {!registrationDone && (
        <section className="mt-[30px] relative w-full max-w-[353px] flex flex-row justify-between items-center">
          {stepsComplete.map((step, index) => {
            return (
              <div
                key={index}
                className="flex flex-col justify-between items-center gap-[11px]"
              >
                <span
                  className={` ${
                    step.isOnStep || step.isComplete
                      ? "bg-mainColor"
                      : "bg-unHighlight"
                  } w-[16px] h-[16px] rounded-full grid place-items-center`}
                >
                  {step.isComplete && (
                    <img
                      className="w-[8px]"
                      src={tickIconWhite}
                      alt="Complete"
                    />
                  )}
                </span>
                <span className="text-[13px] text-mainColor font-semibold">
                  {step.title}
                </span>
              </div>
            );
          })}
          <div className="absolute top-[6px] left-1/2 -translate-x-1/2 h-[3px] w-[297px] bg-unHighlight -z-[1]">
            {stepsComplete[0].isComplete && !stepsComplete[2].isOnStep && (
              <div
                className={`${
                  stepsComplete[1].isComplete
                    ? "w-3/4 from-50%"
                    : "w-1/2 from-0%"
                } bg-gradient-to-r from-mainColor to-unHighlight h-full`}
              ></div>
            )}
            {stepsComplete[2].isOnStep && (
              <div className="w-full h-full bg-mainColor"></div>
            )}
          </div>
        </section>
      )}
      {registrationStep === 0 && !paymentDone && !registrationDone && (
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
                  <span className="text-[30px] font-extrabold">
                    {plan.books}
                  </span>
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
              <img className="w-[13px] mr-[5px]" src={infoIcon} alt="Info" />{" "}
              The price mentioned above is for a 6 month plan paid in full
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
      )}
      {registrationStep === 1 && paymentDone && !registrationDone && (
        <form onSubmit={handleSubmit} className="w-full max-w-[330px]">
          <div className="w-full p-[20px] flex flex-col justify-start items-start gap-[15px] bg-lightGrey rounded-[5px]">
            <div className="flex flex-col items-start justify-start gap-[5px]">
              <label htmlFor="whatsappNumberFormInput">
                <span className="flex flex-row items-center text-[13px] text-mainColor font-semibold">
                  <img
                    src={whatsappIcon}
                    className="w-[13px] mr-[5px]"
                    alt="WhatsApp"
                  />
                  WhatsApp Number
                </span>
              </label>
              <input
                className="w-[283px] h-[29px] text-[13px] p-[5px] rounded-[5px]"
                id="whatsappNumberFormInput"
                value={mobileNumber}
                readOnly={true}
                style={{
                  border: "1px solid #3B72FF",
                }}
                type="number"
              />
            </div>
            {!mobileNumberWhatsApp && (
              <div className="flex flex-col items-start justify-start gap-[5px]">
                <label htmlFor="mobileNumberFormInput">
                  <span className="flex flex-row items-center text-[13px] text-mainColor font-semibold">
                    <img
                      src={whatsappIcon}
                      className="w-[13px] mr-[5px]"
                      alt="WhatsApp"
                    />
                    Number
                  </span>
                </label>
                <input
                  className="w-[283px] h-[29px] text-[13px] p-[5px] rounded-[5px]"
                  id="mobileNumberFormInput"
                  value={mobileNumberWhatsApp ? mobileNumber : contactNumber}
                  readOnly={mobileNumberWhatsApp}
                  type="number"
                  onChange={({ target: { value } }) =>
                    dispatch(setRegisterDetails({ contactNumber: value }))
                  }
                />
              </div>
            )}
            <div
              className="mt-[10px] w-full flex flex-row justify-end items-center gap-[5px]"
              onClick={() => setMobileNumberWhatsApp(!mobileNumberWhatsApp)}
            >
              <span
                className={` flex items-center justify-center rounded-[5px] ${
                  mobileNumberWhatsApp
                    ? "bg-mainColor border-none"
                    : "border-[1px] border-mainColor bg-transparent"
                } w-[15px] h-[15px]`}
              >
                {mobileNumberWhatsApp && (
                  <img src={tickIconWhite} alt="Checked" />
                )}
              </span>
              <span className="text-[13px] text-mainColor font-semibold">
                Same as mobile number
              </span>
            </div>
            <div className="flex flex-col items-start justify-start gap-[5px]">
              <label htmlFor="parentFormInput">
                <span className="flex flex-row items-center text-[13px] text-mainColor font-semibold">
                  <img
                    src={userIcon}
                    className="w-[13px] mr-[5px]"
                    alt="WhatsApp"
                  />
                  Parent's Name
                </span>
              </label>
              <input
                className="w-[283px] h-[29px] text-[13px] p-[5px] rounded-[5px]"
                id="parentFormInput"
                style={{
                  border: "1px solid #3B72FF",
                }}
                type="text"
                value={name}
                onChange={({ target: { value } }) =>
                  dispatch(setRegisterDetails({ name: value }))
                }
              />
            </div>
            <div className="flex flex-col items-start justify-start gap-[5px]">
              <label htmlFor="addressFormInput">
                <span className="flex flex-row items-center text-[13px] text-mainColor font-semibold">
                  <img
                    src={addressIcon}
                    className="w-[13px] mr-[5px]"
                    alt="WhatsApp"
                  />
                  Address
                </span>
              </label>
              <textarea
                className="w-[283px] h-[60px] text-[13px] p-[5px] rounded-[5px]"
                style={{
                  border: "1px solid #3B72FF",
                }}
                id="addressFormInput"
                value={address}
                onChange={({ target: { value } }) =>
                  dispatch(setRegisterDetails({ address: value }))
                }
              />
            </div>
            <div className="flex flex-col items-start justify-start gap-[5px]">
              <label htmlFor="pincodeFormInput">
                <span className="flex flex-row items-center text-[13px] text-mainColor font-semibold">
                  <img
                    src={pinCodeIcon}
                    className="w-[13px] mr-[5px]"
                    alt="PinCode"
                  />
                  Pincode
                </span>
              </label>
              <input
                className="w-[283px] h-[29px] text-[13px] p-[5px] rounded-[5px]"
                id="pincodeFormInput"
                style={{
                  border: "1px solid #3B72FF",
                }}
                type="number"
                value={pinCode}
                onChange={({ target: { value } }) =>
                  dispatch(
                    setRegisterDetails({ pinCode: value.trim().slice(0, 6) })
                  )
                }
              />
            </div>
            {children.map((child, index) => {
              return (
                <div
                  key={index}
                  className="flex flex-col items-start justify-start gap-[5px]"
                >
                  <span className="mb-[5px] flex flex-row items-center text-[13px] text-mainColor font-semibold">
                    <img
                      src={childIcon}
                      className="w-[13px] mr-[5px]"
                      alt="WhatsApp"
                    />
                    Child
                  </span>
                  <div className="w-full flex flex-col items-start justify-start gap-[10px] bg-unHighlight p-[10px] rounded-[5px]">
                    <div className="flex flex-col items-start justify-start gap-[5px]">
                      <label htmlFor="childNameFormInput">
                        <span className="flex flex-row items-center text-[13px] text-mainColor font-semibold">
                          <img
                            src={nameDetailsIcon}
                            className="w-[13px] mr-[5px]"
                            alt="WhatsApp"
                          />
                          Name
                        </span>
                      </label>
                      <div className="w-[263px] h-[29px] text-[13px] p-[5px] rounded-[5px]">
                        {child.name}
                      </div>
                    </div>
                    <div className="flex flex-col items-start justify-start gap-[5px]">
                      <label htmlFor="childDOBFormInputFirst">
                        <span className="flex flex-row items-center text-[13px] text-mainColor font-semibold">
                          <img
                            src={calenderBlueIcon}
                            className="w-[13px] mr-[5px]"
                            alt="WhatsApp"
                          />
                          Date
                        </span>
                      </label>
                      <div className="w-[263px] h-[29px] text-[13px] p-[5px] rounded-[5px]">
                        {getAge(child.dateOfBirth)} years
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="flex flex-col items-start justify-start gap-[5px]">
              <span className="mb-[5px] flex flex-row items-center text-[13px] text-mainColor font-semibold">
                <img
                  src={childIcon}
                  className="w-[13px] mr-[5px]"
                  alt="WhatsApp"
                />
                Child
              </span>
              <div className="w-full flex flex-col items-start justify-start gap-[10px] bg-unHighlight p-[10px] rounded-[5px]">
                <div className="flex flex-col items-start justify-start gap-[5px]">
                  <label htmlFor="childNameFormInput">
                    <span className="flex flex-row items-center text-[13px] text-mainColor font-semibold">
                      <img
                        src={nameDetailsIcon}
                        className="w-[13px] mr-[5px]"
                        alt="WhatsApp"
                      />
                      Name
                    </span>
                  </label>
                  <input
                    className="w-[263px] h-[29px] text-[13px] p-[5px] rounded-[5px]"
                    id="childNameFormInputFirst"
                    style={{
                      border: "1px solid #3B72FF",
                    }}
                    type="text"
                    value={childName}
                    onChange={({ target: { value } }) =>
                      dispatch(setRegisterDetails({ childName: value }))
                    }
                  />
                </div>
                <div className="flex flex-col items-start justify-start gap-[5px]">
                  <label htmlFor="childDOBFormInputFirst">
                    <span className="flex flex-row items-center text-[13px] text-mainColor font-semibold">
                      <img
                        src={calenderBlueIcon}
                        className="w-[13px] mr-[5px]"
                        alt="WhatsApp"
                      />
                      Date
                    </span>
                  </label>
                  <input
                    className="w-[263px] h-[29px] text-[13px] p-[5px] rounded-[5px]"
                    id="childDOBFormInputFirst"
                    style={{
                      border: "1px solid #3B72FF",
                    }}
                    type="date"
                    value={childDateOfBirth}
                    onChange={({ target: { value } }) =>
                      dispatch(
                        setRegisterDetails({
                          childDateOfBirth: value.toString(),
                        })
                      )
                    }
                  />
                </div>
              </div>
            </div>
            <div
              className="w-full flex flex-row justify-start items-center gap-[10px] text-[10px] text-mainColor font-semibold cursor-pointer"
              onClick={() => {
                addChild();
              }}
            >
              <FaPlus /> Add Child
            </div>
          </div>
          <button
            type="submit"
            className="mt-[20px] flex flex-row justify-center items-center gap-[10px] max-w-[330px] w-full mx-auto px-[65px] py-[11px] text-white text-[12px] bg-mainColor rounded-[5px] cursor-pointer"
          >
            <img src={tickIconWhite} alt="Checked" />
            <span>Save</span>
          </button>
        </form>
      )}
      {registrationDone && (
        <section className="flex flex-col justify-center items-center w-full max-w-[330px] text-center">
          <div className="flex flex-col justify-center items-center gap-[10px]">
            <img
              className="w-[27px] h-[27px]"
              src={celebrateIcon}
              alt="Complete"
            />
            <p className="text-[15px] font-bold text-mainColor">
              Congratulations
            </p>
            <p className="text-[13px] font-semibold">
              Your details have been saved
            </p>
            <small>Thank you for subscribing</small>
          </div>
          <form className="mt-[40px] flex flex-col justify-start items-start bg-lightGrey rounded-[5px] p-[20px] gap-[15px]">
            <div className="flex flex-col items-start justify-start gap-[5px]">
              <label htmlFor="mobileNumber">
                <span className="flex flex-row items-center text-[13px] text-mainColor font-semibold">
                  <img
                    src={mobileIcon}
                    className="w-[13px] mr-[5px]"
                    alt="WhatsApp"
                  />
                  Mobile Number
                </span>
              </label>
              <input
                className="w-[283px] h-[29px] text-[13px] p-[5px] rounded-[5px]  bg-white"
                id="mobileNumber"
                value={mobileNumber}
                readOnly={true}
                disabled={true}
                style={{
                  border: "1px solid #3B72FF",
                }}
                type="number"
              />
            </div>
            <div className="flex flex-col items-start justify-start gap-[5px]">
              <label htmlFor="password">
                <span className="flex flex-row items-center text-[13px] text-mainColor font-semibold">
                  <img
                    src={privacyIconFill}
                    className="w-[13px] mr-[5px]"
                    alt="Password"
                  />
                  Password
                </span>
              </label>
              <input
                className="w-[283px] h-[29px] text-[13px] p-[5px] rounded-[5px] bg-white"
                id="password"
                style={{
                  border: "1px solid #3B72FF",
                }}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={({ target: { value } }) => setPassword(value)}
                disabled={!isEditing}
              />
              {showPassword ? (
                <AiFillEye
                  className="text-secondary text-[15px]"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <AiFillEyeInvisible
                  className="text-secondary text-[15px]"
                  onClick={() => setShowPassword(true)}
                />
              )}
              <p
                className="text-[13px] text-mainColor font-semibold"
                onClick={() => setIsEditing((_) => !_)}
              >
                {isEditing ? "Done" : "Edit"}
              </p>
            </div>
            <button
              type="submit"
              className="mt-[20px] flex flex-row justify-center items-center gap-[10px] max-w-[110px] w-full mx-auto p-[10px] text-white text-[12px] bg-secondary rounded-[5px] cursor-pointer"
              onClick={finishRegistration}
            >
              <span>Browse Library</span>
            </button>
          </form>
        </section>
      )}
    </main>
  );
};

export default Register;
