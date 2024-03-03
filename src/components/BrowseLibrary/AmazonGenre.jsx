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

import { NewBook } from "../Book";
import bookIcon from "../../icons/bookIcon.svg";
import bookIconOrange from "../../icons/bookIconOrange.svg";
import genreImg from "../../icons/genreImg.svg";
import genreImgSelected from "../../icons/genreImgSelected.svg";
// import amazonLogo from "../../icons/amazonLogo.png";
import { FaAmazon } from "react-icons/fa";

const AmazonGenre = () => {
  const { age } = useSelector((store) => store.book);
  const { isLoggedIn } = useSelector((store) => store.main);
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
    response.books = Object.fromEntries(
      Object.entries(response.books).sort(() => {
        return Math.random() - 0.5;
      })
    );
    const title = Object.keys(await response.books);
    title.forEach((genre) => {
      response.books[`${genre}`].total_books.sort((a, b) => {
        return b.review_count - a.review_count;
      });
    });
    if (isLoggedIn) {
      title.forEach((genre) => {
        response.books[`${genre}`].total_books.sort((a, b) => {
          return b.stock_available - a.stock_available;
        });
      });
    }
    setGenreTitle(title);
    setGenreBook(await response.books);
    setGenreChosen(title[0]);
    setGenreLoaded(true);
  };
  useEffect(() => {
    getBooks();
  }, [age]);
  return (
    genreLoaded && (
      <section className="pl-8 md:px-2 pb-[10px]">
        <h1 className="flex font-bold text-[12px] pb-[10px]">Popular Genre</h1>
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
          {genreTitle.map((genre, index) => {
            return (
              <SwiperSlide
                key={index}
                className={`!max-w-[300px] !h-auto rounded-lg  ${
                  genreChosen === genre ? "!bg-mainColor" : "bg-mainColorLight"
                }`}
              >
                <div
                  className="relative w-[180px] h-[80px] flex flex-row justify-start items-center gap-2 overflow-hidden rounded-md"
                  onClick={() => {
                    genreChosen === genre
                      ? setGenreChosen(null)
                      : setGenreChosen(genre);
                  }}
                >
                  <div
                    className={`p-2 h-full rounded-lg flex flex-col items-start justify-center cursor-pointer`}
                  >
                    <div
                      className={`${
                        genreChosen === genre ? "text-white" : ""
                      } font-bold text-[12px]`}
                    >
                      {genre?.length <= 18
                        ? `${genre.replace(/ *\([^)]*\) */g, "")}`
                        : `${genre
                            .replace(/ *\([^)]*\) */g, "")
                            .substring(0, 15)}...`}
                    </div>
                    <div
                      className={`flex flex-col mt-4 text-[12px] gap-0 ${
                        genreChosen === genre ? "text-white" : ""
                      }`}
                    >
                      <div className="flex flex-row items-center justify-start gap-1">
                        <img
                          className={`w-[8px] ${
                            genreChosen === genre ? "" : "invert"
                          }`}
                          src={
                            genreChosen === genre ? bookIconOrange : bookIcon
                          }
                          alt="BooksCount"
                        />
                        <p className="text-[8px]">
                          {genreBook[`${genre}`].total_books.length} Books
                        </p>
                      </div>
                      <div className="flex flex-row items-center justify-start gap-1">
                        <FaAmazon className="w-[8px] translate-y-[2px]" />
                        <p>
                          <span className="text-[8px]">
                            {kFormatter(genreBook[`${genre}`].total_review)}
                          </span>
                          <span className="pl-[2px] text-[8px]">Reviews</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <img
                      className="absolute !bottom-0 right-[0px] w-[66px] !z-10 saturate-0"
                      src={genreChosen === genre ? genreImgSelected : genreImg}
                      alt=""
                    />
                  </div>
                  <div className="absolute -bottom-[30px] right-[-20px] h-[102px] w-[102px] rounded-full bg-[#ffffff70]" />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        {genreLoaded && genreChosen !== null && (
          <Swiper
            slidesPerView={"auto"}
            grabCursor={true}
            centeredSlides={true}
            centeredSlidesBounds={true}
            freeMode={true}
            navigation={true}
            modules={[FreeMode, Navigation, Virtual]}
            className="mySwiper !py-4 bg-transparent no-slider-arrow"
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
        {/* <div
          className={`${
            genreLoaded && genreChosen !== null ? "mt-0" : "mt-[14px]"
          } h-[0.5px] w-[calc(100%_-_50px)] md:w-full mr-auto bg-secondary`}
        /> */}
      </section>
    )
  );
};

export default AmazonGenre;
