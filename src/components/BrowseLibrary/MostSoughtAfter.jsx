import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import urls from "../../utils/urls";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "swiper/css/virtual";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Virtual } from "swiper/modules";

import { NewBook } from "../Book";
import { load, stopLoad } from "../../reducers/bookSlice";

const MostSoughtAfter = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [popularBooks, setPopularBooks] = useState([]);
  const { age } = useSelector((store) => store.book);

  const getBooks = async () => {
    try {
      dispatch(load);
      const response = await axios
        .get(
          age === "" || age === undefined
            ? `${urls.getMostSoughtAfter}`
            : `${urls.getMostSoughtAfter}?age=${age}`
        )
        .then((res) => res.data)
        .catch((err) => console.log(err));
      setPopularBooks(response.books);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
    dispatch(stopLoad());
  };
  useEffect(() => {
    getBooks();
  }, [age]);
  return (
    !isLoading && (
      <section className="pl-8 md:px-2">
        <h1 className="font-bold text-[12px]">Highly Sought After</h1>
        <Swiper
          slidesPerView={"auto"}
          grabCursor={true}
          centeredSlides={true}
          centeredSlidesBounds={true}
          freeMode={true}
          navigation={true}
          modules={[FreeMode, Navigation, Virtual]}
          className="mySwiper py-4 no-slider-arrow"
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
        <div className="mb-[14px] h-[0.5px] w-[calc(100%_-_50px)] mr-auto md:mx-auto bg-unHighlight" />
      </section>
    )
  );
};

export default MostSoughtAfter;
