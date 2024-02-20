import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "./styles.scss";
import { Navigation } from "swiper/modules";

import axios from "axios";
import urls from "../../utils/urls";

import { setGenersChosen } from "../../reducers/bookSlice";

import { NewBook } from "./";
import amazon from "../../icons/amazonWhite.svg";
import bookIcon from "../../icons/bookIcon.svg";
import seriesImg from "../../icons/series1Img.png";

const NewGenre = () => {
  const { age, genersChosen } = useSelector((store) => store.book);
  const [geners, setGenre] = useState([]);
  const [genersBooks, setGenreBooks] = useState({});
  const [genresLoaded, setGenresLoaded] = useState(false);
  const [genreReview, setGenreReview] = useState({});

  function kFormatter(num) {
    return Math.abs(num) > 999
      ? (Math.abs(num) / 1000).toFixed(1) + "k"
      : Math.abs(num);
  }

  const dispatch = useDispatch();
  const getBooks = async () => {
    const response = await axios
      .get(
        age === "" || age === undefined
          ? `${urls.getBooksGenre}?start=0&end=10`
          : `${urls.getBooksGenre}?age=${age}&start=0&end=10`
      )
      .then((res) => res.data)
      .catch((err) => {
        console.log(err);
      });
    const title = Object.keys(await response.books_genre);
    setGenre(title);
    setGenreBooks(await response.books_genre);
    setGenresLoaded(true);
    title.forEach((genre) => {
      response.books_genre[`${genre}`].sort((a, b) => {
        return b.stock_available - a.stock_available;
      });
    });
    title.forEach((genre, index) => {
      let totalReview = 0;
      response.books_genre[`${genre}`].forEach((book) => {
        totalReview += parseInt(book.review_count);
      });
      totalReview = kFormatter(totalReview);
      setGenreReview((prevState) => ({
        ...prevState,
        [genre]: totalReview,
      }));
    });
  };
  useEffect(() => {
    getBooks();
  }, [age]);
  return (
    genresLoaded && (
      <section className="px-8 md:px-2">
        <h1 className="font-bold md:text-[12px] md:pl-[18px]">Genre</h1>
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
          {geners.map((genre, index) => {
            return (
              <SwiperSlide
                key={index}
                className={`!max-w-[300px] !h-auto rounded-lg ${
                  genersChosen === genre ? "!bg-mainColor" : "bg-unHighlight"
                }`}
              >
                <div
                  className="relative h-full flex flex-row justify-start items-center gap-2 overflow-hidden rounded-md"
                  onClick={() => {
                    genersChosen === genre
                      ? dispatch(setGenersChosen(null))
                      : dispatch(setGenersChosen(genre));
                  }}
                >
                  <div
                    className={`p-2 pr-[100px] h-full rounded-lg flex flex-col items-start justify-center authorDetails cursor-pointer`}
                  >
                    <div
                      className={`${
                        genersChosen === genre ? "text-white" : ""
                      }`}
                    >
                      {genre}
                    </div>
                    <div
                      className={`flex flex-col mt-4 text-[0.8rem] gap-2 ${
                        genersChosen === genre ? "text-white" : ""
                      }`}
                    >
                      <div className="flex flex-row items-center justify-start gap-1">
                        <img
                          className={`w-[10px] ${
                            genersChosen === genre ? "" : "invert"
                          }`}
                          src={bookIcon}
                          alt="BooksCount"
                        />
                        <p>{genersBooks[`${genre}`].length} Books</p>
                      </div>
                      <div className="flex flex-row items-center justify-start gap-1">
                        <img
                          className={`w-[10px] ${
                            genersChosen === genre ? "" : "invert"
                          }`}
                          src={amazon}
                          alt="Amazon"
                        />
                        <p>{genreReview[`${genre}`]} Reviews</p>
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
        {genresLoaded && genersChosen !== null && (
          <Swiper
            slidesPerView={"auto"}
            spaceBetween={30}
            grabCursor={true}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            modules={[Navigation]}
            className="mySwiper !p-4"
          >
            {genersBooks[`${genersChosen}`]?.map((book, index) => {
              return (
                <SwiperSlide key={index} className="flex flex-col !w-[150px]">
                  <NewBook book={book} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </section>
    )
  );
};

export default NewGenre;
