import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "swiper/css/virtual";
import { FreeMode, Navigation, Virtual } from "swiper/modules";

import axios from "axios";
import urls from "../../utils/urls";

import bookIcon from "../../icons/bookIcon.svg";
import bookIconOrange from "../../icons/bookIconOrange.svg";
import authorImg from "../../icons/authorImg.svg";
import NewSlider from "../BookSlider/NewSlider";
import amazonLogo from "../../icons/amazonLogo.png";
import { FaAmazon } from "react-icons/fa";
import { NewBook } from "../Book";

function kFormatter(num) {
  return Math.abs(num) > 999
    ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
    : Math.sign(num) * Math.abs(num);
}

const AmazonAuthors = () => {
  const { age } = useSelector((store) => store.book);
  const { isLoggedIn } = useSelector((store) => store.main);
  const [authors, setAuthors] = useState([]);
  const [authorBooks, setAuthorBooks] = useState([]);
  const [authorsLoaded, setAuthorsLoaded] = useState(false);
  const [authorsBookLoaded, setAuthorsBookLoaded] = useState(false);
  const [authorChosen, setAuthorChosen] = useState(null);

  const getAuthors = async (isMobile) => {
    try {
      const response = await axios
        .get(
          age === "" || age === undefined
            ? `${urls.getAmazonBestsellersAuthors}?isMobile=${isMobile ? 1 : 0}`
            : `${urls.getAmazonBestsellersAuthors}?age=${age}&isMobile=${
                isMobile ? 1 : 0
              }`
        )
        .then((res) => res.data)
        .catch((err) => console.log(err));
      response.book_authors?.splice(0, response.book_authors.length / 2);
      response.book_authors?.sort(() => {
        return Math.random() - 0.5;
      });
      setAuthors(response.book_authors);
      setAuthorChosen(response.book_authors[0].id);
      getBooksOfAuthors(response.book_authors[0].id);
      setAuthorsLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };

  const getBooksOfAuthors = async (author_id) => {
    try {
      const response = await axios
        .get(
          age === "" || age === undefined
            ? `${urls.getBooksFromAuthor}?author_id=${author_id}`
            : `${urls.getBooksFromAuthor}?age=${age}&author_id=${author_id}`
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
      setAuthorBooks(response.books);
      setAuthorsBookLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const window_width = window.innerWidth < 968;
    getAuthors(window_width);
  }, [age]);
  return (
    <section className="pl-8 md:px-2 pb-[10px]">
      {authorsLoaded && (
        <h1 className="flex font-bold text-[12px] pb-[10px]">
          Popular Authors
        </h1>
      )}
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
        {authors.map((author, index) => {
          return (
            <SwiperSlide
              key={author}
              className={`!max-w-[180px] !h-auto rounded-lg ${
                authorChosen === author.id
                  ? "!bg-mainColor"
                  : "bg-mainColorLight"
              }`}
              virtualIndex={index}
            >
              <div
                className="relative w-[180px] h-[80px] flex flex-row justify-start items-center gap-2 overflow-hidden rounded-md"
                onClick={() => {
                  if (authorChosen === author.id) {
                    setAuthorChosen(null);
                  } else {
                    setAuthorChosen(author.id);
                    getBooksOfAuthors(author.id);
                  }
                }}
              >
                <div
                  className={`p-2 h-full rounded-lg flex flex-col items-start justify-center cursor-pointer`}
                >
                  <div
                    className={`${
                      authorChosen === author.id ? "text-white" : ""
                    } text-[12px] font-bold`}
                  >
                    {author.name?.length <= 16
                      ? `${author.name.replace(/ *\([^)]*\) */g, "")}`
                      : `${author.name
                          .replace(/ *\([^)]*\) */g, "")
                          .substring(0, 13)}...`}
                  </div>
                  <div
                    className={`flex flex-col mt-4 text-[12px] gap-0 ${
                      authorChosen === author.id ? "text-white" : ""
                    }`}
                  >
                    <div className="flex flex-row items-center justify-start gap-1">
                      <img
                        className={`w-[8px] ${
                          authorChosen === author.id ? "" : "invert"
                        }`}
                        src={
                          authorChosen === author.id ? bookIconOrange : bookIcon
                        }
                        alt="BooksCount"
                      />
                      <p className="text-[8px]">{author.books} Books</p>
                    </div>
                    <div className="flex flex-row items-center justify-start gap-1">
                      <FaAmazon className="w-[8px] translate-y-[1px]" />
                      <p>
                        <span className="text-[8px]">
                          {kFormatter(author.review_count)}
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
      {authorsBookLoaded && authorChosen && (
        // <NewSlider id={authorChosen} container={authorBooks} />
        <Swiper
          slidesPerView={"auto"}
          grabCursor={true}
          freeMode={true}
          navigation={true}
          modules={[FreeMode, Navigation, Virtual]}
          className="mySwiper !py-4 no-slider-arrow"
        >
          {authorBooks.map((book, index) => {
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
          authorsBookLoaded && authorChosen ? "mt-0" : "mt-[14px]"
        } h-[0.5px] w-[calc(100%_-_50px)] md:w-full mr-auto bg-secondary`}
      />
    </section>
  );
};

export default AmazonAuthors;
