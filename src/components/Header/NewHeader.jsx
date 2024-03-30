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
import searchIcon from "../../icons/searchIcon.svg";
import pricingIcon from "../../icons/pricingIcon.svg";
import logInIcon from "../../icons/loginIcon.svg";
import logOutIcon from "../../icons/logOutIcon.svg";

// import { FaRegUser } from "react-icons/fa";
import { IoClose, IoMenu } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import { FaSearch } from "react-icons/fa";
import { searchReset, setSearchText } from "../../reducers/mainSlice";

const maxAge = 13;

const NewHeader = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = location;
  const [renderAge, setRenderAge] = useState(false);
  const [hamburgerClicked, setHamburgerClicked] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const {
    main: { isLoggedIn, searchText, registrationStep },
    book: { age },
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
    if (pathname.includes("/browse-library") || pathname.includes("/search")) {
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
      className={`fixed top-0 left-0 w-full mb-16 px-[13px] py-[14px] flex flex-col justify-start items-center bg-mainColor z-[99]`}
    >
      <div className="w-full flex flex-row justify-between items-center gap-[10px]">
        <div
          className="hamburger relative hidden md:block text-[30px] text-white transition-all z-[999] cursor-pointer"
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
          } hidden p-[10px] md:flex flex-col fixed top-0 left-0 h-max w-[50%] bg-white z-[990] gap-[20px] transition-all duration-300 pt-[70px] shadow-customShadowDark rounded-br-[10px]`}
        >
          {mobileNavLinks.map((items, index) => {
            return items.title !== "FAQs" ? (
              <Link key={index} to={`${items.link}`} className="w-full">
                <div className="w-full pb-[20px] text-mainColor border-b-[2px] border-secondary">
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
                <div className="w-full pb-[20px] text-mainColor border-b-[2px] border-secondary">
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
          to={isLoggedIn ? "/browse-library" : "/"}
          className="flex w-max mx-auto items-center justify-center"
        >
          <img className="w-[100px] mr-auto" src={logo} alt="Logo" />
        </Link>
        <div
          className={`flex flex-1 ml-auto flex-row items-center justify-between gap-[50px] md:gap-[10px]`}
        >
          <form
            onSubmit={() => {
              navigate(`/search/${searchText}`);
            }}
            className="md:hidden mx-auto p-[10px] h-[34px] max-w-[530px] flex-1 flex flex-row justify-start items-center border-[1px] border-white bg-[#ffffff36] rounded-[5px]"
          >
            <button
              className="w-max h-full grid place-items-center mr-[10px]"
              type="submit"
            >
              <CiSearch className="text-[14px] text-white" />
            </button>
            <input
              type="text"
              className="w-full h-full bg-transparent placeholder-white text-[13px] text-white"
              placeholder="Search Book,Author,Series,Genre..."
              value={searchText}
              onChange={({ target: { value } }) => {
                dispatch(setSearchText(value));
              }}
            />
          </form>

          <div className="md:hidden ml-auto w-max flex flex-row items-center justify-start gap-[60px] md:!gap-[50px]">
            {searchBarLinks.map((link, index) => {
              return (
                <Link
                  key={index}
                  to={link.link}
                  className={`${
                    pathname === link.link
                      ? "font-bold opacity-100"
                      : "opacity-75"
                  } text-white flex flex-row items-center justify-center gap-[10px] `}
                >
                  <img className="w-[14px]" src={link.icon} alt="LinkIcon" />
                  <span>{link.title}</span>
                </Link>
              );
            })}
          </div>
          {isLoggedIn ? (
            <>
              <Link
                className="md:hidden flex flex-row justify-start items-center text-[13px] text-white"
                to={"/your-library"}
              >
                <img
                  className="w-[14px] mr-[10px]"
                  src={bookIcon}
                  alt="LoginIcon"
                />
                <span>My Library</span>
              </Link>
              <Link className="hidden md:grid" to={"/your-library"}>
                <img
                  className="w-[15px] ml-[10px]"
                  src={bookIcon}
                  alt="LoginIcon"
                />
              </Link>

              <div
                className="flex md:hidden flex-row justify-start items-center text-[13px] text-white"
                onClick={logOut}
              >
                <img
                  className="w-[14px] mr-[10px]"
                  src={logOutIcon}
                  alt="LoginIcon"
                />
                <span>Log out</span>
              </div>
            </>
          ) : (
            <>
              <Link
                to={"/register"}
                className="md:hidden flex flex-row justify-start items-center text-[13px] text-white"
              >
                <img
                  className="w-[14px] mr-[10px]"
                  src={pricingIcon}
                  alt="LoginIcon"
                />
                <span>Pricing</span>
              </Link>
              <Link
                to={"/login"}
                className="md:hidden flex flex-row justify-start items-center text-[13px] text-white"
              >
                <img
                  className="w-[14px] mr-[10px]"
                  src={logInIcon}
                  alt="LoginIcon"
                />
                <span>Log in</span>
              </Link>
            </>
          )}
          {!isLoggedIn &&
            (pathname !== "/login" ||
              (pathname !== "/register" && registrationStep === 1)) && (
              <Link
                className="ml-auto hidden md:flex flex-row justify-center items-center bg-secondary text-white font-bold rounded-[5px] p-[10px] gap-[7px]"
                to={"/register"}
              >
                <span className="!w-[15px]">
                  <img className="!w-[15px]" src={badgeIcon} alt="Badge" />
                </span>
                <span className="text-[13px]">Subscribe</span>
              </Link>
            )}
        </div>
      </div>
      {(pathname === "/browse-library" || pathname.includes("/search")) && (
        <form
          onSubmit={() => {
            navigate(`/search/${searchText}`);
          }}
          className="absolute bottom-0 md:-bottom-[50px] left-1/2 -translate-x-1/2 !w-full h-[50px] py-[10px] px-[20px] hidden md:flex flex-row justify-start items-center bg-white gap-[10px]"
        >
          <button
            className="w-max h-full grid place-items-center mr-[10px]"
            type="submit"
          >
            <CiSearch className="text-[14px] text-mainColor" />
          </button>
          <input
            type="text"
            className="w-full h-full bg-transparent placeholder-mainColor text-[13px] text-white"
            placeholder="Search Book,Author,Series,Genre..."
            value={searchText}
            onChange={({ target: { value } }) => {
              dispatch(setSearchText(value));
            }}
          />
        </form>
      )}
      {renderAge && (
        <div className="absolute -bottom-[60px] md:-bottom-[110px] left-1/2 -translate-x-1/2 !w-full px-8 md:px-3 py-2 flex flex-row items-center justify-start gap-[15px] bg-gradient-to-b from-mainColorLight to-white">
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
