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

const AmazonTopBooks = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [popularBooks, setPopularBooks] = useState([]);
  const { age } = useSelector((store) => store.book);

  const getBooks = async () => {
    try {
      const response = await axios
        .get(
          age === "" || age === undefined
            ? `${urls.getAmazonBestsellersBooks}`
            : `${urls.getAmazonBestsellersBooks}?age=${age}`
        )
        .then((res) => res.data)
        .catch((err) => console.log(err));
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
      <section className="px-8 md:px-2">
        <h1 className="font-bold md:text-[12px] md:pl-[18px]">
          Bestseller - Amazon
        </h1>
        <Swiper
          slidesPerView={"auto"}
          grabCursor={true}
          centeredSlides={true}
          centeredSlidesBounds={true}
          freeMode={true}
          navigation={true}
          modules={[FreeMode, Navigation, Virtual]}
          className="mySwiper bg-transparent !p-4 border-b-[0.5px] border-unHighlight pb-[14px] mb-[10px]"
        >
          {popularBooks?.map((book, index) => {
            return (
              <SwiperSlide
                key={index}
                className="relative flex flex-col !w-[150px]"
                virtualIndex={index}
              >
                <NewBook book={book} />
                <div className="absolute bottom-6 left-3 text-[48px] font-bold text-white font-outline-1">
                  {index + 1}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </section>
    )
  );
};

export default AmazonTopBooks;
