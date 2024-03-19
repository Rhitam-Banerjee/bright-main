import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import devUrls from "../../utils/devUrls";

import userIcon from "../../icons/userIcon.svg";
import mobileIcon from "../../icons/mobileIcon.svg";
import privacyIconFill from "../../icons/privacyIconFill.svg";

import {
  flushRegisterDetails,
  login,
  setAlert,
  setRegisterDetails,
} from "../../reducers/mainSlice";

import { stepsComplete } from "../NewRegister/constants";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mobileNumber, password } = useSelector(
    (state) => state.main.registerDetails
  );
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        devUrls.login,
        { password, mobile_number: mobileNumber },
        { withCredentials: true }
      );
      dispatch(login({ user: response.data.user }));
      navigate("/your-library");
    } catch (err) {
      dispatch(setAlert({ text: err.response.data.message, color: "#F75549" }));
      if (
        err.response?.data?.message ===
        "No User with that mobile number exists!"
      )
        navigate("/register");
      console.log(err);
    }
  };

  useEffect(() => {
    dispatch(flushRegisterDetails());
    stepsComplete.forEach((step) => {
      step.isComplete = false;
      step.isOnStep = false;
    });
    stepsComplete[0].isOnStep = true;
  }, []);

  return (
    <section className="mt-[100px] flex flex-col justify-center items-center w-full mx-auto max-w-[330px] text-center">
      <div className="flex flex-col justify-center items-center gap-[10px]">
        <img className="w-[27px] h-[27px]" src={userIcon} alt="User Icon" />
        <p className="text-[15px] font-bold text-mainColor">LogIn</p>
      </div>
      <form className="mt-[20px] flex flex-col justify-start items-start bg-lightGrey rounded-[5px] p-[20px] gap-[15px]">
        <div className="flex flex-col items-start justify-start gap-[5px]">
          <label htmlFor="whatsappNumberFormInput">
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
            className="w-[283px] h-[29px] text-[13px] p-[5px] rounded-[5px]"
            id="whatsappNumberFormInput"
            value={mobileNumber}
            style={{
              border: "1px solid #3B72FF",
            }}
            type="number"
            onChange={({ target: { value } }) =>
              dispatch(setRegisterDetails({ mobileNumber: value.trim() }))
            }
          />
        </div>
        <div className="flex flex-col items-start justify-start gap-[5px]">
          <label htmlFor="whatsappNumberFormInput">
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
            className="w-[283px] h-[29px] text-[13px] p-[5px] rounded-[5px]"
            id="whatsappNumberFormInput"
            value={password}
            style={{
              border: "1px solid #3B72FF",
            }}
            type={showPassword ? "text" : "password"}
            onChange={({ target: { value } }) =>
              dispatch(setRegisterDetails({ password: value.trim() }))
            }
            autoComplete="new-password"
          />
          {showPassword ? (
            <AiFillEye onClick={() => setShowPassword(false)} />
          ) : (
            <AiFillEyeInvisible onClick={() => setShowPassword(true)} />
          )}
        </div>
        <Link to="/forgot-password" className="secondary-text">
          Forgot Password?
        </Link>
        <button
          type="submit"
          className="mt-[20px] flex flex-row justify-center items-center gap-[10px] max-w-[110px] w-full mx-auto p-[10px] text-white text-[12px] bg-secondary rounded-[5px] cursor-pointer"
          onClick={handleSubmit}
        >
          <span>Login</span>
        </button>
      </form>
    </section>
  );
};

export default Login;
