import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import devUrls from "../../utils/devUrls";
import urls from "../../utils/urls";
import axios from "axios";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "swiper/css/virtual";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Virtual } from "swiper/modules";

import { FaAmazon, FaHeart, FaYoutube } from "react-icons/fa";
import { FaStar } from "react-icons/fa";

import moment from "moment";
import { setBooksAuthors, setBookInSeries } from "../../reducers/bookSlice";

import { NewBook } from "./";

import { addToWishlist } from "../../reducers/wishlistSlice";
import { setAlert } from "../../reducers/mainSlice";
import { CiHeart } from "react-icons/ci";
import clockIcon from "../../icons/clock.svg";
import bookIconOrange from "../../icons/bookIconOrange.svg";

const yt_url_video_link_prefix = "https://www.youtube.com/watch?v=";
const yt_url_video_thumbnail_prefix = "https://i.ytimg.com/vi/";

const Book = () => {
  function kFormatter(num) {
    return Math.abs(num) > 999
      ? (Math.abs(num) / 1000).toFixed(1) + "k"
      : Math.abs(num);
  }

  const { isbn } = useParams();
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const { age, authors } = useSelector((store) => store.book);
  const { isLoggedIn } = useSelector((store) => store.main);
  const [hasBookVideos, setHasBookVideos] = useState(false);
  const [hasBookSetVideos, setHasBookSetVideos] = useState(false);

  const [book, setBook] = useState(null);
  const [bookVideos, setBookVideos] = useState([]);
  const [bookViews, setTotalViews] = useState(0);
  const [bookSetVideos, setBookSetVideos] = useState([]);
  const [bookSetViews, setTotalSetViews] = useState(0);
  const [seriesName, setSeriesName] = useState(null);
  const [seriesBook, setSeriesBook] = useState([]);
  const [authorsBook, setAuthorsBook] = useState({});
  const [authorReview, setAuthorReview] = useState({});
  const [seriesReview, setSeriesReview] = useState("");

  const [wishClickedMap, setWishClickedMap] = useState({});
  const [wishListBooks, setWishListBooks] = useState([]);

  const getseriesBooks = async () => {
    try {
      const response = await axios
        .get(
          age === "" || age === undefined
            ? `${urls.getBookSeries}?isbn=${isbn}`
            : `${urls.getBookSeries}?isbn=${isbn}&age=${age}`
        )
        .then((res) => res.data)
        .catch((err) => console.log(err));
      response.books.books.sort((a, b) => {
        return b.stock_available - a.stock_available;
      });
      setSeriesName(response.books.name);
      setSeriesBook(response.books.books);
      let totalReview = 0;
      response.books.books.forEach((book) => {
        totalReview += book.review_count;
      });
      setSeriesReview(kFormatter(totalReview));
    } catch (err) {
      console.log(err);
    }
  };

  const getBook = async () => {
    try {
      const response = await axios
        .get(`${urls.getBookDetails}?isbn=${isbn}`)
        .then((res) => res.data)
        .catch((err) => console.log(err));
      setBook(response.book);
    } catch (err) {
      console.log(err);
    }
  };

  const getBookVideo = async () => {
    try {
      const response = await axios
        .get(urls.getBookYTVideos, {
          params: { isbn: String(isbn) },
        })
        .then((res) => res.data)
        .catch((err) => console.log(err));
      if (response.status) {
        setBookVideos(response.book_videos);
        setHasBookVideos(true);
        let totalViews = 0;
        response.book_videos.forEach((book) => {
          totalViews += book.views;
        });
        totalViews = kFormatter(totalViews);
        setTotalViews(totalViews);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getBookSetVideo = async () => {
    try {
      const response = await axios
        .get(urls.getBookSetYtVideos, {
          params: { isbn: String(isbn) },
        })
        .then((res) => res.data)
        .catch((err) => console.log(err));
      if (response.status) {
        setBookSetVideos(response.book_set_videos);
        setHasBookSetVideos(true);
        let totalViews = 0;
        response.book_set_videos.forEach((book) => {
          totalViews += book.views;
        });
        totalViews = kFormatter(totalViews);
        setTotalSetViews(totalViews);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getAuthorBooks = async () => {
    try {
      const response = await axios
        .get(urls.getAuthorNameBook, {
          params: { book_search_id: String(isbn) },
        })
        .then((res) => res.data)
        .catch((err) => console.log(err));
      const title = Object.keys(await response.book);
      title.forEach((author) => {
        response.book[`${author}`].sort((a, b) => {
          return b.stock_available - a.stock_available;
        });
      });
      setAuthorsBook(response.book);

      title.forEach((author) => {
        let totalReview = 0;
        response.book[`${author}`].forEach((book) => {
          totalReview += parseInt(book.review_count);
        });
        totalReview = kFormatter(totalReview);
        setAuthorReview((prevState) => ({
          ...prevState,
          [author]: totalReview,
        }));
      });
      title.sort((a, b) => {
        return response.book[`${b}`].length - response.book[`${a}`].length;
      });

      dispatch(setBooksAuthors(title));
    } catch (err) {
      console.log(err);
    }
    // try {
    //   const response = await axios
    //     .get(`${urls.getBookAuthors}?isbn=${isbn}`)
    //     .then((res) => res.data)
    //     .catch((err) => console.log(err));
    //   const title = [];
    //   if (response.status) {
    //     response.authors.sort((a, b) => {
    //       return b.author_books.length - a.author_books.length;
    //     });
    //     response.authors.forEach((author) => {
    //       title.push(author.name);
    //     });
    //     response.authors.forEach((author) => {
    //       let totalReview = 0;
    //       author.author_books.forEach((book) => {
    //         totalReview += book.review_count;
    //       });
    //       totalReview = kFormatter(totalReview);
    //       setAuthorReview((prevState) => ({
    //         ...prevState,
    //         [author]: totalReview,
    //       }));
    //     });
    //     response.authors.forEach((author, index) => {
    //       setAuthorsBook((prevState) => ({
    //         ...prevState,
    //         [author]: response.authors[index].author_books,
    //       }));
    //     });
    //     dispatch(setBooksAuthors(title));
    //   }
    // } catch (err) {
    //   console.log(err);
    // }
  };

  const wishlistAdd = async (book) => {
    dispatch(
      setAlert({ text: `${book.name} added to wishlist`, color: "#33A200" })
    );
    dispatch(addToWishlist({ book }));
    try {
      await axios.post(
        devUrls.addToWishlist,
        { isbn: book.isbn },
        { withCredentials: true }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const addToReadList = async (isbn) => {
    const isbnData = { isbn: isbn };

    try {
      const isBookInWishlist = wishListBooks.some((book) => book.isbn === isbn);
      if (!isBookInWishlist) {
        // If the book is not in the wishlist, add it
        const response = await axios
          .post(
            `https://server.brightr.club/api_v2/add-to-wishlist`,
            isbnData,
            { withCredentials: true }
          )
          .then((res) => res.data);
        if (response.status === "success") {
          setWishListBooks((prevBooks) => [...prevBooks, book]);
          setWishClickedMap((prevMap) => {
            const updatedMap = { ...prevMap };
            updatedMap[isbn] = true;
            return updatedMap;
          });
          dispatch(setAlert({ text: `Added to wishlist`, color: "#33A200" }));
        } else {
          dispatch(setAlert({ text: `There was an error`, color: "#F75549" }));
        }
      } else {
        // If the book is already in the wishlist, remove it
        const response = await axios
          .post(
            `https://server.brightr.club/api_v2/wishlist-remove`,
            isbnData,
            { withCredentials: true }
          )
          .then((res) => res.data);
        if (response.status === "success") {
          setWishListBooks((prevBooks) =>
            prevBooks.filter((book) => book.isbn !== isbn)
          );
          setWishClickedMap((prevMap) => {
            const updatedMap = { ...prevMap };
            updatedMap[isbn] = false;
            return updatedMap;
          });
          dispatch(
            setAlert({ text: `Removed from wishlist`, color: "#F75549" })
          );
        } else {
          dispatch(setAlert({ text: `There was an error`, color: "#F75549" }));
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getBook();
    getseriesBooks();
    getAuthorBooks();
    getBookVideo();
    getBookSetVideo();
  }, [isbn]);

  if (!book)
    return (
      <h1 className="m-40 p-4 text-[2rem] text-center text-secondary font-black">
        Loading...
      </h1>
    );
  return (
    <section className="px-8 py-2 md:px-4 mt-[70px] m-auto w-full h-full">
      <div className="flex flex-col justify-center gap-8 w-full max-w-[600px] m-auto h-full">
        <div className="flex flex-col w-full">
          {seriesName && (
            <div className="!p-0 flex flex-row items-center">
              <div className="text-[12px] md:text-[10px] text-mainColor md:max-w-full !w-max font-bold">
                {seriesName}
              </div>
              <div className="text-[12px] md:text-[10px] text-unHighlightDark font-bold border-l-[0.5px] border-secondary ml-2 pl-2">
                {seriesBook?.length} Books
              </div>
              <div className="text-[12px] md:text-[10px] text-unHighlightLight font-bold border-l-[0.5px] border-secondary ml-2 pl-2">
                {seriesReview} Reviews
              </div>
            </div>
          )}
          <div className="relative w-full flex flex-row justify-between py-[11px] text-[16px] md:text-[12px] font-bold">
            <span className="text-[15px] font-bold">{book.name}</span>
            <span className="flex flex-row items-center">
              {kFormatter(book.review_count)} <FaAmazon className="mx-[4px]" />
              Reviews
            </span>
            <span className="absolute -bottom-[17px] right-0 w-[35px] h-[20px] flex flex-row items-center">
              {book.rating}
              <FaStar className="text-secondary ml-1 -translate-y-[1px]" />
            </span>
          </div>
          {authors.map((author, index) => {
            return (
              authorsBook[`${author}`]?.length > 0 && (
                <div
                  className="!p-0 mb-2 flex flex-row items-center"
                  key={index}
                >
                  <Link
                    to={`/author/${author}`}
                    className="text-[12px] md:text-[10px] md:max-w-full !w-max font-bold text-mainColor"
                  >
                    {author}
                  </Link>
                  <div className="text-[12px] md:text-[10px] text-unHighlightDark font-bold border-l-[0.5px] border-secondary ml-2 pl-2">
                    {authorsBook[`${author}`]?.length} Books
                  </div>
                  <div className="text-[12px] md:text-[10px] text-unHighlightLight font-bold border-l-[0.5px] border-secondary ml-2 pl-2">
                    {authorReview[author]} Reviews
                  </div>
                </div>
              )
            );
          })}
        </div>
        <div className="w-full h-full">
          <div
            className={`relative m-auto w-max h-full bg-white flex flex-col`}
          >
            <div className="grid place-items-center p-[30px] m-auto h-[340px] w-[340px] bg-lightGrey rounded-md">
              <div className="m-auto h-max w-full">
                <img
                  className="w-auto h-[280px] !max-h-[280px] m-auto"
                  src={book.image
                    .replace("US2", "US8")
                    .replace("SX2", "SX8")
                    .replace("_US", "_SY")}
                  alt="BookImage"
                />
              </div>
            </div>
            <div className="absolute grid place-items-center top-0 right-0 w-[100px] h-[27px] bg-mainColor rounded-tr-[5px] rounded-bl-[5px] shadow-lg">
              <span className="text-[12px] font-medium text-white">
                {book.min_age}
                <em className="text-secondary px-[2px]">-</em>
                {book.max_age} Years
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col h-full">
          {isLoggedIn && (
            <div
              className="flex flex-row justify-center items-center text-[12px] text-mainColor font-bold h-[45px] w-full max-w-[340px] m-auto border-[2px] border-mainColor cursor-pointer rounded-[5px]"
              onClick={() => wishlistAdd(book)}
            >
              <CiHeart className="w-[22px] h-[22px]" />
              Add To Wishlist
            </div>
          )}
          <div className="mb-auto">
            {book.description && (
              <div className="pt-[13px] pb-[23px] font-medium text-[10px] md:text-[9px]">
                <span className="line-clamp-4">{book.description}</span>
                <span className="text-[10px] font-bold">view more</span>
              </div>
            )}
            {book.publisher && book.language && book.pages && (
              <div className="mt-auto !p-0 mb-4 flex flex-row items-center">
                <div className="text-[12px] md:text-[8px] md:max-w-full !w-max font-bold">
                  {book.publisher}
                </div>
                <div className="text-[12px] md:text-[8px] text-unHighlightDark font-bold border-l-[0.5px] border-secondary ml-2 pl-2">
                  {book.language}
                </div>
                <div className="text-[12px] md:text-[8px] text-unHighlightDark font-bold border-l-[0.5px] border-secondary ml-2 pl-2">
                  {book.pages} Pages
                </div>
              </div>
            )}
          </div>
          {/* {book.book_type && <div>{book.book_type}</div>} */}
        </div>
      </div>
      {hasBookVideos && bookVideos.length > 0 && (
        <div className="mt-[50px]">
          <div className="text-[16px] md:text-[12px] font-bold">
            <span className="text-unHighlightDark">Book Videos</span>
            <span className="text-unHighlightDark opacity-50 border-l-[0.5px] border-secondary ml-2 pl-2">
              {bookVideos.length} Videos
            </span>
            <span className="text-unHighlightDark opacity-50 border-l-[0.5px] border-secondary ml-2 pl-2">
              {bookViews} Views
            </span>
          </div>
          <div>
            <Swiper
              slidesPerView={"auto"}
              grabCursor={true}
              centeredSlides={true}
              centeredSlidesBounds={true}
              freeMode={true}
              navigation={true}
              modules={[FreeMode, Navigation, Virtual]}
              className="mySwiper py-2"
            >
              {bookVideos.map((video, index) => {
                return (
                  <SwiperSlide key={index} className="h-full w-full">
                    <div className="h-[150px]">
                      <iframe
                        className="h-[150px] w-[300px] flex bg-cover bg-no-repeat rounded-[5px] z-0"
                        src={`https://www.youtube.com/embed/${video.yt_links}?wmode=opaque`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen={true}
                      ></iframe>
                    </div>
                    <div className="mt-[9px] px-[24px] py-[7px] flex flex-row text-[9px] font-semibold justify-center items-center bg-lightGrey rounded-[5px]">
                      <span className="flex flex-row items-center">
                        <img
                          className="mr-[8px]"
                          src={bookIconOrange}
                          alt="bookIcon"
                        />
                        {`${book.name
                          .replace(/ *\([^)]*\) */g, "")
                          .substring(0, 16)}...`}
                      </span>
                      <span className="px-2 mx-2 border-l-[1px] border-r-[1px] border-secondary flex flex-row items-center">
                        <img
                          className="-translate-y-[1px] mr-[8px]"
                          src={clockIcon}
                          alt="Clock"
                        />
                        {video.duration.includes(":")
                          ? video.duration
                          : "0:" + video.duration}
                      </span>
                      <span className="flex flex-row items-center">
                        {kFormatter(video.views)}
                        <FaYoutube className="w-[12px] -translate-y-[1px] mx-[5px] text-[#ff0000]" />{" "}
                        Views
                      </span>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      )}
      {seriesBook?.length !== 0 && (
        <div className="mt-[50px]">
          <div className="text-[16px] md:text-[12px] font-bold">
            <span className="text-unHighlightDark">Books in This series</span>
            <span className="text-unHighlightDark opacity-50 border-l-[0.5px] border-secondary ml-2 pl-2">
              {seriesBook?.length} Books
            </span>
            <span className="text-unHighlightDark opacity-50 border-l-[0.5px] border-secondary ml-2 pl-2">
              {seriesReview} Reviews
            </span>
          </div>
          <Swiper
            slidesPerView={"auto"}
            grabCursor={true}
            spaceBetween={30}
            navigation={true}
            modules={[Navigation, Virtual]}
            className="mySwiper py-4 no-slider-arrow"
          >
            {seriesBook?.map((book, index) => {
              return (
                <SwiperSlide key={index} className="flex flex-col !w-[150px]">
                  <NewBook book={book} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}
      {seriesName && hasBookSetVideos && bookSetVideos.length > 0 && (
        <div className="mt-[50px]">
          <div className="text-[16px] md:text-[12px] font-bold">
            <span className="text-[12px] font-bold">{seriesName}</span>
            <span className="text-[12px] text-unHighlightDark font-bold border-l-[0.5px] border-secondary ml-2 pl-2">
              {bookSetVideos.length} Videos
            </span>
            <span className="text-[12px] text-unHighlightLight font-bold border-l-[0.5px] border-secondary ml-2 pl-2">
              {bookSetViews} Views
            </span>
          </div>
          <div>
            <Swiper
              slidesPerView={"auto"}
              grabCursor={true}
              centeredSlides={true}
              centeredSlidesBounds={true}
              freeMode={true}
              navigation={true}
              modules={[FreeMode, Navigation, Virtual]}
              className="mySwiper !py-2 no-slider-arrow"
            >
              {bookSetVideos.map((video, index) => {
                return (
                  <SwiperSlide
                    key={index}
                    className="relative w-[300px] cursor-grab"
                  >
                    <div className=" h-[150px]">
                      <iframe
                        className="flex h-[150px] w-[300px] bg-cover bg-no-repeat rounded-[5px]"
                        src={`https://www.youtube.com/embed/${video.yt_links}`}
                        title="YouTube video player"
                        allow="accelerometer; 
                        autoplay; 
                        clipboard-write; 
                        encrypted-media; 
                        gyroscope; 
                        fullscreen;
                        web-share"
                        allowFullScreen={true}
                      ></iframe>
                    </div>
                    <div className="mt-[9px] p-[7px] flex flex-row text-[9px] font-semibold justify-between items-center bg-lightGrey rounded-[5px]">
                      <div className="flex-1 flex flex-row justify-center items-center">
                        <span className="flex flex-row items-center">
                          <img
                            className="mr-[8px] -translate-y-[1px]"
                            src={bookIconOrange}
                            alt="bookIcon"
                          />
                          {`${video.name
                            .replace(/ *\([^)]*\) */g, "")
                            .substring(0, 16)}...`}
                        </span>
                        <span className="px-2 mx-2 border-l-[1px] border-r-[1px] border-secondary flex flex-row items-center">
                          <img
                            className="-translate-y-[2px] mr-[8px]"
                            src={clockIcon}
                            alt="Clock"
                          />
                          {video.duration.includes(":")
                            ? video.duration
                            : "0:" + video.duration}
                        </span>
                        <span className="flex flex-row items-center">
                          {kFormatter(video.views)}
                          <FaYoutube className="w-[12px] -translate-y-[1px] mx-[5px] text-[#ff0000]" />{" "}
                          Views
                        </span>
                      </div>
                      <div>
                        {isLoggedIn && (
                          <span className="ml-">
                            {wishClickedMap[video.isbn] ? (
                              <FaHeart
                                className="w-[15px] h-[12px]"
                                fill="#3B72FF"
                                onClick={() => addToReadList(video.isbn)}
                              />
                            ) : (
                              <CiHeart
                                className="w-[15px] h-[12px] scale-150"
                                fill="#3B72FF"
                                onClick={() => addToReadList(video.isbn)}
                              />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* <div
                      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex flex-col justify-center items-center z-10`}
                    >
                      <div className="mt-[10px] text-[10px] flex flex-row items-center justify-center bg-white w-full">
                        <div className="pl-[15px]">{video.duration}</div>
                        <div className="ml-[5px] pl-[5px] border-l-[0.5px] border-secondary">
                          {kFormatter(video.views)} Views
                        </div>
                      </div>
                    </div> */}
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      )}
      {authorsBook && Object.keys(authorsBook)?.length !== 0 && (
        <div className="mt-[50px]">
          <div className="text-[16px] font-bold">
            <span className="text-black">More Books by Authors</span>
          </div>
          {authors.map((author, index) => {
            return (
              authorsBook[`${author}`]?.length > 0 && (
                <div key={index} className="mt-4">
                  <div className="text-[16px] font-bold">
                    <span className="text-[12px] font-bold">{author}</span>
                    <span className="text-[12px] text-unHighlightDark font-bold border-l-[0.5px] border-secondary ml-2 pl-2">
                      {authorsBook[`${author}`]?.length} Books
                    </span>
                    <span className="text-[12px] text-unHighlightLight font-bold border-l-[0.5px] border-secondary ml-2 pl-2">
                      {authorReview[`${author}`]} Reviews
                    </span>
                  </div>
                  <Swiper
                    slidesPerView={"auto"}
                    grabCursor={true}
                    spaceBetween={30}
                    navigation={true}
                    modules={[Navigation, Virtual]}
                    className="mySwiper py-2 no-slider-arrow"
                  >
                    {authorsBook[`${author}`]?.map((book, index) => {
                      return (
                        <SwiperSlide
                          key={index}
                          className="flex flex-col !w-[150px]"
                        >
                          <NewBook book={book} />
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                </div>
              )
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Book;
