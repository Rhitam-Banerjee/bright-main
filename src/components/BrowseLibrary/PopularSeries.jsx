import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

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
import seriesImg from "../../icons/seriesImg.svg";
import seriesImgSelected from "../../icons/seriesImgSelected.svg";

import { FaAmazon } from "react-icons/fa";
import NewSlider from "../BookSlider/NewSlider";
import { NewBook } from "../Book";

const AmazonSeries = () => {
  const { age } = useSelector((store) => store.book);
  const { isLoggedIn, isMobile } = useSelector((store) => store.main);
  const [series, setSeries] = useState([]);
  const [seriesBook, setSeriesBook] = useState([]);
  const [seriesLoaded, setSeriesLoaded] = useState(false);
  const [seriesBookLoaded, setSeriesBookLoaded] = useState(false);
  const [seriesChosen, setSeriesChosen] = useState(null);

  function kFormatter(num) {
    return Math.abs(num) > 999
      ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
      : Math.sign(num) * Math.abs(num);
  }

  const getSeries = async (isMobile) => {
    const response = await axios
      .get(
        age === "" || age === undefined
          ? `${urls.getAmazonBestsellersSets}?isMobile=${isMobile ? 1 : 0}`
          : `${urls.getAmazonBestsellersSets}?age=${age}&isMobile=${
              isMobile ? 1 : 0
            }`
      )
      .then((res) => res.data)
      .catch((err) => {
        console.log(err);
      });
    response.book_set?.splice(0, response.book_set.length / 2);
    if (!isLoggedIn) {
      response.book_set?.sort(() => {
        return Math.random() - 0.5;
      });
    }
    setSeries(response.book_set);
    setSeriesChosen(response.book_set[0].id);
    getBooksOfSeries(response.book_set[0].id);
    setSeriesLoaded(true);
  };

  const getBooksOfSeries = async (series_id) => {
    try {
      const response = await axios
        .get(
          age === "" || age === undefined
            ? `${urls.getBooksFromSeries}?category_id=${series_id}`
            : `${urls.getBooksFromSeries}?age=${age}&category_id=${series_id}`
        )
        .then((res) => res.data)
        .catch((err) => console.log(err));
      response.books?.sort((a, b) => {
        return b.review_count - a.review_count;
      });
      if (isLoggedIn) {
        response.books?.sort((a, b) => {
          return b.stocks_available - a.stocks_available;
        });
      }
      setSeriesBook(response.books);
      setSeriesBookLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const window_width = window.innerWidth < 968;
    getSeries(window_width);
  }, [age]);
  return (
    seriesLoaded && (
      <section className="pl-8 md:px-2 pb-[10px]">
        <h1 className="flex font-bold text-[12px] pb-[10px]">Popular Series</h1>
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
          {series.map((serie, index) => {
            return (
              <SwiperSlide
                key={index}
                className={`!max-w-[180px] !h-auto rounded-lg  ${
                  seriesChosen === serie.id
                    ? "!bg-mainColor"
                    : "bg-mainColorLight"
                }`}
              >
                <div
                  className="relative w-[180px] h-[80px] flex flex-row justify-start items-center gap-2 overflow-hidden rounded-md"
                  onClick={() => {
                    if (seriesChosen === serie.id) {
                      setSeriesChosen(null);
                    } else {
                      setSeriesChosen(serie.id);
                      getBooksOfSeries(serie.id);
                    }
                  }}
                >
                  <div
                    className={`p-2 h-full rounded-lg flex flex-col items-start justify-center cursor-pointer`}
                  >
                    <div
                      className={`${
                        seriesChosen === serie.id ? "text-white" : ""
                      } font-bold text-[12px]`}
                    >
                      {serie.name?.length <= 16
                        ? `${serie.name.replace(/ *\([^)]*\) */g, "")}`
                        : `${serie.name
                            .replace(/ *\([^)]*\) */g, "")
                            .substring(0, 13)}...`}
                    </div>
                    <div
                      className={`flex flex-col mt-4 text-[12px] gap-0 ${
                        seriesChosen === serie.id ? "text-white" : ""
                      }`}
                    >
                      <div className="flex flex-row items-center justify-start gap-1">
                        <img
                          className={`w-[8px] ${
                            seriesChosen === serie.id ? "" : "invert"
                          }`}
                          src={
                            seriesChosen === serie.id
                              ? bookIconOrange
                              : bookIcon
                          }
                          alt="BooksCount"
                        />
                        <p className="text-[8px]">{serie.books} Books</p>
                      </div>
                      <div className="flex flex-row items-center justify-start gap-1">
                        <FaAmazon className="w-[8px] translate-y-[1px]" />
                        <p>
                          <span className="text-[8px]">
                            {kFormatter(serie.review_count)}
                          </span>
                          <span className="pl-[2px] text-[8px]">Reviews</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <img
                      className="absolute !bottom-0 right-[0px] w-[73px] !z-10 saturate-0"
                      src={
                        seriesChosen === serie.id
                          ? seriesImgSelected
                          : seriesImg
                      }
                      alt=""
                    />
                  </div>
                  <div className="absolute -bottom-[30px] right-[-20px] h-[102px] w-[102px] rounded-full bg-[#ffffff70]" />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        {seriesBookLoaded && seriesChosen && (
          // <NewSlider id={seriesChosen} container={seriesBook} />
          <Swiper
            slidesPerView={"auto"}
            grabCursor={true}
            freeMode={true}
            navigation={true}
            modules={[FreeMode, Navigation, Virtual]}
            className="mySwiper !py-4 no-slider-arrow"
          >
            {seriesBook.map((book, index) => {
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
        <div
          className={`${
            seriesLoaded && seriesChosen ? "mt-0" : "mt-[14px]"
          } h-[0.5px] w-[calc(100%_-_50px)] md:w-full mr-auto bg-secondary`}
        />
      </section>
    )
  );
};

export default AmazonSeries;
