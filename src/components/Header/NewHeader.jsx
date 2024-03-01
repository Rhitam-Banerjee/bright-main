import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "swiper/css/virtual";
import { FreeMode, Navigation, Virtual } from "swiper/modules";

import { searchBarLinks } from "./constants";
import {
  load,
  stopLoad,
  setSearchedBookSet,
  setSearchQuery,
  setAge,
} from "../../reducers/bookSlice";

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
      localStorage.setItem("age", 2);
      dispatch(setAge(2));
    }
  }, []);
  return (
    <nav
      className={`fixed ${
        renderAge ? "h-[110px]" : "h-[50px]"
      } top-0 left-0 w-full mb-16 px-8 py-2 flex flex-col justify-start items-center bg-mainColor z-[999]`}
    >
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
        <div className="absolute bottom-0 left-0 !w-full px-8 md:px-3 py-2 flex flex-row items-center justify-start gap-[15px] bg-gradient-to-b from-mainColorLight to-white">
          <Swiper
            slidesPerView={"auto"}
            grabCursor={true}
            centeredSlides={true}
            centeredSlidesBounds={true}
            freeMode={true}
            navigation={true}
            modules={[FreeMode, Navigation, Virtual]}
            className="mySwiper !ml-0 no-slider-arrow"
          >
            {Array(maxAge)
              .fill(true)
              .map((_, i) => {
                return (
                  <SwiperSlide key={i}>
                    <div
                      key={i}
                      className={`flex flex-col items-center justify-center px-[16px] py-[5px] rounded-md cursor-pointer font-bold ${
                        age == i.toString()
                          ? "bg-mainColor text-white"
                          : "bg-unHighlight text-unHighlightDark border-[1px] border-unHighlightDark"
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
                      <div className="text-[12px]">
                        {i === 12 ? `${i}+ ` : `${i} - ${i + 1}`}
                      </div>
                      <div className="text-[12px]">Years</div>
                    </div>
                  </SwiperSlide>
                );
              })}
          </Swiper>
        </div>
      )}
    </nav>
  );
};

export default NewHeader;
