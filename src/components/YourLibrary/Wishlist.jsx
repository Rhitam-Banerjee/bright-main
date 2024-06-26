import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import devUrls from "../../utils/devUrls";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "swiper/css/virtual";
import { FreeMode, Navigation, Virtual } from "swiper/modules";

import heartFillBlue from "../../icons/heartfill.svg";

// import BookSlider from "../BookSlider";
import BookSlider from "./BookSlider";

const Wishlist = () => {
  const { wishlist } = useSelector((store) => store.wishlist);

  return (
    <section className="mt-[20px] w-full">
      <div className="flex flex-row justify-start items-center">
        <img
          className="w-[15px] mr-[5px]"
          src={heartFillBlue}
          alt="heartIcon"
        />
        <span className="text-[12px] font-bold">Wishlist</span>
      </div>
      <Swiper
        slidesPerView={"auto"}
        grabCursor={true}
        freeMode={true}
        navigation={true}
        modules={[FreeMode, Navigation, Virtual]}
        className="mySwiper no-slider-arrow"
      >
        {wishlist?.map((book, index) => {
          return (
            <SwiperSlide key={index}>
              <BookSlider book={book} section={"wishlist"} />
            </SwiperSlide>
          );
        })}
      </Swiper>
      {/* <BookSlider books={wishlist} showTags={false} overlay="wishlist" /> */}
    </section>
  );
};

export default Wishlist;
