import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import devUrls from "../../utils/devUrls";
import urls from "../../utils/urls";
import axios from "axios";

import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import amazon from "../../icons/amazon.svg";
import Star from "../../icons/Star";

import moment from "moment";
import { setBooksAuthors, setBookInSeries } from "../../reducers/bookSlice";
import { NewBook } from "../BrowseLibraryRenew";
import { addToWishlist } from "../../reducers/wishlistSlice";
import { setAlert } from "../../reducers/mainSlice";

const BookRenew = () => {
  function kFormatter(num) {
    return Math.abs(num) > 999
      ? (Math.abs(num) / 1000).toFixed(1) + "k"
      : Math.abs(num);
  }

  const { isbn } = useParams();
  const dispatch = useDispatch();
  const { bookInSeries, authors } = useSelector((store) => store.book);
  const { isLoggedIn } = useSelector((store) => store.main);
  const [secondaryImages, setSecondaryImages] = useState(null);

  const [book, setBook] = useState(null);
  const [seriesBook, setSeriesBook] = useState({});
  const [authorsBook, setAuthorsBook] = useState({});
  const [authorReview, setAuthorReview] = useState({});
  const [videoSource, setVideoSource] = useState(null);
  const [seriesReview, setSeriesReview] = useState("");

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
  }, [isbn]);

  if (!book)
    return (
      <h1 className="m-40 p-4 text-[2rem] text-center text-secondary font-black">
        Loading...
      </h1>
    );
  return (
    <section className="px-8 py-2 md:px-4 mt-10 m-auto w-full">
      <div className="flex flex-row md:flex-col justify-start md:items-center gap-8 max-w-5xl w-[90%] md:w-full m-auto">
        <div className="relative border-[3px] border-mainColor w-full max-w-max h-max m-auto">
          <div className="m-auto !w-full h-max">
            <img
              className="!max-w-[300px] w-full"
              src={book.image
                .replace("US2", "US8")
                .replace("SX2", "SX8")
                .replace("_US", "_SY")}
              alt=""
            />
          </div>
          <div className="p-1 bottom-0 h-max mt-auto flex flex-row justify-between items-center w-full bg-gray-100 rounded-md">
            <div className="flex flex-row justify-between items-center text-black text-[1.1rem] font-bold">
              <Star />
              <span className="ml-2">{book.rating}</span>
            </div>
            <div className="flex-1 flex flex-row border-l-[3px] ml-[10px] pl-[10px] border-secondary">
              <div className="w-full text-[1.1rem] text-black font-bold">
                <span className="">
                  {kFormatter(parseFloat(book.review_count.replace(/,/g, "")))}
                </span>
                <span className="pl-[4px]">Reviews</span>
              </div>
            </div>
            <img className="w-[20px]" src={amazon} alt="amazon" />
          </div>
          <span className="absolute top-[2px] right-[2px] px-6 py-1 text-mainColor font-bold text-[0.8rem] bg-white rounded-md shadow-customShadowLight">
            {book.min_age} - {book.max_age} Years
          </span>
        </div>
        <div className="flex flex-col justify-between ">
          <div className="!p-0 flex flex-row items-center">
            <div className="max-w-[250px] md:max-w-full pr-2 text-unHighlightDark font-black">
              {bookInSeries}
            </div>
            <div className="h-[0.5px] w-[10px] bg-secondary" />
            <div className=" text-unHighlightDark opacity-50 px-2 font-bold">
              {seriesBook[bookInSeries]?.length} Books
            </div>
            <div className="h-[0.5px] w-[10px] bg-secondary" />
            <div className="text-unHighlightDark opacity-50 px-2 font-bold">
              {seriesReview} Reviews
            </div>
          </div>
          <div className="py-5 text-[1.5rem] font-bold">
            {book.name.replace(/\s*[[{(].*?[)}\]]\s*/g, "")}
          </div>
          {authors.map((author, index) => {
            return (
              authorsBook[`${author}`]?.length > 0 && (
                <div className="!p-0 flex flex-row items-center" key={index}>
                  <Link
                    to={`/author/${author}`}
                    className="pr-2 text-unHighlightDark font-black"
                  >
                    {author}
                  </Link>
                  <div className="h-[0.5px] w-[10px] bg-secondary" />
                  <div className=" text-unHighlightDark opacity-50 px-2 font-bold">
                    {authorsBook[`${author}`]?.length} Books
                  </div>
                  <div className="h-[0.5px] w-[10px] bg-secondary" />
                  <div className="text-unHighlightDark opacity-50 px-2 font-bold">
                    {authorReview[author]} Reviews
                  </div>
                </div>
              )
            );
          })}
          <div className="py-10 font-semibold text-[#ddd]">
            {book.description}
          </div>
          {book.publisher && book.language && book.pages && (
            <div className="mt-auto !p-0 mb-4 flex flex-row items-center">
              <div className="pr-2 text-[#aaa] font-black">
                {book.publisher}
              </div>
              <div className="h-[0.5px] w-[4px] bg-secondary" />
              <div className=" text-[#666] px-2 font-bold">{book.language}</div>
              <div className="h-[0.5px] w-[4px] bg-secondary" />
              <div className="text-[#666] px-2 font-bold">
                {book.pages} Pages
              </div>
            </div>
          )}
          {isLoggedIn && (
            <div
              className="bg-[#666] py-1 w-full min-h-[50px] max-w-[350px] font-bold text-[#ddd] text-[1.5rem] flex items-center justify-center rounded-xl border-[4px] border-transparent hover:border-mainColor cursor-pointer"
              onClick={() => wishlistAdd(book)}
            >
              Add To Wishlist
            </div>
          )}
        </div>
      </div>
      <div className="mt-[50px]">
        <div className="text-[1.4rem] md:text-[1rem] font-bold">
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
          modules={[Navigation]}
          className="mySwiper !p-4"
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
      <div className="mt-[50px]">
        <div className="text-[1.4rem] md:text-[1rem] font-bold">
          <span className="text-unHighlightDark">More Books by Authors</span>
        </div>
        {authors.map((author, index) => {
          return (
            authorsBook[`${author}`]?.length > 0 && (
              <div key={index}>
                <div className="text-[1.4rem] md:text-[1rem] font-bold mt-[10px]">
                  <span className="text-unHighlightDark">{author}</span>
                  <span className="text-unHighlightDark opacity-50 border-l-[0.5px] border-secondary ml-2 pl-2">
                    {authorsBook[`${author}`]?.length} Books
                  </span>
                  <span className="text-unHighlightDark opacity-50 border-l-[0.5px] border-secondary ml-2 pl-2">
                    {authorReview[`${author}`]} Reviews
                  </span>
                </div>
                <Swiper
                  slidesPerView={"auto"}
                  grabCursor={true}
                  spaceBetween={30}
                  navigation={true}
                  modules={[Navigation]}
                  className="mySwiper !p-4"
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
    </section>
  );
};

export default BookRenew;
