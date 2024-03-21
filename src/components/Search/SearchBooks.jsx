import React from "react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "swiper/css/virtual";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Virtual } from "swiper/modules";
import { NewBook } from "../Book";

const SearchBooks = ({ data }) => {
  return data?.length > 0 ? (
    <section className="pl-8 md:px-2 pb-[10px]">
      <h1 className="flex font-bold text-[12px] pb-[10px]">Books</h1>
      <Swiper
        slidesPerView={"auto"}
        grabCursor={true}
        // centeredSlides={true}
        // centeredSlidesBounds={true}
        freeMode={true}
        navigation={true}
        modules={[FreeMode, Navigation, Virtual]}
        className="mySwiper pb-[14px] no-slider-arrow"
      >
        {data?.map((book, index) => {
          return (
            <SwiperSlide
              key={index}
              className="relative flex flex-col !w-[150px]"
              virtualIndex={index}
            >
              <NewBook key={index} book={book} />
            </SwiperSlide>
          );
        })}
      </Swiper>
      <div className="h-[0.5px] w-[calc(100%_-_50px)] md:w-full mr-auto md:mx-auto bg-secondary" />
    </section>
  ) : (
    <span>No Books of This Name</span>
  );
};

export default SearchBooks;
