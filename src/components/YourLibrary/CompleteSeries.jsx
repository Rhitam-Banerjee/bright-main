import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import urls from "../../utils/urls";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "swiper/css/virtual";
import { FreeMode, Navigation, Virtual } from "swiper/modules";

import seriesImg from "../../icons/seriesImg.svg";
import seriesImgSelected from "../../icons/seriesImgSelected.svg";
import bookIcon from "../../icons/bookIcon.svg";
import bookIconOrange from "../../icons/bookIconOrange.svg";
import bookIconGrey from "../../icons/bookIconGrey.svg";
import bookQuestionwhite from "../../icons/bookQuestionIconWhite.svg";
import bookQuestionIconStroke from "../../icons/bookQuestionIconGreyStroke.svg";
import heartGrey from "../../icons/heartFillGrey.svg";
import heartWhite from "../../icons/heartFillWhite.svg";
import { FaAmazon } from "react-icons/fa";
import { PiFlagPennantFill } from "react-icons/pi";

import { BookSlider } from "./";

function formatNumber(number) {
  const suffixes = ["", "k", "M", "B"];
  let suffixIndex = 0;

  while (number >= 1000 && suffixIndex < suffixes.length - 1) {
    number /= 1000;
    suffixIndex++;
  }

  return number.toFixed(1) + suffixes[suffixIndex];
}

const CompleteSeries = () => {
  const dispatch = useDispatch();
  const { wishlist, completeSeries, booksRead } = useSelector(
    (store) => store.wishlist
  );

  const [filter, setFilter] = useState("all");
  const [bookCount, setBookCount] = useState();
  const [wishlistBooks, setWishListBooks] = useState([]);
  const [wishReadBooks, setWishReadBooks] = useState([]);
  const [seriesBook, setSeriesBook] = useState([]);
  const [booksDisplay, setBooksDisplay] = useState([]);
  const [seriesBookLoaded, setSeriesBookLoaded] = useState(false);
  const [seriesChosen, setSeriesChosen] = useState(null);

  const getBooksOfSeries = async (series_id) => {
    try {
      const response = await axios
        .get(`${urls.getBooksFromSeries}?category_id=${series_id}`)
        .then((res) => res.data)
        .catch((err) => console.log(err));

      response.books?.sort((a, b) => {
        return b.review_count - a.review_count;
      });
      response.books?.sort((a, b) => {
        return b.stocks_available - a.stocks_available;
      });
      setSeriesBook(response.books);
      filterBooks("all", response.books);
      setSeriesBookLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };

  const getBooks = () => {
    let books = new Set();
    wishlist.forEach((book) => {
      books.add(book.isbn);
    });
    let wishBook = Array.from(books);
    setWishListBooks(wishBook);
    booksRead.forEach((book) => {
      books.add(book);
    });
    let newBooks = Array.from(books);
    setWishReadBooks(newBooks);
  };

  const filterBooks = (dsp, books) => {
    if (dsp === "all") {
      const allBooks = books.filter((book) => {
        return !wishReadBooks.includes(book.isbn);
      });
      setBooksDisplay((prev) => {
        return (prev = allBooks);
      });
    }
    if (dsp === "wishlist") {
      const wishBook = books.filter((book) => {
        console.log(book.isbn);
        return wishlistBooks.includes(book.isbn);
      });
      setBooksDisplay((prev) => {
        return (prev = wishBook);
      });
    }
    if (dsp === "read") {
      const readBooks = books.filter((book) => {
        return booksRead.includes(book.isbn);
      });
      setBooksDisplay((prev) => {
        return (prev = readBooks);
      });
    }
  };

  useEffect(() => {
    if (completeSeries?.length > 0) {
      getBooksOfSeries(completeSeries[0]?.id);
      setSeriesChosen(completeSeries[0]?.id);
    }
  }, []);

  useEffect(() => {
    if (wishlist.length > 0) {
      getBooks();
    }
  }, [filter]);

  return (
    <section className="mt-[20px] w-full">
      <div className="mb-[10px] flex flex-row justify-between items-center ">
        <div className="flex flex-row justify-start items-center gap-[10px]">
          <PiFlagPennantFill className="text-[14px] text-mainColor" />
          <span className="text-[12px] font-bold">Complete your series</span>
        </div>
        <div className="ml-auto flex flex-row justify-start items-center gap-[10px]">
          <span
            className={`${
              filter === "all" ? "bg-unHighlightLight" : "bg-white"
            } flex flex-row justify-start items-center gap-[5px] p-1 border-[1px] border-unHighlightLight rounded-[5px]`}
            onClick={() => {
              filterBooks("all", seriesBook);
              setFilter((prev) => {
                return (prev = "all");
              });
            }}
          >
            <img
              src={
                filter === "all" ? bookQuestionwhite : bookQuestionIconStroke
              }
              alt=""
            />
            {filter === "all" && (
              <span
                className={`${
                  filter === "all" ? "text-white" : ""
                } text-[10px] font-semibold`}
              >
                {booksDisplay?.length}
              </span>
            )}
          </span>
          <span
            className={`${
              filter === "wishlist" ? "bg-unHighlightLight" : "bg-white"
            } flex flex-row justify-start items-center gap-[5px] p-1 border-[1px] border-unHighlightLight rounded-[5px]`}
            onClick={() => {
              filterBooks("wishlist", seriesBook);
              setFilter((prev) => {
                return (prev = "wishlist");
              });
            }}
          >
            <img src={filter === "wishlist" ? heartWhite : heartGrey} alt="" />
            {filter === "wishlist" && (
              <span
                className={`${
                  filter === "wishlist" ? "text-white" : ""
                } text-[10px] font-semibold`}
              >
                {booksDisplay?.length}
              </span>
            )}
          </span>
          <span
            className={`${
              filter === "read" ? "bg-unHighlightLight" : "bg-white"
            } flex flex-row justify-start items-center gap-[5px] p-1 border-[1px] border-unHighlightLight rounded-[5px]`}
            onClick={() => {
              filterBooks("read", seriesBook);
              setFilter((prev) => {
                return (prev = "read");
              });
            }}
          >
            <img src={filter === "read" ? bookIcon : bookIconGrey} alt="" />
            {filter === "read" && (
              <span
                className={`${
                  filter === "read" ? "text-white" : ""
                } text-[10px] font-semibold`}
              >
                {booksDisplay?.length}
              </span>
            )}
          </span>
        </div>
      </div>
      <Swiper
        slidesPerView={"auto"}
        grabCursor={true}
        freeMode={true}
        navigation={true}
        modules={[FreeMode, Navigation, Virtual]}
        className="mySwiper no-slider-arrow"
      >
        {completeSeries?.map((serie, index) => {
          return (
            <SwiperSlide
              key={index}
              className={`!max-w-[180px] !h-auto rounded-lg  ${
                seriesChosen === serie.id
                  ? "!bg-mainColor"
                  : "bg-mainColorLight"
              }`}
            >
              <div
                className="relative w-[180px] h-[80px] flex flex-row justify-start items-center gap-2 overflow-hidden rounded-md"
                onClick={() => {
                  if (seriesChosen === serie.id) {
                    setSeriesChosen(null);
                  } else {
                    setSeriesChosen(serie.id);
                    getBooksOfSeries(serie.id);
                    setFilter((prev) => {
                      return (prev = "all");
                    });
                  }
                }}
              >
                <div
                  className={`p-2 h-full rounded-lg flex flex-col items-start justify-center cursor-pointer`}
                >
                  <div
                    className={`${
                      seriesChosen === serie.id ? "text-white" : ""
                    } font-bold text-[12px]`}
                  >
                    {serie.name?.length <= 16
                      ? `${serie.name.replace(/ *\([^)]*\) */g, "")}`
                      : `${serie.name
                          .replace(/ *\([^)]*\) */g, "")
                          .substring(0, 13)}...`}
                  </div>
                  <div
                    className={`flex flex-col mt-4 text-[12px] gap-0 ${
                      seriesChosen === serie.id ? "text-white" : ""
                    }`}
                  >
                    <div className="flex flex-row items-center justify-start gap-1">
                      <img
                        className={`w-[8px] ${
                          seriesChosen === serie.id ? "" : "invert"
                        }`}
                        src={
                          seriesChosen === serie.id ? bookIconOrange : bookIcon
                        }
                        alt="BooksCount"
                      />
                      <p className="text-[8px]">
                        {serie.books_read} / {serie.books} Books
                      </p>
                    </div>
                    <div className="flex flex-row items-center justify-start gap-1">
                      <FaAmazon className="w-[8px] translate-y-[1px]" />
                      <p>
                        <span className="text-[8px]">
                          {formatNumber(serie.review_count)}
                        </span>
                        <span className="pl-[2px] text-[8px]">Reviews</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="">
                  <img
                    className="absolute !bottom-0 right-[0px] w-[73px] !z-10 saturate-0"
                    src={
                      seriesChosen === serie.id ? seriesImgSelected : seriesImg
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
      {seriesBookLoaded && seriesChosen && (
        <Swiper
          slidesPerView={"auto"}
          grabCursor={true}
          freeMode={true}
          navigation={true}
          modules={[FreeMode, Navigation, Virtual]}
          className="mySwiper !py-4 no-slider-arrow"
        >
          {booksDisplay.map((book, index) => {
            return (
              <SwiperSlide
                key={index}
                className="flex flex-col !w-[150px]"
                virtualIndex={index}
              >
                <BookSlider
                  book={book}
                  hasRead={booksRead?.includes(book.isbn)}
                  fromSet={seriesBook}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </section>
  );
};

export default CompleteSeries;
