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

import { NewBook } from "./";
import amazon from "../../icons/amazonWhite.svg";
import bookIcon from "../../icons/bookIcon.svg";
import seriesImg from "../../icons/seriesImg.svg";
import seriesImgSelected from "../../icons/seriesImgSelected.svg";
import { FaAmazon } from "react-icons/fa";

const NewSeries = () => {
  const { age } = useSelector((store) => store.book);
  const [seriesTitle, setSeriesTitle] = useState([]);
  const [seriesBook, setSeriesBook] = useState({});
  const [seriesLoaded, setSeriesLoaded] = useState(false);
  const [seriesChosen, setSeriesChosen] = useState(null);

  function kFormatter(num) {
    return Math.abs(num) > 999
      ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
      : Math.sign(num) * Math.abs(num);
  }

  const getBooks = async () => {
    const response = await axios
      .get(
        age === "" || age === undefined
          ? `${urls.getAmazonBestsellersSets}`
          : `${urls.getAmazonBestsellersSets}?age=${age}`
      )
      .then((res) => res.data)
      .catch((err) => {
        console.log(err);
      });
    delete response.books["Best Seller - Most Popular"];
    delete response.books["Most Popular Series"];
    delete response.books["New York Times Bestseller"];
    delete response.books["Global Bestseller"];
    delete response.books["Teacher Pick"];
    const title = Object.keys(await response.books);
    setSeriesTitle(title);
    setSeriesBook(await response.books);
    title.forEach((serie) => {
      response.books[`${serie}`].total_books.sort((a, b) => {
        return b.stock_available - a.stock_available;
      });
    });
    setSeriesChosen(title[0]);
    setSeriesLoaded(true);
  };
  useEffect(() => {
    getBooks();
  }, [age]);
  return (
    seriesLoaded && (
      <section className="pl-8 md:px-2 pb-[10px]">
        <h1 className="font-bold md:text-[12px] pb-[10px]">
          Bestseller Series - Amazon
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
          {seriesTitle.map((serie, index) => {
            return (
              <SwiperSlide
                key={index}
                className={`!max-w-[180px] !h-auto rounded-lg  ${
                  seriesChosen === serie ? "!bg-mainColor" : "bg-mainColorLight"
                }`}
              >
                <div
                  className="relative w-[180px] h-full flex flex-row justify-start items-center gap-2 overflow-hidden rounded-md"
                  onClick={() => {
                    seriesChosen === serie
                      ? setSeriesChosen(null)
                      : setSeriesChosen(serie);
                  }}
                >
                  <div
                    className={`p-2 h-full rounded-lg flex flex-col items-start justify-center cursor-pointer`}
                  >
                    <div
                      className={`${
                        seriesChosen === serie ? "text-white" : ""
                      } text-[12px]`}
                    >
                      {serie?.length <= 18
                        ? `${serie.replace(/ *\([^)]*\) */g, "")}`
                        : `${serie
                            .replace(/ *\([^)]*\) */g, "")
                            .substring(0, 15)}...`}
                    </div>
                    <div
                      className={`flex flex-col mt-4 text-[12px] gap-2 ${
                        seriesChosen === serie ? "text-white" : ""
                      }`}
                    >
                      <div className="flex flex-row items-center justify-start gap-1">
                        <img
                          className={`w-[8px] ${
                            seriesChosen === serie ? "" : "invert"
                          }`}
                          src={bookIcon}
                          alt="BooksCount"
                        />
                        <p className="text-[8px]">
                          {seriesBook[`${serie}`].total_books.length} Books
                        </p>
                      </div>
                      <div className="flex flex-row items-center justify-start gap-1">
                        <FaAmazon className="w-[8px]" />
                        <p>
                          <span className="text-[8px]">
                            {kFormatter(seriesBook[`${serie}`].total_review)}
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
                        seriesChosen === serie ? seriesImgSelected : seriesImg
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
        {seriesLoaded && seriesChosen !== null && (
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
            {seriesBook[`${seriesChosen}`].total_books?.map((book, index) => {
              return (
                <SwiperSlide key={index} className="flex flex-col !w-[150px]">
                  <NewBook book={book} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
        <div
          className={`${
            seriesLoaded && seriesChosen !== null ? "mt-0" : "mt-[14px]"
          } h-[0.5px] w-[calc(100%_-_50px)] mr-auto bg-unHighlight`}
        />
      </section>
    )
  );
};

export default NewSeries;
