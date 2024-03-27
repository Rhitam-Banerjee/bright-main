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

import youtubeLogo from "../../icons/youtube.svg";

import { NewBook } from "../Book";

const YoutubeTopBooks = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [popularBooks, setPopularBooks] = useState([]);
  const { age } = useSelector((store) => store.book);
  const { isLoggedIn } = useSelector((store) => store.main);

  const getBooks = async () => {
    try {
      const response = await axios
        .get(
          age === "" || age === undefined
            ? `${urls.getYoutubeBestsellerBooks}?isLoggedIn=${
                isLoggedIn ? 1 : 0
              }`
            : `${urls.getYoutubeBestsellerBooks}?age=${age}&isLoggedIn=${
                isLoggedIn ? 1 : 0
              }`
        )
        .then((res) => res.data)
        .catch((err) => console.log(err));
      if (!isLoggedIn) {
        response.books.sort(() => {
          return Math.random() - 0.5;
        });
      }
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
      <section className="pl-8 md:px-2 pb-[10px]">
        <h1 className="flex font-bold text-[12px] pb-[10px]">
          Most Popular
          <span className="ml-2 pl-1 border-l-[1px] border-secondary">
            <img
              className="pl-2 h-[16px] w-[70px] translate-y-[2px] object-cover"
              src={youtubeLogo}
              alt="Youtube-Logo"
            />
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
          {popularBooks?.map((book, index) => {
            return (
              <SwiperSlide
                key={index}
                className="relative flex flex-col !w-[150px]"
                virtualIndex={index}
              >
                <NewBook book={book} section={"YoutubeBooks"} />
                <div className="absolute bottom-[20px] left-3 text-[48px] font-bold text-white font-outline-1">
                  {index + 1}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div className="mt-[14px] h-[0.5px] w-[calc(100%_-_50px)] md:w-full mr-auto bg-secondary" />
      </section>
    )
  );
};

export default YoutubeTopBooks;
