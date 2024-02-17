import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "./styles.scss";
import { Navigation } from "swiper/modules";

import axios from "axios";
import urls from "../../utils/urls";

import { setAuthorChosen } from "../../reducers/bookSlice";

import { NewBook } from "./";
import amazon from "../../icons/amazonWhite.svg";
import bookIcon from "../../icons/bookIcon.svg";
import authorImg from "../../icons/author.png";

const AuthorSection = () => {
  const { authorChosen } = useSelector((store) => store.book);
  const [authors, setAuthors] = useState([]);
  const [authorBooks, setAuthorBooks] = useState({});
  const [authorsLoaded, setAuthorsLoaded] = useState(false);
  const [authorReview, setAuthorReview] = useState({});

  function kFormatter(num) {
    return Math.abs(num) > 999
      ? (Math.abs(num) / 1000).toFixed(1) + "k"
      : Math.abs(num);
  }

  const dispatch = useDispatch();
  const getBooks = async () => {
    const response = await axios
      .get(`${urls.getBooksByAuthor}?start=0&end=10`)
      .then((res) => res.data)
      .catch((err) => {
        console.log(err);
      });
    const title = Object.keys(await response.books_authors);
    setAuthors(title);
    title.forEach((author) => {
      response.books_authors[`${author}`].sort((a, b) => {
        return b.stock_available - a.stock_available;
      });
    });
    setAuthorBooks(response.books_authors);
    title.forEach((author, index) => {
      let totalReview = 0;
      response.books_authors[`${author}`].forEach((book) => {
        totalReview += parseInt(book.review_count);
      });
      totalReview = kFormatter(totalReview);
      setAuthorReview((prevState) => ({
        ...prevState,
        [author]: totalReview,
      }));
    });
    setAuthorsLoaded(true);
  };
  useEffect(() => {
    getBooks();
  }, []);
  return (
    authorsLoaded && (
      <section className="px-8 md:px-2">
        <h1 className="font-bold text-[1.2rem] md:px-6">Authors</h1>
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
          {authors.map((author, index) => {
            return (
              <SwiperSlide
                key={index}
                className={`!max-w-[300px] !h-auto rounded-lg ${
                  authorChosen === author ? "!bg-mainColor" : "bg-unHighlight"
                }`}
              >
                <div
                  className="relative h-full flex flex-row justify-start items-center gap-2 overflow-hidden rounded-md"
                  onClick={() => {
                    authorChosen === author
                      ? dispatch(setAuthorChosen(null))
                      : dispatch(setAuthorChosen(author));
                  }}
                >
                  <div
                    className={`p-2 pr-[100px] h-full rounded-lg flex flex-col items-start justify-center authorDetails cursor-pointer`}
                  >
                    <div
                      className={`${
                        authorChosen === author ? "text-white" : ""
                      }`}
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
                        <p>{authorBooks[`${author}`].length} Books</p>
                      </div>
                      <div className="flex flex-row items-center justify-start gap-1">
                        <img
                          className={`w-[10px] ${
                            authorChosen === author ? "" : "invert"
                          }`}
                          src={amazon}
                          alt="Amazon"
                        />
                        <p>{authorReview[`${author}`]} Reviews</p>
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
        {authorsLoaded && authorChosen !== null && (
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
            {authorBooks[`${authorChosen}`]?.map((book, index) => {
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

export default AuthorSection;
