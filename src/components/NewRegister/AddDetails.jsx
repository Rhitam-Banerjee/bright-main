import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import devUrls from "../../utils/devUrls";

import whatsappIcon from "../../icons/whatsappicon.svg";
import userIcon from "../../icons/userIcon.svg";
import addressIcon from "../../icons/addressIcon.svg";
import pinCodeIcon from "../../icons/pinCodeIcon.svg";
import childIcon from "../../icons/childIcon.svg";
import nameDetailsIcon from "../../icons/nameDetailsIcon.svg";
import calenderBlueIcon from "../../icons/calenderIconBlue.svg";

import badgeIcon from "../../icons/badgeIconOrange.svg";
import tickIconWhite from "../../icons/tickIconWhite.svg";

import { FaArrowRightLong, FaPlus } from "react-icons/fa6";

import { getAge, getApiAgeGroup, getFormattedDate } from "../../utils";

import {
  addChildToRegisterDetails,
  setAlert,
  setRegisterDetails,
} from "../../reducers/mainSlice";

const AddDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    registerDetails: {
      mobileNumber,

      name,
      address,
      pinCode,
      childName,
      childDateOfBirth,
      children,
      contactNumber,
    },
  } = useSelector((store) => store.main);

  const [mobileNumberWhatsApp, setMobileNumberWhatsApp] = useState(true);

  const addChild = async () => {
    if (!childName && !childDateOfBirth && !children.length)
      return dispatch(
        setAlert({ text: "Add atleast 1 child", color: "#F75549" })
      );
    if (childName && childDateOfBirth) {
      dispatch(addChildToRegisterDetails());
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

  return (
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
            {mobileNumberWhatsApp && <img src={tickIconWhite} alt="Checked" />}
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
            <img src={childIcon} className="w-[13px] mr-[5px]" alt="WhatsApp" />
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
  );
};

export default AddDetails;
