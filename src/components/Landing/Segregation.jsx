import React from "react";

import { segregation } from "./constants";

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import bookIconOrange from "../../icons/bookIconOrange.svg";
import { FaAmazon } from "react-icons/fa6";

const Segregation = () => {
  return (
    <Swiper
      slidesPerView={"auto"}
      autoplay={{
        delay: 3000,
        disableOnInteraction: true,
      }}
      loop={true}
      navigation={true}
      modules={[Navigation, Autoplay]}
      className="mySwiper pb-[14px] no-slider-arrow"
    >
      {segregation.map((tabs, index) => {
        return (
          <SwiperSlide
            key={index}
            className="!max-w-[180px] !h-auto rounded-lg bg-mainColor"
          >
            <div className="relative w-[180px] h-[80px] flex flex-row justify-start items-center gap-2 overflow-hidden rounded-md">
              <div className="p-2 h-full rounded-lg flex flex-col items-start justify-center cursor-pointer">
                <div className="text-white font-bold text-[12px]">
                  {tabs.name}
                </div>
                <div className="flex flex-col mt-4 text-[12px] text-white gap-0">
                  <div className="flex flex-row items-center justify-start gap-1">
                    <img src={bookIconOrange} alt="BooksCount" />
                    <p className="text-[8px]">{tabs.books} Books</p>
                  </div>
                  <div className="flex flex-row items-center justify-start gap-1">
                    <FaAmazon className="w-[8px] translate-y-[1px]" />
                    <p>
                      <span className="text-[8px]">{tabs.reviews}</span>
                      <span className="pl-[2px] text-[8px]">Reviews</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="">
                <img
                  className="absolute !bottom-0 right-[0px] w-[73px] !z-10 saturate-0"
                  src={tabs.icon}
                  alt="TabsIcon"
                />
              </div>
              <div
                className={`${
                  tabs.circleVisible ? "" : "hidden"
                } absolute -bottom-[30px] right-[-20px] h-[102px] w-[102px] rounded-full bg-[#ffffff70]`}
              />
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default Segregation;
