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
import genreImg from "../../icons/genreImg.svg";
import genreImgSelected from "../../icons/genreImgSelected.svg";
import amazonLogo from "../../icons/amazoncom.svg";
import { FaAmazon } from "react-icons/fa";
import { NewBook } from "../Book";

const AmazonGenre = () => {
  const { age } = useSelector((store) => store.book);
  const { isLoggedIn } = useSelector((store) => store.main);
  const [genres, setGenres] = useState([]);
  const [genreBook, setGenreBook] = useState([]);
  const [genreLoaded, setGenreLoaded] = useState(false);
  const [genreBookLoaded, setGenreBookLoaded] = useState(false);
  const [genreChosen, setGenreChosen] = useState(null);

  function formatNumber(number) {
    const suffixes = ["", "k", "M", "B"];
    let suffixIndex = 0;

    while (number >= 1000 && suffixIndex < suffixes.length - 1) {
      number /= 1000;
      suffixIndex++;
    }

    return number.toFixed(1) + suffixes[suffixIndex];
  }

  // function formatNumber(num) {
  //   return Math.abs(num) > 999
  //     ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
  //     : Math.sign(num) * Math.abs(num);
  // }

  const getGenres = async (isMobile) => {
    const response = await axios
      .get(
        age === "" || age === undefined
          ? `${urls.getAmazonBestsellersGenre}?isMobile=${isMobile ? 1 : 0}`
          : `${urls.getAmazonBestsellersGenre}?age=${age}&isMobile=${
              isMobile ? 1 : 0
            }`
      )
      .then((res) => res.data)
      .catch((err) => {
        console.log(err);
      });
    if (!isLoggedIn) {
      response.book_genres?.sort(() => {
        return Math.random() - 0.5;
      });
    }
    setGenres(response.book_genres);
    setGenreChosen(response.book_genres[0].id);
    getBooksOfGenre(response.book_genres[0].id);
    setGenreLoaded(true);
  };

  const getBooksOfGenre = async (genre_id) => {
    try {
      const response = await axios
        .get(
          age === "" || age === undefined
            ? `${urls.getBooksFromGenre}?genre_id=${genre_id}`
            : `${urls.getBooksFromGenre}?age=${age}&genre_id=${genre_id}`
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
      setGenreBook(response.books);
      setGenreChosen(genre_id);
      setGenreBookLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const window_width = window.innerWidth < 968;
    getGenres(window_width);
  }, [age]);
  return (
    genreLoaded && (
      <section className="pl-8 md:px-2 pb-[10px]">
        <h1 className="flex font-bold text-[12px] pb-[10px]">
          Bestseller Genre
          <span className="ml-2 pl-1 border-l-[1px] border-secondary">
            <img
              className="pl-2 h-[14px] w-[70px] translate-y-[6px] object-cover"
              src={amazonLogo}
              alt="amazonLogo"
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
          {genres.map((genre, index) => {
            return (
              <SwiperSlide
                key={index}
                className={`!max-w-[300px] !h-auto rounded-lg ${
                  genreChosen === genre.id
                    ? "!bg-mainColor"
                    : "!bg-mainColorLight"
                }`}
              >
                <div
                  className="relative w-[180px] h-[80px] flex flex-row justify-start items-center gap-2 overflow-hidden rounded-md"
                  onClick={() => {
                    if (genreChosen === genre.id) {
                      setGenreChosen(null);
                    } else {
                      setGenreChosen(genre);
                      getBooksOfGenre(genre.id);
                    }
                  }}
                >
                  <div
                    className={`p-2 h-full rounded-lg flex flex-col items-start justify-center cursor-pointer`}
                  >
                    <div
                      className={`${
                        genreChosen === genre.id ? "text-white" : ""
                      } font-bold text-[12px]`}
                    >
                      {genre.name?.length <= 18
                        ? `${genre.name.replace(/ *\([^)]*\) */g, "")}`
                        : `${genre.name
                            .replace(/ *\([^)]*\) */g, "")
                            .substring(0, 15)}...`}
                    </div>
                    <div
                      className={`flex flex-col mt-4 text-[12px] gap-0 ${
                        genreChosen === genre.id ? "text-white" : ""
                      }`}
                    >
                      <div className="flex flex-row items-center justify-start gap-1">
                        <img
                          className={`w-[8px] ${
                            genreChosen === genre.id ? "" : "invert"
                          }`}
                          src={
                            genreChosen === genre.id ? bookIconOrange : bookIcon
                          }
                          alt="BooksCount"
                        />
                        <p className="text-[8px]">{genre.books} Books</p>
                      </div>
                      <div className="flex flex-row items-center justify-start gap-1">
                        <FaAmazon className="w-[8px] translate-y-[2px]" />
                        <p>
                          <span className="text-[8px]">
                            {formatNumber(genre.review_count)}
                          </span>
                          <span className="pl-[2px] text-[8px]">Reviews</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <img
                      className="absolute !bottom-0 right-[0px] w-[66px] !z-10 saturate-0"
                      src={
                        genreChosen === genre.id ? genreImgSelected : genreImg
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
        {genreBookLoaded && genreChosen && (
          // <NewSlider id={genreChosen} container={genreBook} />
          <Swiper
            slidesPerView={"auto"}
            grabCursor={true}
            freeMode={true}
            navigation={true}
            modules={[FreeMode, Navigation, Virtual]}
            className="mySwiper !py-4 no-slider-arrow"
          >
            {genreBook.map((book, index) => {
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
            genreLoaded && genreChosen !== null ? "mt-0" : "mt-[14px]"
          } h-[0.5px] w-[calc(100%_-_50px)] md:w-full mr-auto bg-secondary`}
        />
      </section>
    )
  );
};

export default AmazonGenre;
