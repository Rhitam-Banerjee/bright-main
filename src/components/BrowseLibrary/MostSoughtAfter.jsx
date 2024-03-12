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

import amazonLogo from "../../icons/amazonLogo.png";

import { NewBook } from "../Book";

const AmazonTopBooks = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [popularBooks, setPopularBooks] = useState([]);
  const { age } = useSelector((store) => store.book);
  const { isLoggedIn } = useSelector((store) => store.main);
  const getBooks = async () => {
    try {
      const response = await axios
        .get(
          age === "" || age === undefined
            ? `${urls.getMostSoughtAfter}?isLoggedIn=${isLoggedIn ? 1 : 0}`
            : `${urls.getMostSoughtAfter}?age=${age}`
        )
        .then((res) => res.data)
        .catch((err) => console.log(err));
      if (!isLoggedIn) {
        response.books.sort(() => {
          return Math.random() - 0.5;
        });
      }
      response.books.sort((b, a) => {
        return b.stocks_available - a.stocks_available;
      });
      setPopularBooks(response.books);
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
          Highly Sought After
          <span className="ml-2 pl-1 border-l-[1px] border-secondary">
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
          className="mySwiper pb-[14px] no-slider-arrow"
        >
          {popularBooks?.map((book, index) => {
            return (
              <SwiperSlide
                key={index}
                className="relative flex flex-col !w-[150px]"
                virtualIndex={index}
              >
                <NewBook book={book} />
                <div className="absolute bottom-[20px] left-3 text-[48px] font-bold text-white font-outline-1">
                  {index + 1}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div className="h-[0.5px] w-[calc(100%_-_50px)] md:w-full mr-auto md:mx-auto bg-secondary" />
      </section>
    )
  );
};

export default AmazonTopBooks;
