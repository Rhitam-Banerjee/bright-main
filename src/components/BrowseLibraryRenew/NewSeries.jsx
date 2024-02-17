import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import urls from "../../utils/urls";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

import { setSeriesChosen } from "../../reducers/bookSlice";

import { NewBook } from "./";
import amazon from "../../icons/amazonWhite.svg";
import bookIcon from "../../icons/bookIcon.svg";
import seriesImg from "../../icons/series1Img.png";

// import { appendBookSet, setBookSet } from "../../reducers/bookSlice";
const NewSeries = () => {
  const { seriesChosen } = useSelector((store) => store.book);
  const dispatch = useDispatch();
  const [series, setSeries] = useState([]);
  const [seriesBook, setSeriesBook] = useState({});
  const [seriesLoaded, setSeriesLoaded] = useState(false);
  const [seriesReview, setSeriesReview] = useState({});

  function kFormatter(num) {
    return Math.abs(num) > 999
      ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
      : Math.sign(num) * Math.abs(num);
  }

  const getBooks = async () => {
    const response = await axios
      .get(`${urls.getBooksSeries}?start=0&end=20`)
      .then((res) => res.data)
      .catch((err) => {
        console.log(err);
      });
    delete response.books_series["Best Seller - Most Popular"];
    delete response.books_series["Most Popular Series"];
    delete response.books_series["New York Times Bestseller"];
    delete response.books_series["Global Bestseller"];
    delete response.books_series["Teacher Pick"];
    const title = Object.keys(await response.books_series);
    setSeries(title);
    setSeriesBook(await response.books_series);
    setSeriesLoaded(true);
    title.forEach((serie) => {
      response.books_series[`${serie}`].sort((a, b) => {
        return b.stock_available - a.stock_available;
      });
    });
    title.forEach((series, index) => {
      let totalReview = 0;
      response.books_series[`${series}`].forEach((book) => {
        totalReview += parseInt(book.review_count);
      });
      totalReview = kFormatter(totalReview);
      setSeriesReview((prevState) => ({
        ...prevState,
        [series]: totalReview,
      }));
    });
  };
  useEffect(() => {
    getBooks();
  }, []);
  return (
    seriesLoaded && (
      <section className="px-8 md:px-2">
        <h1 className="font-bold text-[1.2rem] md:px-6">Series</h1>
        <Swiper
          slidesPerView={"auto"}
          grabCursor={true}
          spaceBetween={30}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Navigation]}
          className="mySwiper !p-4"
        >
          {series.map((serie, index) => {
            return (
              <SwiperSlide
                key={index}
                className={`!max-w-[300px] !h-auto rounded-lg  ${
                  seriesChosen === serie ? "!bg-mainColor" : "bg-unHighlight"
                }`}
              >
                <div
                  className="relative h-full flex flex-row justify-start items-center gap-2 overflow-hidden rounded-md"
                  onClick={() => {
                    seriesChosen === serie
                      ? dispatch(setSeriesChosen(null))
                      : dispatch(setSeriesChosen(serie));
                  }}
                >
                  <div
                    className={`p-2 pr-[100px] h-full rounded-lg flex flex-col items-start justify-center authorDetails cursor-pointer`}
                  >
                    <div
                      className={`${
                        seriesChosen === serie ? "text-white" : ""
                      }`}
                    >
                      {serie}
                    </div>
                    <div
                      className={`flex flex-col mt-4 text-[0.8rem] gap-2 ${
                        seriesChosen === serie ? "text-white" : ""
                      }`}
                    >
                      <div className="flex flex-row items-center justify-start gap-1">
                        <img
                          className={`w-[10px] ${
                            seriesChosen === serie ? "" : "invert"
                          }`}
                          src={bookIcon}
                          alt="BooksCount"
                        />
                        <p>{seriesBook[`${serie}`].length} Books</p>
                      </div>
                      <div className="flex flex-row items-center justify-start gap-1">
                        <img
                          className={`w-[10px] ${
                            seriesChosen === serie ? "" : "invert"
                          }`}
                          src={amazon}
                          alt="Amazon"
                        />
                        <p>{seriesReview[`${serie}`]} Reviews</p>
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <img
                      className="absolute !bottom-0 right-0 w-[100px] !z-10 saturate-0"
                      src={seriesImg}
                      alt=""
                    />
                  </div>
                  <div className="absolute -bottom-[20px] -right-[10px] h-[100px] w-[100px] rounded-full bg-[#ffffff70]" />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        {seriesLoaded && seriesChosen !== null && (
          <Swiper
            slidesPerView={"auto"}
            spaceBetween={30}
            grabCursor={true}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            modules={[Navigation]}
            className="mySwiper bg-transparent !p-4"
          >
            {seriesBook[`${seriesChosen}`]?.map((book, index) => {
              return (
                <SwiperSlide key={index} className="flex flex-col !w-[150px]">
                  <NewBook book={book} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
        <div className="my-3 w-[90%] h-[2px] m-auto bg-unHighlight opacity-50" />
      </section>
    )
  );
};

export default NewSeries;
