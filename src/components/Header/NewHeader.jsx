import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";

import { searchBarLinks } from "./constants";
import {
  load,
  stopLoad,
  setSearchedBookSet,
  setSearchQuery,
  setAge,
} from "../../reducers/bookSlice";
import { setAgeDropDown, setAlert } from "../../reducers/mainSlice";

import devUrls from "../../utils/devUrls";
import urls from "../../utils/urls";
import axios from "axios";

import logo from "../../icons/BrightR.Club.png";
// import { FaRegUser } from "react-icons/fa";

const maxAge = 13;

const NewHeader = () => {
  const location = useLocation();
  const { pathname } = location;
  const dispatch = useDispatch();
  const [renderAge, setRenderAge] = useState(false);
  const {
    main: { isLoggedIn },
    book: { age, searchQuery },
  } = useSelector((state) => state);
  const logOut = async () => {
    try {
      await axios.post(devUrls.logout, {}, { withCredentials: true });
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (pathname === "/browse-library") {
      setRenderAge(true);
    } else {
      setRenderAge(false);
    }
  }, [location]);
  useEffect(() => {
    if (localStorage.getItem("age")) {
      dispatch(setAge(localStorage.getItem("age")));
    } else {
      localStorage.setItem("age", "");
      dispatch(setAge(""));
    }
  }, []);
  return (
    <nav className="relative w-full mb-16 px-8 py-2 flex flex-col justify-start items-center bg-mainColor">
      <div className="w-full flex flex-row justify-between items-center">
        <Link to={"/"} className="flex items-center justify-center mr-4">
          <img src={logo} alt="Logo" />
        </Link>
        <div className="flex-1 max-w-[500px] ml-auto flex flex-row items-center justify-between">
          {searchBarLinks.map((link, index) => {
            return (
              <Link
                key={index}
                to={link.link}
                className={`${
                  pathname === link.link
                    ? "font-bold opacity-100"
                    : "opacity-75"
                } text-white`}
              >
                {link.title}
              </Link>
            );
          })}
          {isLoggedIn && (
            <Link
              className={`${
                pathname === "/your-library"
                  ? "font-bold opacity-100"
                  : "opacity-75"
              } text-white`}
              to={"/your-library"}
            >
              Your Library
            </Link>
          )}
          {!isLoggedIn && (
            <Link
              className={`bg-white font-bold rounded-md px-4 py-1`}
              to={"/login"}
            >
              Sign In
            </Link>
          )}
          {isLoggedIn && (
            <div className="text-white ml-4 cursor-pointer" onClick={logOut}>
              Log Out
            </div>
          )}
        </div>
      </div>
      {renderAge && (
        <div className="absolute top-full left-0 !w-full h-[50px] m-auto px-8 py-2 flex flex-row items-center justify-start gap-2">
          {Array(maxAge)
            .fill(true)
            .map((_, i) => {
              return (
                <div
                  key={i}
                  className={`px-2 py-[2px] rounded-md cursor-pointer font-bold ${
                    age == i.toString()
                      ? "bg-secondary text-white"
                      : "bg-mainColor"
                  }`}
                  onClick={() => {
                    if (age == i.toString()) {
                      dispatch(setAge(""));
                      localStorage.setItem("age", "");
                    } else {
                      dispatch(setAge(i));
                      localStorage.setItem("age", i.toString());
                    }
                  }}
                >
                  {i === 12 ? `${i}+ ` : `${i} - ${i + 1}`}
                </div>
              );
            })}
        </div>
      )}
    </nav>
  );
};

export default NewHeader;
