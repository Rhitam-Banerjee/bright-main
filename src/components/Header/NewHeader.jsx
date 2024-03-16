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

import { mobileNavLinks, searchBarLinks } from "./constants";
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

import logo from "../../icons/BrightR.svg";
import badgeIcon from "../../icons/badgeIcon.svg";
import bookIcon from "../../icons/bookIconOutline.svg";

// import { FaRegUser } from "react-icons/fa";
import { IoClose, IoMenu } from "react-icons/io5";

const maxAge = 13;

const NewHeader = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = location;
  const [renderAge, setRenderAge] = useState(false);
  const [hamburgerClicked, setHamburgerClicked] = useState(false);
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

  const handleHamburgerclick = () => {
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("hamburger")) {
        if (!hamburgerClicked) {
          setHamburgerClicked(true);
          return true;
        }
      }
      setHamburgerClicked(false);
      return true;
    });
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
        renderAge ? "h-[130px]" : "h-max"
      } top-0 left-0 w-full mb-16 px-[13px] py-[14px] flex flex-col justify-start items-center bg-mainColor z-[99]`}
    >
      <div className="w-full flex flex-row justify-between items-center">
        <div
          className="hamburger relative hidden md:block mr-[20px] text-[30px] text-white transition-all z-[999] cursor-pointer"
          onClick={() => handleHamburgerclick()}
        >
          {hamburgerClicked ? (
            <IoClose className="text-secondary pointer-events-none" />
          ) : (
            <IoMenu className="pointer-events-none" />
          )}
        </div>
        <div
          className={` ${
            hamburgerClicked
              ? "[clip-path:circle(100%)]"
              : "[clip-path:circle(0%_at_30px_33px)]"
          } hidden md:flex flex-col fixed top-0 left-0 h-max w-[50%] bg-white z-[990] gap-[20px] transition-all duration-300 pt-[70px] shadow-2xl`}
        >
          {mobileNavLinks.map((items, index) => {
            return items.title !== "FAQs" ? (
              <Link key={index} to={`${items.link}`} className="w-full">
                <div className="w-full pb-[20px] text-mainColor border-b-[1px] border-secondary">
                  <span className="p-[20px] text-[14px] font-bold">
                    {items.title}
                  </span>
                </div>
              </Link>
            ) : (
              <div
                className="w-full cursor-pointer"
                onClick={() => {
                  if (pathname === "/") {
                    document
                      .getElementById("faqs")
                      .scrollIntoView({ behavior: "smooth" });
                  } else {
                    navigate("/#faqs");
                  }
                }}
              >
                <div className="w-full pb-[20px] text-mainColor border-b-[1px] border-secondary">
                  <span className="p-[20px] text-[14px] font-bold">
                    {items.title}
                  </span>
                </div>
              </div>
            );
          })}
          {isLoggedIn ? (
            <div
              className="p-[20px] pt-0 text-[14px] font-bold w-full text-mainColor"
              onClick={logOut}
            >
              Log-Out
            </div>
          ) : (
            <Link
              to={"/login"}
              className="p-[20px] pt-0 text-[14px] font-bold w-full text-mainColor"
            >
              Sign In
            </Link>
          )}
        </div>
        <Link
          to={"/"}
          className="flex md:flex-1 mr-auto items-center justify-center"
        >
          <img className="w-[100px] mr-auto" src={logo} alt="Logo" />
        </Link>
        <div
          className={`flex flex-1 max-w-[500px] ml-auto flex-row items-center justify-between`}
        >
          {searchBarLinks.map((link, index) => {
            return (
              <Link
                key={index}
                to={link.link}
                className={`md:hidden ${
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
              <img className="w-[18px] h-[18px]" src={bookIcon} alt="" />
            </Link>
          )}
          {!isLoggedIn && (
            <Link
              className={`ml-auto flex flex-row justify-center items-center bg-secondary text-white font-bold rounded-md px-[7px] py-[10px] gap-[7px]`}
              to={"/login"}
            >
              <span>
                <img src={badgeIcon} alt="Badge" />
              </span>
              <span>Subscribe</span>
            </Link>
          )}
        </div>
      </div>
      {renderAge && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 !w-full px-8 md:px-3 py-2 flex flex-row items-center justify-start gap-[15px] bg-gradient-to-b from-mainColorLight to-white">
          <Swiper
            slidesPerView={"auto"}
            grabCursor={true}
            centeredSlides={true}
            centeredSlidesBounds={true}
            freeMode={true}
            navigation={true}
            modules={[FreeMode, Navigation, Virtual]}
            className="mySwiper no-slider-arrow"
          >
            {Array(maxAge)
              .fill(true)
              .map((_, i) => {
                return (
                  <SwiperSlide key={i}>
                    <div
                      key={i}
                      className={`flex flex-col items-center justify-center px-[16px] py-[5px] rounded-md cursor-pointer font-bold ${
                        age.toString() == i.toString()
                          ? "bg-mainColor text-white"
                          : "bg-unHighlight text-unHighlightDark border-[1px] border-unHighlightDark"
                      }`}
                      onClick={() => {
                        if (age.toString() == i.toString()) {
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
