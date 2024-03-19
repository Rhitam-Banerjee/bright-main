import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import devUrls from "../../utils/devUrls";

import { getFormattedDate, getApiAgeGroup, getAge } from "../../utils";

import tickIconWhite from "../../icons/tickIconWhite.svg";

import celebrateIcon from "../../icons/celebrateIcon.svg";
import mobileIcon from "../../icons/mobileIcon.svg";
import privacyIconFill from "../../icons/privacyIconFill.svg";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

import { registerFlow, stepsComplete } from "./constants";

import {
  flushRegisterDetails,
  login,
  setAlert,
} from "../../reducers/mainSlice";
import Features from "./Features";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    registrationStep,
    registerDetails: {
      mobileNumber,

      paymentDone,
      registrationDone,
      paymentStatus,
    },
  } = useSelector((store) => store.main);

  const [password, setPassword] = useState("12345");
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  useEffect(() => {
    console.log(registrationStep);
    console.log(paymentStatus);
    console.log(paymentDone);
  }, [registrationStep, paymentDone, paymentStatus]);

  return (
    <main className="mt-[90px] flex flex-col justify-center items-center gap-[30px]">
      {!registrationDone && (
        <>
          <Features />
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
          {registerFlow[registrationStep].component}
        </>
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
              <span>Finish</span>
            </button>
          </form>
        </section>
      )}
    </main>
  );
};

export default Register;
