import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import devUrls from "../../utils/devUrls";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "swiper/css/virtual";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Virtual } from "swiper/modules";

import {
  flushRegisterDetails,
  setAlert,
  setRegisterDetails,
} from "../../reducers/mainSlice";

import { FaArrowRightLong, FaStar } from "react-icons/fa6";

import heroBg from "../../icons/Hero.png";

import bookInfo from "../../icons/bookQuestionIcon.svg";
import userIconHero from "../../icons/createAccountIcon.svg";
import readingListIcon from "../../icons/readingListIcon.svg";
import deliveryIconHero from "../../icons/deliveryIconHero.svg";
import bookIcon from "../../icons/bookIconOrange.svg";
import videoIcon from "../../icons/videoIcon.svg";
import communityIcon from "../../icons/communityIcon.svg";

import BookScroll from "./BookScroll";
import VideoScroll from "./VideoScroll";

import { planDetails, allFaqs } from "./constants";

import FAQ from "./FAQ";
import GoogleReviews from "./GoogleReviews";
import InstagramEmbed from "./InstagramEmbed";
import Segregation from "./Segregation";
import {
  setBooksRead,
  setCompleteAuthors,
  setCompleteSeries,
  setWishlist,
} from "../../reducers/wishlistSlice";

const Landing = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const {
    user,
    isLoggedIn,
    registerDetails: { mobileNumber },
  } = useSelector((store) => store.main);

  const loadHeavyComponents = useRef();
  const [loadVideos, setLoadVideos] = useState(false);
  const [faqs, setFaqs] = useState(allFaqs);

  const toggleFAQ = (index) => {
    setFaqs(
      faqs.map((faq, i) => {
        if (i === index) {
          faq.open = !faq.open;
        } else {
          faq.open = false;
        }

        return faq;
      })
    );
  };

  const getWishlist = async () => {
    try {
      const response = await axios.get(devUrls.getWishlist, {
        params: { guid: user.guid },
      });
      response.data.wishlists.sort((b, a) => {
        return b.date_added - a.date_added;
      });
      console.log(response.data.wishlists);
      dispatch(setWishlist({ wishlist: response.data.wishlists }));
    } catch (err) {
      console.log(err);
    }
  };

  const goToRegister = async (event) => {
    event.preventDefault();
    if (!mobileNumber) {
      dispatch(setAlert({ text: "Enter a Mobile Number", color: "#ff0000" }));
      return;
    } else if (mobileNumber.length !== 10) {
      dispatch(
        setAlert({ text: "Not a Valid Mobile Number", color: "#ff0000" })
      );
      return;
    }
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
      else {
        dispatch(setRegisterDetails({ mobileNumber, otpSent: true }));
        document.getElementById("cta").scrollIntoView({ behavior: "smooth" });
      }
    } catch (err) {
      dispatch(
        setAlert({ text: err.response?.data?.message, color: "#F75549" })
      );
      console.log(err);
    }
  };

  const loadHeavyComponentsFunction = () => {
    if (loadHeavyComponents.current)
      if (
        window.innerHeight + window.scrollY >=
        loadHeavyComponents.current.offsetTop - 500
      )
        setLoadVideos(true);
  };

  const getUserCompleteBooks = async () => {
    try {
      const response = await axios
        .get(devUrls.getUserCompleteBooks, {
          withCredentials: true,
          params: { guid: user.guid },
        })
        .then((res) => res.data)
        .catch((err) => console.log(err));
      if (response.result) {
        dispatch(setBooksRead(response.result.books));
        response.result.author.sort((a, b) => {
          return b.books_read - a.books_read;
        });
        dispatch(setCompleteAuthors(response.result.author));
        response.result.category.sort((a, b) => {
          return b.books_read - a.books_read;
        });
        dispatch(setCompleteSeries(response.result.category));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (location.hash) {
      let elem = document.getElementById(location.hash.slice(1));
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", loadHeavyComponentsFunction);
    return () => {
      window.removeEventListener("scroll", loadHeavyComponentsFunction);
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      getWishlist();
      getUserCompleteBooks();
    }
  }, []);

  return (
    <main className="mt-[50px]">
      <section className="relative h-[570px] w-full overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[120%] w-[120%] rotate-1"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundPosition: "50% 70%",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        />
        <div className="absolute top-0 left-0 bottom-0 right-0 bg-[#ffffff59]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[450px] w-full flex flex-col justify-center items-center bg-gradient-to-b from-[#ffffff0b] to-[#ffffff] to-80%">
          <div className="mt-auto mb-[10px] text-[15px] font-bold text-unHighlightDark">
            India's Most Loved
          </div>
          <div className="text-mainColor text-[19px] font-bold">
            Library
            <span className="px-2 text-secondary">-</span>
            Home Delivered
          </div>
          <div className="mb-[20px] text-[12px] font-bold text-unHighlightDark">
            <span>World class books</span>
            <span className="ml-2 pl-2 border-l-[2px] border-secondary">
              Premium Delivery Service
            </span>
            <span className="ml-2 pl-2 border-l-[2px] border-secondary">
              Curated Reading List
            </span>
          </div>
          {!isLoggedIn && (
            <form className="mt-[5px] mb-[10px] flex flex-row items-center justify-between w-[282px] h-[36px] border-[2px] text-[12px] font-semibold border-mainColor bg-[#ffffffcb] rounded-[5px] p-[4px]">
              <input
                className="flex-1 bg-transparent placeholder-mainColor"
                type="text"
                maxLength={10}
                value={mobileNumber}
                placeholder="Enter mobile number"
                onChange={({ target: { value } }) => {
                  if (value.match(/^[0-9]*$/)) {
                    dispatch(setRegisterDetails({ mobileNumber: value }));
                  }
                }}
              />
              <button
                className={`${
                  mobileNumber.length === 10 ? "bg-mainColor" : "bg-[#3b72ff85]"
                } grid place-items-center h-[28px] w-[52px] rounded-[5px]`}
                type="submit"
                value="Get Started"
                onClick={goToRegister}
              >
                <FaArrowRightLong className="w-[22px] text-white" />
              </button>
            </form>
          )}
        </div>
      </section>
      <section
        id="cta"
        className="p-[30px] flex flex-col justify-center items-center gap-[10px] bg-mainColor w-full"
      >
        <div>
          <img src={bookInfo} alt="BookIconInfo" />
        </div>
        <div className="text-[15px] text-white font-bold">
          <span>How It Works</span>
        </div>
        <div className="text-[13px] text-white font-semibold">
          <span>Unlocking the worls of books simplified!</span>
        </div>
        <div className="mt-[20px] w-full max-w-[400px] m-auto flex flex-row justify-between items-center gap-[10px]">
          <div className="flex flex-col justify-center items-center gap-[11px] text-white text-[11px]">
            <img src={userIconHero} alt="heroIconUser" />
            <span>Create Account</span>
          </div>
          <div className="flex flex-col justify-center items-center gap-[11px] text-white text-[11px]">
            <img src={readingListIcon} alt="heroIconReading" />
            <span>Build Readinglist</span>
          </div>
          <div className="flex flex-col justify-center items-center gap-[11px] text-white text-[11px]">
            <img src={deliveryIconHero} alt="heroIconDelivery" />
            <span>Doorstep Delivery</span>
          </div>
        </div>
      </section>
      <section className="p-[30px] flex flex-col justify-center items-center gap-[10px]">
        <div>
          <img className="w-[24px]" src={bookIcon} alt="BookIcon" />
        </div>
        <p className="text-[15px] font-bold text-mainColor">
          Explore our extensive library
        </p>
        <p className="text-center text-[13px] font-bold">
          Keep track of chat toppers across <br />
          Amazon, Goodreads, New York Times
        </p>
      </section>
      <BookScroll />
      <div className="mt-[30px] h-[36px] w-[108px] mx-auto bg-secondary rounded-[5px] flex items-center justify-center">
        <Link
          to={"/browse-library"}
          className="text-white text-[12px] font-bold"
        >
          Browse Library
        </Link>
      </div>
      <section className="mt-[30px] p-[30px] pb-[12px] flex flex-col justify-center items-center gap-[10px] bg-mainColor w-full">
        <div>
          <img className="w-[24px]" src={videoIcon} alt="BookIcon" />
        </div>
        <p className="text-[15px] font-bold text-white">
          Explore books through glimpses
        </p>
        <p className="text-center text-[13px] font-bold text-white">
          Discover through video summaries before you dive in!
        </p>
      </section>
      <div ref={loadHeavyComponents} />
      {loadVideos && <VideoScroll />}
      <section className="mt-[30px] pb-[30px] pt-0 flex flex-col justify-center items-center">
        <div>
          <img className="w-[24px]" src={bookIcon} alt="BookIcon" />
        </div>
        <p className="text-[15px] font-bold text-mainColor">
          Smart Segregation
        </p>
        <p className="text-[13px] font-bold">
          Find your next read from our diverse collection!
        </p>
      </section>
      <Segregation />
      <div className="mt-[30px] h-[36px] w-[108px] mx-auto bg-secondary rounded-[5px] flex items-center justify-center">
        <Link
          to={"/browse-library"}
          className="text-white text-[12px] font-bold"
        >
          Browse Library
        </Link>
      </div>
      <div></div>
      <section className="mt-[20px] py-[30px] flex flex-col pb-[12px] justify-center items-center bg-mainColor">
        <p className="text-[15px] font-bold text-white">
          Hear from our community
        </p>
        <p className="text-center text-[13px] font-bold text-white">
          Discover what users love about BrightR.club!
        </p>
        <div className="flex flex-row justify-center items-center gap-[10px]">
          <div className="flex flex-row justify-start items-center gap-[1px] mb-[20px] translate-y-[8.5px]">
            {Array(parseInt(5))
              .fill(true)
              .map((_, i) => {
                return (
                  <FaStar key={i} className="text-secondary text-[10px]" />
                );
              })}
          </div>
          <span className="text-[13px] text-white font-semibold">
            4.9 rating of 204 Reviews
          </span>
        </div>
      </section>
      <GoogleReviews />
      <section className="mt-[30px] px-[30px] py-[12px] flex flex-col justify-center items-center gap-[10px] w-full">
        <div>
          <img className="w-[24px]" src={communityIcon} alt="BookIcon" />
        </div>
        <p className="text-[15px] font-bold">Tales from our community</p>
        <p className="text-center text-[13px] font-bold ">
          Embark on journeys shared by fellow members
        </p>
      </section>
      {loadVideos && <InstagramEmbed />}
      <section className="mt-[16px] py-[30px] flex flex-col justify-center items-center gap-[10px] w-full bg-mainColor">
        <span className="text-[13px] text-white font-semibold">
          Select a plan based on the books you reed per week
        </span>
        <div className="flex flex-row justify-center items-center gap-[20px]">
          {planDetails.map((plan, index) => {
            return (
              <div
                key={index}
                className="relative flex flex-col justify-center items-center w-[74px] h-[132px] rounded-[5px] text-mainColor bg-white"
              >
                <div className="flex flex-col justify-between items-center">
                  <span className="h-[20px] mb-[10px]">
                    <img className="w-full" src={plan.icon} alt="PlanIcon" />
                  </span>
                  <span className="text-[10px] font-extrabold">
                    {plan.title}
                  </span>
                </div>
                <span className="text-[30px] font-extrabold">{plan.books}</span>
                <span className="text-[10px] font-semibold">Book/Week</span>
                {/* <span className="text-[13px] font-bold pt-[14px] ">
                  Rs.{plan.price}
                </span> */}

                {/* <div
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
                ></div> */}
              </div>
            );
          })}
        </div>
        <div className="mt-[30px] h-[36px] w-[108px] mx-auto bg-secondary rounded-[5px] flex items-center justify-center">
          <Link to={"/register"} className="text-white text-[12px] font-bold">
            Explore Plan
          </Link>
        </div>
      </section>
      <section className="mt-[20px] px-[30px] pb-[12px] flex flex-col justify-center items-center gap-[10px] w-full">
        <p className="text-[15px] font-bold text-mainColor">
          Answers to your questions
        </p>
        <p className="text-center text-[13px] font-bold">
          Find your solutions here
        </p>
      </section>
      <section id="faqs" className="w-[95%] max-w-[760px] mx-auto">
        {faqs.map((faq, index) => (
          <FAQ faq={faq} index={index} key={index} toggleFAQ={toggleFAQ} />
        ))}
      </section>
    </main>
  );
};

export default Landing;
