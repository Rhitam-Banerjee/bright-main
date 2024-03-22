import React, { useEffect, useState } from "react";
import axios from "axios";
import urls from "../../utils/urls";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "swiper/css/virtual";
import { FreeMode, Navigation, Virtual } from "swiper/modules";

import bookIcon from "../../icons/bookIcon.svg";
import bookIconOrange from "../../icons/bookIconOrange.svg";
import authorImg from "../../icons/authorImg.svg";
import { FaAmazon } from "react-icons/fa";
import { NewBook } from "../Book";
import { useSelector } from "react-redux";

const SearchGenres = ({ data }) => {
  function kFormatter(num) {
    return Math.abs(num) > 999
      ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
      : Math.sign(num) * Math.abs(num);
  }

  const { age } = useSelector((store) => store.book);

  const [books, setBooks] = useState([]);
  const [bookLoaded, setBookLoaded] = useState(false);
  const [chosen, setChosen] = useState(null);

  const getBooks = async (id) => {
    try {
      const response = await axios
        .get(
          age === "" || age === undefined
            ? `${urls.getBooksFromGenre}?genre_id=${id}`
            : `${urls.getBooksFromGenre}?genre_id=${id}&age=${age}`
        )
        .then((res) => res.data)
        .catch((err) => console.log(err));
      response.books?.sort((a, b) => {
        return b.review_count - a.review_count;
      });
      setBooks(response.books);
      setBookLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (data?.length) {
      getBooks(data[0]?.id);
      setChosen(data[0]?.id);
    }
  }, []);
  return (
    <section className="pl-8 md:px-2 pb-[10px]">
      <h1 className="flex font-bold text-[12px] pb-[10px]">Genres</h1>
      {data?.length > 0 ? (
        <>
          <Swiper
            slidesPerView={"auto"}
            grabCursor={true}
            freeMode={true}
            navigation={true}
            modules={[FreeMode, Navigation, Virtual]}
            className="mySwiper no-slider-arrow"
          >
            {data?.map((item, index) => {
              return (
                <SwiperSlide
                  key={item}
                  className={`!max-w-[180px] !h-auto rounded-lg ${
                    chosen === item.id ? "!bg-mainColor" : "bg-mainColorLight"
                  }`}
                  virtualIndex={index}
                >
                  <div
                    className="relative w-[180px] h-[80px] flex flex-row justify-start items-center gap-2 overflow-hidden rounded-md"
                    onClick={() => {
                      if (chosen === item.id) {
                        setChosen(null);
                      } else {
                        setChosen(item.id);
                        getBooks(item.id);
                      }
                    }}
                  >
                    <div
                      className={`p-2 h-full rounded-lg flex flex-col items-start justify-center cursor-pointer`}
                    >
                      <div
                        className={`${
                          chosen === item.id ? "text-white" : ""
                        } text-[12px] font-bold`}
                      >
                        {item.name?.length <= 16
                          ? `${item.name.replace(/ *\([^)]*\) */g, "")}`
                          : `${item.name
                              .replace(/ *\([^)]*\) */g, "")
                              .substring(0, 13)}...`}
                      </div>
                      <div
                        className={`flex flex-col mt-4 text-[12px] gap-0 ${
                          chosen === item.id ? "text-white" : ""
                        }`}
                      >
                        <div className="flex flex-row items-center justify-start gap-1">
                          <img
                            className={`w-[8px] ${
                              chosen === item.id ? "" : "invert"
                            }`}
                            src={chosen === item.id ? bookIconOrange : bookIcon}
                            alt="BooksCount"
                          />
                          <p className="text-[8px]">{item.books} Books</p>
                        </div>
                        <div className="flex flex-row items-center justify-start gap-1">
                          <FaAmazon className="w-[8px] translate-y-[1px]" />
                          <p>
                            <span className="text-[8px]">
                              {kFormatter(item.review_count)}
                            </span>
                            <span className="pl-[2px] text-[8px]">Reviews</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="">
                      <img
                        className="absolute !bottom-0 right-[0px] w-[73px] !z-10 saturate-0"
                        src={authorImg}
                        alt=""
                      />
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
          {bookLoaded && chosen && (
            <Swiper
              slidesPerView={"auto"}
              grabCursor={true}
              freeMode={true}
              navigation={true}
              modules={[FreeMode, Navigation, Virtual]}
              className="mySwiper !py-4 no-slider-arrow"
            >
              {books?.map((book, index) => {
                return (
                  <SwiperSlide
                    key={index}
                    className="flex flex-col !w-[150px]"
                    virtualIndex={index}
                  >
                    <NewBook key={index} book={book} />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          )}
        </>
      ) : (
        <span>No Genre of This Name</span>
      )}
    </section>
  );
};

export default SearchGenres;
