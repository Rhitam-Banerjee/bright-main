import React from "react";

import "swiper/css";
// import "swiper/css/autoplay";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Autoplay } from "swiper/modules";
import { Navigation } from "swiper/modules";

import bookIconOrange from "../../icons/bookIconOrange.svg";
import clockIcon from "../../icons/clock.svg";
import { FaYoutube } from "react-icons/fa";

import { bookVideos } from "./constants";

const VideoScroll = () => {
  return (
    <div className="pb-[30px] bg-mainColor">
      <Swiper
        slidesPerView={"auto"}
        loop={true}
        navigation={true}
        modules={[Navigation]}
        className="mySwiper landingSwiperArrow pb-[14px] px-[50px] mx-auto"
      >
        {bookVideos.map((book, index) => {
          return (
            <SwiperSlide key={index} className="h-full w-full">
              <div className="h-[150px]">
                <iframe
                  className="h-[150px] w-[300px] flex bg-cover bg-no-repeat rounded-[5px] z-0"
                  src={`https://www.youtube.com/embed/${book.yt_links}?wmode=opaque`}
                  title="YouTube book player"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen={true}
                ></iframe>
              </div>
              <div className="mt-[9px] px-[24px] py-[7px] flex flex-row text-[9px] font-semibold justify-center items-center bg-lightGrey rounded-[5px]">
                <span className="flex flex-row items-center">
                  <img
                    className="mr-[8px]"
                    src={bookIconOrange}
                    alt="bookIcon"
                  />
                  {`${book.name
                    .replace(/ *\([^)]*\) */g, "")
                    .substring(0, 16)}...`}
                </span>
                <span className="px-2 mx-2 border-l-[1px] border-r-[1px] border-secondary flex flex-row items-center">
                  <img
                    className="-translate-y-[1px] mr-[8px]"
                    src={clockIcon}
                    alt="Clock"
                  />
                  {book.duration.includes(":")
                    ? book.duration
                    : "0:" + book.duration}
                </span>
                <span className="flex flex-row items-center">
                  {book.views}
                  <FaYoutube className="w-[12px] -translate-y-[1px] mx-[5px] text-[#ff0000]" />{" "}
                  Views
                </span>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default VideoScroll;
