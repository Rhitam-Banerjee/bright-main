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

import amazon from "../../icons/amazonWhite.svg";
import bookIcon from "../../icons/bookIcon.svg";
import authorImg from "../../icons/authorImg.svg";
import NewSlider from "../BookSlider/NewSlider";
import { FaAmazon } from "react-icons/fa";

const AuthorSection = () => {
  const { age } = useSelector((store) => store.book);
  const [authors, setAuthors] = useState([]);
  const [authorDetails, setAuthorDetails] = useState({});
  const [authorsLoaded, setAuthorsLoaded] = useState(false);
  const [authorsBookLoaded, setAuthorsBookLoaded] = useState(false);
  const [authorBooks, setAuthorBooks] = useState({});
  const [authorChosen, setAuthorChosen] = useState(null);

  const getPopularAuthors = async () => {
    try {
      const response = await axios
        .get(
          age === "" || age === undefined
            ? `${urls.getPopularAuthor}`
            : `${urls.getPopularAuthor}?age=${age}`
        )
        .then((res) => res.data)
        .catch((err) => console.log(err));
      setAuthorDetails(response.popular_author);
      setAuthors(Object.keys(await response.popular_author));
      setAuthorsLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };

  const loadAuthorBooks = async (author) => {
    try {
      const response = await axios
        .get(
          age === "" || age === undefined
            ? `${urls.getBooksByAuthorAll}?author=${author}`
            : `${urls.getBooksByAuthorAll}?author=${author}&age=${age}`
        )
        .then((res) => res.data)
        .catch((err) => console.log(err));
      response.author_details.books.sort((a, b) => {
        return b.stock_available - a.stock_available;
      });
      setAuthorBooks(response.author_details.books);
      setAuthorsBookLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPopularAuthors();
    setAuthorsBookLoaded(false);
  }, [age]);
  return (
    <section className="pl-8 md:px-2 mb-[10px]">
      {authorsLoaded && (
        <h1 className="font-bold text-[12px] pb-[10px]">
          Bestseller Authors - Amazon
        </h1>
      )}
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
        {authors.map((author, index) => {
          return (
            <SwiperSlide
              key={author}
              className={`!max-w-[300px] !h-auto rounded-lg ${
                authorChosen === author ? "!bg-mainColor" : "bg-mainColorLight"
              }`}
              virtualIndex={index}
            >
              <div
                className="relative w-[180px] h-full flex flex-row justify-start items-center gap-2 overflow-hidden rounded-md"
                onClick={() => {
                  if (authorChosen === author) {
                    setAuthorChosen(null);
                    setAuthorsBookLoaded(false);
                  } else {
                    loadAuthorBooks(author);
                    setAuthorChosen(author);
                  }
                }}
              >
                <div
                  className={`p-2 h-full rounded-lg flex flex-col items-start justify-center cursor-pointer`}
                >
                  <div
                    className={`${
                      authorChosen === author ? "text-white" : ""
                    } text-[12px] font-bold`}
                  >
                    {author?.length <= 18
                      ? `${author.replace(/ *\([^)]*\) */g, "")}`
                      : `${author
                          .replace(/ *\([^)]*\) */g, "")
                          .substring(0, 15)}...`}
                  </div>
                  <div
                    className={`flex flex-col mt-4 text-[12px] gap-2 ${
                      authorChosen === author ? "text-white" : ""
                    }`}
                  >
                    <div className="flex flex-row items-center justify-start gap-1">
                      <img
                        className={`w-[8px] ${
                          authorChosen === author ? "" : "invert"
                        }`}
                        src={bookIcon}
                        alt="BooksCount"
                      />
                      <p className="text-[8px]">
                        {authorDetails[`${author}`].books_count} Books
                      </p>
                    </div>
                    <div className="flex flex-row items-center justify-start gap-1">
                      <FaAmazon className="w-[8px]" />
                      <p>
                        <span className="text-[8px]">
                          {authorDetails[`${author}`].total_review}
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
                <div className="absolute -bottom-[30px] right-[-20px] h-[102px] w-[102px] rounded-full bg-[#ffffff70]" />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      {authorsBookLoaded && <NewSlider container={authorBooks} />}
      <div
        className={`${
          authorsBookLoaded ? "mt-0" : "mt-[14px]"
        } h-[0.5px] w-[calc(100%_-_50px)] mr-auto md:mx-auto bg-unHighlight`}
      />
    </section>
  );
};

export default AuthorSection;
