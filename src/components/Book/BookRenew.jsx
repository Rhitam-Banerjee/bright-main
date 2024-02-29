import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReactPlayer from "react-player/youtube";

import devUrls from "../../utils/devUrls";
import urls from "../../utils/urls";
import axios from "axios";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "swiper/css/virtual";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Virtual } from "swiper/modules";

import { FaAmazon } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa6";

import moment from "moment";
import { setBooksAuthors, setBookInSeries } from "../../reducers/bookSlice";
import { AuthorSection, NewBook, NewSeries } from "../BrowseLibraryRenew";
import { addToWishlist } from "../../reducers/wishlistSlice";
import { setAlert } from "../../reducers/mainSlice";

const yt_url_video_link_prefix = "https://www.youtube.com/watch?v=";
const yt_url_video_thumbnail_prefix = "https://i.ytimg.com/vi/";

const BookRenew = () => {
  function kFormatter(num) {
    return Math.abs(num) > 999
      ? (Math.abs(num) / 1000).toFixed(1) + "k"
      : Math.abs(num);
  }

  const { isbn } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bookInSeries, authors } = useSelector((store) => store.book);
  const { isLoggedIn } = useSelector((store) => store.main);
  const [hasBookVideos, setHasBookVideos] = useState(false);
  const [hasBookSetVideos, setHasBookSetVideos] = useState(false);

  const [removeOverlayFor, setRemoveOverlayFor] = useState("");

  const [book, setBook] = useState(null);
  const [bookVideos, setBookVideos] = useState([]);
  const [bookViews, setTotalViews] = useState(0);
  const [bookSetVideos, setBookSetVideos] = useState([]);
  const [bookSetViews, setTotalSetViews] = useState(0);
  const [seriesBook, setSeriesBook] = useState({});
  const [authorsBook, setAuthorsBook] = useState({});
  const [authorReview, setAuthorReview] = useState({});
  const [seriesReview, setSeriesReview] = useState("");

  const [videoToPlay, setVideoToPlay] = useState("");

  const getseriesBooks = async () => {
    try {
      const response = await axios
        .get(urls.getSeriesNameBook, {
          params: { book_search_id: String(isbn) },
        })
        .then((res) => res.data)
        .catch((err) => console.log(err));
      const title = Object.keys(await response.books)[0];
      response.books[`${title}`].sort((a, b) => {
        return b.stock_available - a.stock_available;
      });
      setSeriesBook(await response.books);
      dispatch(setBookInSeries(title));
      let totalReview = 0;
      await response.books[`${title}`].forEach((book) => {
        totalReview += parseInt(book.review_count);
      });
      setSeriesReview(kFormatter(totalReview));
    } catch (err) {
      console.log(err);
    }
  };

  const getBook = async () => {
    try {
      const response = await axios
        .get(urls.getBooks, {
          params: { search_query: String(isbn) },
        })
        .then((res) => res.data)
        .catch((err) => console.log(err));
      const newBook = await response.books[0];
      setBook({
        ...newBook,
        stars: !isNaN(Number(newBook.rating))
          ? Math.round(Number(newBook.rating))
          : 0,
        pages: newBook.pages && `${newBook.pages}`,
        price: newBook.price && `₹ ${newBook.price}/-`,
        for_age:
          newBook.for_age || `${newBook.min_age} - ${newBook.max_age} years`,
        publication_date:
          newBook.publication_date &&
          moment(newBook.publication_date).format("MMM Do YY"),
        paperbackprice: newBook.paperbackprice,
        boardbookprice: newBook.boardbookprice,
        hardcoverprice: newBook.hardcoverprice,
      });
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
    <section className="px-8 py-2 md:px-4 mt-10 m-auto w-full h-full">
      <div className="flex flex-row justify-start md:items-end gap-8 max-w-[800px] w-[90%] md:w-full m-auto h-full">
        <div className="md:!w-[150px] h-full">
          <div
            className={`w-max md:h-[180px] md:!w-full md:!max-w-[150px] relative bg-white flex flex-col`}
          >
            <div className="relative p-[10px] bg-unHighlight rounded-md w-max md:h-[150px] md:w-[150px]">
              <div className="m-auto !h-full !w-full">
                <img
                  className="h-full !max-w-[200px] !m-auto md:!max-h-[130px] w-auto md:!max-w-[130px]"
                  src={book.image
                    .replace("US2", "US8")
                    .replace("SX2", "SX8")
                    .replace("_US", "_SY")}
                  alt="BookImage"
                />
              </div>
            </div>
            <div className="absolute p-[7px] bottom-0 h-[28px] mt-auto flex flex-row justify-center items-center w-full rounded-md bg-unHighlight">
              <div className="flex flex-row justify-between items-center text-black">
                <p className="text-[9px] translate-y-[1px] pr-[5px]">
                  {book.rating.length > 4
                    ? book.rating.slice(0, 4)
                    : book.rating}
                </p>
                <FaStar className="text-secondary w-[9px] -translate-y-[1px] pr" />
              </div>
              <div className="flex flex-row items-center justify-center border-l-[0.5px] ml-2 pl-2 border-secondary">
                <FaAmazon className="!w-[9px] mr-2" />
                <div className="text-[9px] w-full text-black flex flex-row">
                  <span className="">
                    {kFormatter(
                      parseFloat(book.review_count.replace(/,/g, ""))
                    )}
                  </span>
                  <span className="pl-[4px]">Reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col h-full">
          <div className="mb-auto">
            <div className="!p-0 flex flex-row items-center">
              <div className="text-[12px] md:text-[8px] md:max-w-full !w-max font-bold">
                {bookInSeries}
              </div>
              <div className="text-[12px] md:text-[8px] text-unHighlightDark font-bold border-l-[0.5px] border-secondary ml-2 pl-2">
                {seriesBook[bookInSeries]?.length} Books
              </div>
              <div className="text-[12px] md:text-[8px] text-unHighlightLignt font-bold border-l-[0.5px] border-secondary ml-2 pl-2">
                {seriesReview} Reviews
              </div>
            </div>
            <div className="py-[11px] text-[16px] md:text-[12px] font-bold">
              {book.name}
            </div>
            {authors.map((author, index) => {
              return (
                authorsBook[`${author}`]?.length > 0 && (
                  <div className="!p-0 flex flex-row items-center" key={index}>
                    <Link
                      to={`/author/${author}`}
                      className="text-[12px] md:text-[8px] md:max-w-full !w-max font-bold"
                    >
                      {author}
                    </Link>
                    <div className="text-[12px] md:text-[8px] text-unHighlightDark font-bold border-l-[0.5px] border-secondary ml-2 pl-2">
                      {authorsBook[`${author}`]?.length} Books
                    </div>
                    <div className="text-[12px] md:text-[8px] text-unHighlightLignt font-bold border-l-[0.5px] border-secondary ml-2 pl-2">
                      {authorReview[author]} Reviews
                    </div>
                  </div>
                )
              );
            })}
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
          {isLoggedIn && (
            <div
              className="text-[12px] md:text-[10px] text-center font-bold px-[50px] py-[3px] h-[22px] w-full max-w-[200px] mr-auto bg-unHighlight cursor-pointer rounded-[5px]"
              onClick={() => wishlistAdd(book)}
            >
              Add To Wishlist
            </div>
          )}
        </div>
      </div>
      {hasBookVideos && bookVideos.length > 0 && (
        <div className="mt-[50px]">
          <div className="pl-[18px] text-[16px] md:text-[12px] font-bold">
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
              className="mySwiper !p-4"
            >
              {bookVideos.map((video, index) => {
                return (
                  <SwiperSlide key={index} className="h-full w-full">
                    {/* <div
                        className={`${
                          videoToPlay === video.yt_links ? "!hidden" : "!flex"
                        } absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 w-full h-full flex-col justify-center items-center z-[1] pointer-events-none`}
                      >
                        <div className="mt-[10px] text-[10px] flex flex-row items-center justify-center bg-white w-full">
                          <div className="pl-[15px]">{video.duration}</div>
                          <div className="ml-[5px] pl-[5px] border-l-[0.5px] border-secondary">
                            {kFormatter(video.views)} Views
                          </div>
                        </div>
                      </div> */}
                    <iframe
                      className="h-[150px] w-[300px] flex bg-cover bg-no-repeat rounded-[5px] z-0"
                      src={`https://www.youtube.com/embed/${video.yt_links}?wmode=opaque`}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen={true}
                    ></iframe>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      )}
      {Object.keys(seriesBook)?.length !== 0 && (
        <div className="pl-[18px] mt-[50px]">
          <div className="text-[16px] md:text-[12px] font-bold">
            <span className="text-unHighlightDark">Books in This series</span>
            <span className="text-unHighlightDark opacity-50 border-l-[0.5px] border-secondary ml-2 pl-2">
              {seriesBook[bookInSeries]?.length} Books
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
            className="mySwiper py-4"
          >
            {seriesBook[`${bookInSeries}`]?.map((book, index) => {
              return (
                <SwiperSlide key={index} className="flex flex-col !w-[150px]">
                  <NewBook book={book} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}
      {hasBookSetVideos && bookSetVideos.length > 0 && (
        <div className="mt-[50px]">
          <div className="pl-[18px] text-[16px] md:text-[12px] font-bold">
            <span className="text-[12px] font-bold">{bookInSeries}</span>
            <span className="text-[12px] text-unHighlightDark font-bold border-l-[0.5px] border-secondary ml-2 pl-2">
              {bookSetVideos.length} Videos
            </span>
            <span className="text-[12px] text-unHighlightLignt font-bold border-l-[0.5px] border-secondary ml-2 pl-2">
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
              className="mySwiper !p-4"
            >
              {bookSetVideos.map((video, index) => {
                return (
                  <SwiperSlide
                    key={index}
                    className="relative h-[150px] w-[300px] cursor-grab"
                  >
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
      {Object.keys(authorsBook)?.length !== 0 && (
        <div className="pl-[18px] mt-[50px]">
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
                    <span className="text-[12px] text-unHighlightLignt font-bold border-l-[0.5px] border-secondary ml-2 pl-2">
                      {authorReview[`${author}`]} Reviews
                    </span>
                  </div>
                  <Swiper
                    slidesPerView={"auto"}
                    grabCursor={true}
                    spaceBetween={30}
                    navigation={true}
                    modules={[Navigation, Virtual]}
                    className="mySwiper py-4"
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

export default BookRenew;
