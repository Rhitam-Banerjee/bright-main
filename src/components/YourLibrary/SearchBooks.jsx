import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import axios from "axios";
import urls from "../../utils/urls";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "swiper/css/virtual";
import { FreeMode, Navigation, Virtual } from "swiper/modules";

import { CiSearch } from "react-icons/ci";
import bookIcon from "../../icons/bookIcon.svg";
import bookIconOrange from "../../icons/bookIconOrange.svg";

import authorImg from "../../icons/authorImg.svg";

import seriesImg from "../../icons/seriesImg.svg";
import seriesImgSelected from "../../icons/seriesImgSelected.svg";

import genreImg from "../../icons/genreImg.svg";
import genreImgSelected from "../../icons/genreImgSelected.svg";

import {
  setSearchAuthors,
  setSearchBooks,
  setSearchGenre,
  setSearchSeries,
} from "../../reducers/wishlistSlice";
import { setAlert } from "../../reducers/mainSlice";

import BookSlider from "./BookSlider";
import { FaAmazon } from "react-icons/fa";
import { NewBook } from "../Book";
import userEvent from "@testing-library/user-event";

function formatNumber(number) {
  const suffixes = ["", "k", "M", "B"];
  let suffixIndex = 0;

  while (number >= 1000 && suffixIndex < suffixes.length - 1) {
    number /= 1000;
    suffixIndex++;
  }

  return number.toFixed(1) + suffixes[suffixIndex];
}

const SearchBooks = () => {
  const {
    registerDetails: { mobileNumber },
  } = useSelector((store) => store.main);
  const { searchBooks, searchAuthors, searchSeries, searchGenre } = useSelector(
    (store) => store.wishlist
  );

  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [tabOpen, setTabOpen] = useState("Books");

  const [authorChosen, setAuthorChosen] = useState(null);
  const [authorBooks, setAuthorBooks] = useState([]);
  const [authorsBookLoaded, setAuthorsBookLoaded] = useState(false);

  const [seriesChosen, setSeriesChosen] = useState(null);
  const [seriesBook, setSeriesBook] = useState([]);
  const [seriesBookLoaded, setSeriesBookLoaded] = useState(false);

  const [genreChosen, setGenreChosen] = useState(null);
  const [genreBook, setGenreBook] = useState([]);
  const [genreBookLoaded, setGenreBookLoaded] = useState(false);

  const handleSearchSubmit = async () => {
    try {
      const response = await axios
        .get(
          `${
            urls.getSearch
          }?to_search=${searchText.toString()}&mobile_number=${mobileNumber}`
        )
        .then((res) => res.data)
        .catch((err) => console.log(err));
      if (response.result.books.length > 0) {
        response.result.books?.sort((a, b) => {
          return b.review_count - a.review_count;
        });
        response.result.books?.sort((a, b) => {
          return b.match - a.match;
        });
        dispatch(setSearchBooks(response.result.books));
      }
      if (response.result.authors.length > 0) {
        response.result.authors?.sort((a, b) => {
          return b.review_count - a.review_count;
        });
        response.result.authors?.sort((a, b) => {
          return b.match - a.match;
        });
        dispatch(setSearchAuthors(response.result.authors));
        setAuthorChosen(response.result.authors[0].id);
        getBooksOfAuthors(response.result.authors[0].id);
      }
      if (response.result.series.length > 0) {
        response.result.series?.sort((a, b) => {
          return b.review_count - a.review_count;
        });
        response.result.series?.sort((a, b) => {
          return b.match - a.match;
        });
        dispatch(setSearchSeries(response.result.series));
        setSeriesChosen(response.result.series[0].id);
        getBooksOfSeries(response.result.series[0].id);
      }
      if (response.result.genres.length > 0) {
        response.result.genres?.sort((a, b) => {
          return b.review_count - a.review_count;
        });
        response.result.genres?.sort((a, b) => {
          return b.match - a.match;
        });
        dispatch(setSearchGenre(response.result.genres));
        setGenreChosen(response.result.genres[0].id);
        getBooksOfGenre(response.result.genres[0].id);
      }
      setHasSearched(true);
    } catch (error) {
      console.log(error);
    }
  };

  const getBooksOfAuthors = async (author_id) => {
    try {
      const response = await axios
        .get(`${urls.getBooksFromAuthor}?author_id=${author_id}`)
        .then((res) => res.data)
        .catch((err) => console.log(err));
      response.books?.sort((a, b) => {
        return b.review_count - a.review_count;
      });
      response.books?.sort((a, b) => {
        return b.stocks_available - a.stocks_available;
      });
      setAuthorBooks(response.books);
      setAuthorsBookLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };

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
      setSeriesBookLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };

  const getBooksOfGenre = async (genre_id) => {
    try {
      const response = await axios
        .get(`${urls.getBooksFromGenre}?genre_id=${genre_id}`)
        .then((res) => res.data)
        .catch((err) => console.log(err));
      response.books?.sort((a, b) => {
        return b.review_count - a.review_count;
      });
      response.books?.sort((a, b) => {
        return b.stocks_available - a.stocks_available;
      });
      setGenreBook(response.books);
      setGenreChosen(genre_id);
      setGenreBookLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setSearchText("");
    setHasSearched(false);
  }, []);

  return (
    <section className="relative p-[20px] my-[20px] bg-mainColor rounded-[5px]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (searchText.length > 2) {
            handleSearchSubmit();
          } else {
            dispatch(
              setAlert({
                text: `Search should be more than 2 letters`,
                color: "#F75549",
              })
            );
          }
        }}
        className="mx-auto p-[10px] h-[34px] max-w-[530px] flex-1 flex flex-row justify-start items-center border-[1px] border-white bg-[#ffffff36] rounded-[5px]"
      >
        <button
          className="w-max h-full grid place-items-center mr-[10px]"
          type="submit"
        >
          <CiSearch className="text-[14px] text-white" />
        </button>
        <input
          type="text"
          className="w-full h-full bg-transparent placeholder-white text-[13px] text-white"
          placeholder="Didn't find what you are looking for?"
          value={searchText}
          onChange={({ target: { value } }) => {
            setSearchText(value);
          }}
        />
      </form>
      {(searchBooks.length > 0 ||
        searchAuthors.length > 0 ||
        searchGenre.length > 0 ||
        searchSeries.length > 0) &&
        hasSearched && (
          <Swiper
            slidesPerView={"auto"}
            grabCursor={true}
            freeMode={true}
            navigation={true}
            modules={[FreeMode, Navigation, Virtual]}
            className="mySwiper no-slider-arrow pb-2 my-[20px] w-full max-w-[400px] !mx-auto"
          >
            <SwiperSlide
              className={`${
                tabOpen === "Books"
                  ? "bg-white text-mainColor"
                  : "bg-[#ffffff36] text-white"
              } ml-[12px] flex flex-row justify-center items-center px-[20px] py-[10px] border-[1px] border-white rounded-[5px]`}
              onClick={() => setTabOpen("Books")}
            >
              <span className="text-[10px] font-semibold">Books</span>
            </SwiperSlide>
            <SwiperSlide
              className={`${
                tabOpen === "Authors"
                  ? "bg-white text-mainColor"
                  : "bg-[#ffffff36] text-white"
              } ml-[12px] flex flex-row justify-center items-center px-[20px] py-[10px] border-[1px] border-white rounded-[5px]`}
              onClick={() => setTabOpen("Authors")}
            >
              <span className="text-[10px] font-semibold">Authors</span>
            </SwiperSlide>
            <SwiperSlide
              className={`${
                tabOpen === "Series"
                  ? "bg-white text-mainColor"
                  : "bg-[#ffffff36] text-white"
              } ml-[12px] flex flex-row justify-center items-center px-[20px] py-[10px] border-[1px] border-white rounded-[5px]`}
              onClick={() => setTabOpen("Series")}
            >
              <span className="text-[10px] font-semibold">Series</span>
            </SwiperSlide>
            <SwiperSlide
              className={`${
                tabOpen === "Genre"
                  ? "bg-white text-mainColor"
                  : "bg-[#ffffff36] text-white"
              } ml-[12px] flex flex-row justify-center items-center px-[20px] py-[10px] border-[1px] border-white rounded-[5px]`}
              onClick={() => setTabOpen("Genre")}
            >
              <span className="text-[10px] font-semibold">Genre</span>
            </SwiperSlide>
          </Swiper>
        )}
      {hasSearched && (
        <>
          {tabOpen === "Books" && (
            <>
              {searchBooks.length > 0 ? (
                <Swiper
                  slidesPerView={"auto"}
                  grabCursor={true}
                  freeMode={true}
                  navigation={true}
                  modules={[FreeMode, Navigation, Virtual]}
                  className="mySwiper no-slider-arrow !mx-auto"
                >
                  {searchBooks?.map((book, index) => {
                    return (
                      <SwiperSlide
                        key={index}
                        className="!rounded-[5px] bg-transparent"
                      >
                        <BookSlider book={book} />
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              ) : (
                <span className="w-full flex justify-center items-center mt-[20px] text-white font-bold text-[14px]">
                  No Books of {searchText} Found
                </span>
              )}
            </>
          )}
          {tabOpen === "Authors" && (
            <>
              {searchAuthors.length > 0 ? (
                <>
                  <Swiper
                    slidesPerView={"auto"}
                    grabCursor={true}
                    freeMode={true}
                    navigation={true}
                    modules={[FreeMode, Navigation, Virtual]}
                    className="mySwiper no-slider-arrow p-4"
                  >
                    {searchAuthors?.map((author, index) => {
                      return (
                        <SwiperSlide
                          key={author}
                          className={`!max-w-[180px] !h-auto rounded-lg ${
                            authorChosen === author.id
                              ? "!bg-mainColor shadow-customShadowLight"
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
                                  ? `${author.name.replace(
                                      / *\([^)]*\) */g,
                                      ""
                                    )}`
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
                                      authorChosen === author.id
                                        ? bookIconOrange
                                        : bookIcon
                                    }
                                    alt="BooksCount"
                                  />
                                  <p className="text-[8px]">
                                    {author.books} Books
                                  </p>
                                </div>
                                <div className="flex flex-row items-center justify-start gap-1">
                                  <FaAmazon className="w-[8px] translate-y-[1px]" />
                                  <p>
                                    <span className="text-[8px]">
                                      {formatNumber(author.review_count)}
                                    </span>
                                    <span className="pl-[2px] text-[8px]">
                                      Reviews
                                    </span>
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
                  {authorBooks.length > 0 && authorChosen && (
                    <Swiper
                      slidesPerView={"auto"}
                      grabCursor={true}
                      freeMode={true}
                      navigation={true}
                      modules={[FreeMode, Navigation, Virtual]}
                      className="mySwiper p-4 no-slider-arrow"
                    >
                      {authorBooks.map((book, index) => {
                        return (
                          <SwiperSlide
                            key={index}
                            className="flex flex-col !w-[150px]"
                            virtualIndex={index}
                          >
                            <BookSlider key={index} book={book} />
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  )}
                </>
              ) : (
                <span className="w-full flex justify-center items-center mt-[20px] text-white font-bold text-[14px]">
                  No Author of {searchText} Found
                </span>
              )}
            </>
          )}
          {tabOpen === "Series" && (
            <>
              {searchSeries.length > 0 ? (
                <>
                  <Swiper
                    slidesPerView={"auto"}
                    grabCursor={true}
                    // centeredSlides={true}
                    // centeredSlidesBounds={true}
                    freeMode={true}
                    navigation={true}
                    modules={[FreeMode, Navigation, Virtual]}
                    className="mySwiper no-slider-arrow p-4"
                  >
                    {searchSeries?.map((serie, index) => {
                      return (
                        <SwiperSlide
                          key={index}
                          className={`!max-w-[180px] !h-auto rounded-lg  ${
                            seriesChosen === serie.id
                              ? "!bg-mainColor shadow-customShadowLight"
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
                                  ? `${serie.name.replace(
                                      / *\([^)]*\) */g,
                                      ""
                                    )}`
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
                                      seriesChosen === serie.id
                                        ? bookIconOrange
                                        : bookIcon
                                    }
                                    alt="BooksCount"
                                  />
                                  <p className="text-[8px]">
                                    {serie.books} Books
                                  </p>
                                </div>
                                <div className="flex flex-row items-center justify-start gap-1">
                                  <FaAmazon className="w-[8px] translate-y-[1px]" />
                                  <p>
                                    <span className="text-[8px]">
                                      {formatNumber(serie.review_count)}
                                    </span>
                                    <span className="pl-[2px] text-[8px]">
                                      Reviews
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="">
                              <img
                                className="absolute !bottom-0 right-[0px] w-[73px] !z-10 saturate-0"
                                src={
                                  seriesChosen === serie.id
                                    ? seriesImgSelected
                                    : seriesImg
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
                  {seriesBook.length > 0 && seriesChosen && (
                    <Swiper
                      slidesPerView={"auto"}
                      grabCursor={true}
                      freeMode={true}
                      navigation={true}
                      modules={[FreeMode, Navigation, Virtual]}
                      className="mySwiper p-4 no-slider-arrow"
                    >
                      {seriesBook.map((book, index) => {
                        return (
                          <SwiperSlide
                            key={index}
                            className="flex flex-col !w-[150px]"
                            virtualIndex={index}
                          >
                            <BookSlider book={book} />
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  )}
                </>
              ) : (
                <span className="w-full flex justify-center items-center mt-[20px] text-white font-bold text-[14px]">
                  No Series of {searchText} Found
                </span>
              )}
            </>
          )}
          {tabOpen === "Genre" && (
            <>
              {searchGenre.length > 0 ? (
                <>
                  <Swiper
                    slidesPerView={"auto"}
                    grabCursor={true}
                    // centeredSlides={true}
                    // centeredSlidesBounds={true}
                    freeMode={true}
                    navigation={true}
                    modules={[FreeMode, Navigation, Virtual]}
                    className="mySwiper no-slider-arrow p-4"
                  >
                    {searchGenre?.map((genre, index) => {
                      return (
                        <SwiperSlide
                          key={index}
                          className={`!max-w-[300px] !h-auto rounded-lg ${
                            genreChosen === genre.id
                              ? "!bg-mainColor shadow-customShadowLight"
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
                                  ? `${genre.name.replace(
                                      / *\([^)]*\) */g,
                                      ""
                                    )}`
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
                                      genreChosen === genre.id
                                        ? bookIconOrange
                                        : bookIcon
                                    }
                                    alt="BooksCount"
                                  />
                                  <p className="text-[8px]">
                                    {genre.books} Books
                                  </p>
                                </div>
                                <div className="flex flex-row items-center justify-start gap-1">
                                  <FaAmazon className="w-[8px] translate-y-[2px]" />
                                  <p>
                                    <span className="text-[8px]">
                                      {formatNumber(genre.review_count)}
                                    </span>
                                    <span className="pl-[2px] text-[8px]">
                                      Reviews
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="">
                              <img
                                className="absolute !bottom-0 right-[0px] w-[66px] !z-10 saturate-0"
                                src={
                                  genreChosen === genre.id
                                    ? genreImgSelected
                                    : genreImg
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
                  {genreBook.length > 0 && genreChosen && (
                    <Swiper
                      slidesPerView={"auto"}
                      grabCursor={true}
                      freeMode={true}
                      navigation={true}
                      modules={[FreeMode, Navigation, Virtual]}
                      className="mySwiper p-4 no-slider-arrow"
                    >
                      {genreBook.map((book, index) => {
                        return (
                          <SwiperSlide
                            key={index}
                            className="flex flex-col !w-[150px]"
                            virtualIndex={index}
                          >
                            <BookSlider book={book} />
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  )}
                </>
              ) : (
                <span className="w-full flex justify-center items-center mt-[20px] text-white font-bold text-[14px]">
                  No Genre of {searchText} Found
                </span>
              )}
            </>
          )}
        </>
      )}
    </section>
  );
};

export default SearchBooks;
