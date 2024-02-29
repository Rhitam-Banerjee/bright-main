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
    <section className="px-8 md:px-2 border-b-[0.5px] border-unHighlight pb-[14px] mb-[10px]">
      {authorsLoaded && (
        <h1 className="font-bold md:text-[12px] md:pl-[18px]">
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
        className="mySwiper !p-4"
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
                className="relative min-w-[280px] h-full flex flex-row justify-start items-center gap-2 overflow-hidden rounded-md"
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
                  className={`p-2 pr-[100px] h-full rounded-lg flex flex-col items-start justify-center authorDetails cursor-pointer`}
                >
                  <div
                    className={`${authorChosen === author ? "text-white" : ""}`}
                  >
                    {author}
                  </div>
                  <div
                    className={`flex flex-col mt-4 text-[0.8rem] gap-2 ${
                      authorChosen === author ? "text-white" : ""
                    }`}
                  >
                    <div className="flex flex-row items-center justify-start gap-1">
                      <img
                        className={`w-[10px] ${
                          authorChosen === author ? "" : "invert"
                        }`}
                        src={bookIcon}
                        alt="BooksCount"
                      />
                      <p>{authorDetails[`${author}`].books_count} Books</p>
                    </div>
                    <div className="flex flex-row items-center justify-start gap-1">
                      <img
                        className={`w-[10px] ${
                          authorChosen === author ? "" : "invert"
                        }`}
                        src={amazon}
                        alt="Amazon"
                      />
                      <p>{authorDetails[`${author}`].total_review} Reviews</p>
                    </div>
                  </div>
                </div>
                <div className="">
                  <img
                    className="absolute !bottom-0 right-0 w-[83px] !z-10 saturate-0"
                    src={authorImg}
                    alt=""
                  />
                </div>
                <div className="absolute -bottom-[20px] -right-[10px] h-[100px] w-[100px] rounded-full bg-[#ffffff70]" />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
      {authorsBookLoaded && <NewSlider container={authorBooks} />}
      {/* <div className="my-3 w-[90%] h-[2px] m-auto bg-unHighlight opacity-50" /> */}
    </section>
  );
};

export default AuthorSection;
