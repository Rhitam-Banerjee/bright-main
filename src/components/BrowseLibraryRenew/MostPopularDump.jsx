import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import axios from "axios";
import urls from "../../utils/urls";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "swiper/css/virtual";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Virtual } from "swiper/modules";

import NewBook from "./NewBook";

const MostPopularDump = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [popularBooks, setPopularBooks] = useState([]);
  const { age } = useSelector((store) => store.book);

  const getBooks = async () => {
    try {
      const response = await axios
        .get(
          age === "" || age === undefined
            ? `${urls.getPopularBooks}`
            : `${urls.getPopularBooks}?age=${age}`
        )
        .then((res) => res.data)
        .catch((err) => console.log(err));
      setPopularBooks(response.book_set[0].books);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getBooks();
  }, [age]);
  return (
    !isLoading && (
      <section className="pl-8 md:px-2 pb-[14px]">
        <h1 className="font-bold text-[12px] pb-[10px]">
          Chart Topping - NewYork Times
        </h1>
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
          {popularBooks?.map((book, index) => {
            return (
              <SwiperSlide
                key={index}
                className="flex flex-col !w-[150px]"
                virtualIndex={index}
              >
                <NewBook book={book} />
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div className="mt-[14px] h-[0.5px] w-[calc(100%_-_50px)] mr-auto md:mx-auto bg-unHighlight" />
      </section>
    )
  );
};

export default MostPopularDump;
