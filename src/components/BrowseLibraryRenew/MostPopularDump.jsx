import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import axios from "axios";
import urls from "../../utils/urls";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Virtual } from "swiper/modules";
import NewBook from "./NewBook";

const MostPopularDump = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
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
      setTitle(response.book_set[0].genre);
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
        <h1 className="font-bold md:text-[12px] md:pl-[18px]">{title}</h1>
        <Swiper
          slidesPerView={"auto"}
          spaceBetween={30}
          grabCursor={true}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Navigation, Virtual]}
          className="mySwiper bg-transparent !p-4 border-b-[0.5px] border-unHighlight pb-[14px] mb-[10px]"
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
      </section>
    )
  );
};

export default MostPopularDump;
