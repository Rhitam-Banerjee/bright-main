import React from "react";

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import book1 from "../../icons/bookImage1.svg";
import book2 from "../../icons/bookImage2.svg";
import book3 from "../../icons/bookImage3.svg";
import book4 from "../../icons/bookImage4.svg";
import book5 from "../../icons/bookImage5.svg";

const BookScroll = () => {
  return (
    <Swiper
      slidesPerView={"auto"}
      autoplay={{
        delay: 2500,
        disableOnInteraction: true,
      }}
      loop={true}
      navigation={true}
      modules={[Navigation, Autoplay]}
      className="mySwiper pb-[14px] no-slider-arrow"
    >
      <SwiperSlide>
        <img className="w-[150px]" src={book1} alt="BookImage" />
      </SwiperSlide>
      <SwiperSlide>
        <img className="w-[150px]" src={book2} alt="BookImage" />
      </SwiperSlide>
      <SwiperSlide>
        <img className="w-[150px]" src={book3} alt="BookImage" />
      </SwiperSlide>
      <SwiperSlide>
        <img className="w-[150px]" src={book4} alt="BookImage" />
      </SwiperSlide>
      <SwiperSlide>
        <img className="w-[150px]" src={book5} alt="BookImage" />
      </SwiperSlide>
      <SwiperSlide>
        <img className="w-[150px]" src={book1} alt="BookImage" />
      </SwiperSlide>
      <SwiperSlide>
        <img className="w-[150px]" src={book2} alt="BookImage" />
      </SwiperSlide>
      <SwiperSlide>
        <img className="w-[150px]" src={book3} alt="BookImage" />
      </SwiperSlide>
      <SwiperSlide>
        <img className="w-[150px]" src={book4} alt="BookImage" />
      </SwiperSlide>
      <SwiperSlide>
        <img className="w-[150px]" src={book5} alt="BookImage" />
      </SwiperSlide>
    </Swiper>
  );
};

export default BookScroll;
