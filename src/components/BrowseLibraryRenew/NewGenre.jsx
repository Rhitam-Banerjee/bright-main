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
import genreImg from "../../icons/genreImg.svg";
import genreImgSelected from "../../icons/genreImgSelected.svg";

const NewSeries = () => {
  const { age } = useSelector((store) => store.book);
  const [genreTitle, setGenreTitle] = useState([]);
  const [genreBook, setGenreBook] = useState({});
  const [genreLoaded, setGenreLoaded] = useState(false);
  const [genreChosen, setGenreChosen] = useState(null);

  function kFormatter(num) {
    return Math.abs(num) > 999
      ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
      : Math.sign(num) * Math.abs(num);
  }

  const getBooks = async () => {
    const response = await axios
      .get(
        age === "" || age === undefined
          ? `${urls.getAmazonBestsellersGenre}`
          : `${urls.getAmazonBestsellersGenre}?age=${age}`
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
    setGenreTitle(title);
    setGenreBook(await response.books);
    title.forEach((serie) => {
      response.books[`${serie}`].total_books.sort((a, b) => {
        return b.stock_available - a.stock_available;
      });
    });
    setGenreChosen(title[0]);
    setGenreLoaded(true);
  };
  useEffect(() => {
    getBooks();
  }, [age]);
  return (
    genreLoaded && (
      <section className="px-8 md:px-2 ">
        <h1 className="font-bold md:text-[12px] md:pl-[18px]">
          Bestseller Genre - Amazon
        </h1>
        <Swiper
          slidesPerView={"auto"}
          grabCursor={true}
          centeredSlides={true}
          centeredSlidesBounds={true}
          freeMode={true}
          navigation={true}
          modules={[FreeMode, Navigation, Virtual]}
          className="mySwiper !p-4"
        >
          {genreTitle.map((serie, index) => {
            return (
              <SwiperSlide
                key={index}
                className={`!max-w-[300px] !h-auto rounded-lg  ${
                  genreChosen === serie ? "!bg-mainColor" : "bg-mainColorLight"
                }`}
              >
                <div
                  className="relative min-w-[280px] h-full flex flex-row justify-start items-center gap-2 overflow-hidden rounded-md"
                  onClick={() => {
                    genreChosen === serie
                      ? setGenreChosen(null)
                      : setGenreChosen(serie);
                  }}
                >
                  <div
                    className={`p-2 h-full rounded-lg flex flex-col items-start justify-center authorDetails cursor-pointer`}
                  >
                    <div
                      className={`${genreChosen === serie ? "text-white" : ""}`}
                    >
                      {serie.replace(/ *\([^)]*\) */g, "")}
                    </div>
                    <div
                      className={`flex flex-col mt-4 text-[0.8rem] gap-2 ${
                        genreChosen === serie ? "text-white" : ""
                      }`}
                    >
                      <div className="flex flex-row items-center justify-start gap-1">
                        <img
                          className={`w-[10px] ${
                            genreChosen === serie ? "" : "invert"
                          }`}
                          src={bookIcon}
                          alt="BooksCount"
                        />
                        <p>{genreBook[`${serie}`].total_books.length} Books</p>
                      </div>
                      <div className="flex flex-row items-center justify-start gap-1">
                        <img
                          className={`w-[10px] ${
                            genreChosen === serie ? "" : "invert"
                          }`}
                          src={amazon}
                          alt="Amazon"
                        />
                        <p>
                          {kFormatter(genreBook[`${serie}`].total_review)}
                          Reviews
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <img
                      className="absolute !bottom-0 right-0 w-[73px] !z-10 saturate-0"
                      src={genreChosen === serie ? genreImgSelected : genreImg}
                      alt=""
                    />
                  </div>
                  <div className="absolute -bottom-[20px] -right-[10px] h-[100px] w-[100px] rounded-full bg-[#ffffff70]" />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        {genreLoaded && genreChosen !== null && (
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
            {genreBook[`${genreChosen}`].total_books?.map((book, index) => {
              return (
                <SwiperSlide key={index} className="flex flex-col !w-[150px]">
                  <NewBook book={book} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
        {/* <div className="my-3 w-[90%] h-[2px] m-auto bg-unHighlight opacity-50" /> */}
      </section>
    )
  );
};

export default NewSeries;
