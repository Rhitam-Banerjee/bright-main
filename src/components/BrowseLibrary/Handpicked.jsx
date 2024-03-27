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

import { NewBook } from "../Book";

const HandPicked = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [handPickedBooks, setHandPickedBooks] = useState([]);
  const { age } = useSelector((store) => store.book);

  const getBooks = async () => {
    try {
      const response = await axios
        .get(
          age === "" || age === undefined
            ? `${urls.getHandpickedBooks}`
            : `${urls.getHandpickedBooks}?age=${age}`
        )
        .then((res) => res.data)
        .catch((err) => console.log(err));
      response.books.sort((a, b) => {
        return b.stocks_available - a.stocks_available;
      });
      setHandPickedBooks(response.books);
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
        <h1 className="flex font-bold text-[12px] pb-[10px]">
          Rare Selection
          <span className="border-l-[1px] border-secondary pl-2 ml-2">
            Our Library
          </span>
        </h1>
        <Swiper
          slidesPerView={"auto"}
          grabCursor={true}
          // centeredSlides={true}
          // centeredSlidesBounds={true}
          freeMode={true}
          navigation={true}
          modules={[FreeMode, Navigation, Virtual]}
          className="mySwiper no-slider-arrow"
        >
          {handPickedBooks?.map((book, index) => {
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
        <div className="mt-[14px] h-[0.5px] w-[calc(100%_-_50px)] md:w-full mr-auto bg-secondary" />
      </section>
    )
  );
};

export default HandPicked;
