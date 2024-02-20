import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "./styles.scss";
import { Navigation, Virtual } from "swiper/modules";

import axios from "axios";
import urls from "../../utils/urls";

import { setAuthorChosen } from "../../reducers/bookSlice";

import { NewBook } from "./";
import amazon from "../../icons/amazonWhite.svg";
import bookIcon from "../../icons/bookIcon.svg";
import authorImg from "../../icons/author.png";
import NewSlider from "../BookSlider/NewSlider";

const AuthorSection = () => {
  const { age } = useSelector((store) => store.book);
  const { authorChosen } = useSelector((store) => store.book);
  const [authors, setAuthors] = useState([]);
  const [authorDetails, setAuthorDetails] = useState({});
  const [authorsLoaded, setAuthorsLoaded] = useState(false);
  const [authorsBookLoaded, setAuthorsBookLoaded] = useState(false);
  const [authorBooks, setAuthorBooks] = useState({});

  function kFormatter(num) {
    return Math.abs(num) > 999
      ? (Math.abs(num) / 1000).toFixed(1) + "k"
      : Math.abs(num);
  }

  const dispatch = useDispatch();

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
        .get(`${urls.getBooksByAuthorAll}?author=${author}`)
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
    dispatch(setAuthorChosen(null));
    setAuthorsBookLoaded(false);
  }, [age]);
  return (
    <section className="px-8 md:px-2 border-b-[0.5px] border-unHighlight pb-[14px] mb-[10px]">
      {authorsLoaded && (
        <h1 className="font-bold md:text-[12px] md:pl-[18px]">
          Popular Authors
        </h1>
      )}
      <Swiper
        slidesPerView={"auto"}
        grabCursor={true}
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Navigation, Virtual]}
        className="mySwiper !p-4"
      >
        {authors.map((author, index) => {
          return (
            <SwiperSlide
              key={author}
              className={`!max-w-[300px] !h-auto rounded-lg ${
                authorChosen === author ? "!bg-mainColor" : "bg-unHighlight"
              }`}
              virtualIndex={index}
            >
              <div
                className="relative h-full flex flex-row justify-start items-center gap-2 overflow-hidden rounded-md"
                onClick={() => {
                  if (authorChosen === author) {
                    dispatch(setAuthorChosen(null));
                    setAuthorsBookLoaded(false);
                  } else {
                    loadAuthorBooks(author);
                    dispatch(setAuthorChosen(author));
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
                    className="absolute !bottom-0 right-0 w-[100px] !z-10 saturate-0"
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
