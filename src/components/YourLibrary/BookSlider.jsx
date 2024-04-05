import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import axios from "axios";
import devUrls from "../../utils/devUrls";

import star from "../../icons/star.svg";
import { FaAmazon } from "react-icons/fa";
import heartOutline from "../../icons/heartstroke.svg";
import heartFill from "../../icons/heartfill.svg";
import bookIconOrange from "../../icons/bookIconOrange.svg";
import { IoIosClose } from "react-icons/io";

import { setAlert } from "../../reducers/mainSlice";
import {
  removeFromWishlist,
  setBooksSeries,
  setWishlist,
} from "../../reducers/wishlistSlice";

const getDate = (date) => {
  const resultDate = new Date(date).getDate();
  return `${resultDate}`;
};
const getMonth = (date) => {
  const d = new Date(date);
  const month = d.toLocaleString("default", { month: "long" });
  return `${month}`;
};

const BookSlider = ({
  book,
  hasRead = false,
  section = "suggestion",
  fromSet = [],
}) => {
  const location = useLocation();
  const { pathname } = location;
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.main);
  const { wishlist, booksRead } = useSelector((state) => state.wishlist);

  const [wishClickedMap, setWishClickedMap] = useState({});
  const [wishListBooks, setWishListBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    isbn,
    name,
    rating,
    review_count,
    image,
    stocks_available,
    book_order,
    total_books,
    date_added,
  } = book;

  function formatNumber(number) {
    const orginalNumber = number;
    const suffixes = ["", "k", "M", "B"];
    let suffixIndex = 0;

    while (number >= 1000 && suffixIndex < suffixes.length - 1) {
      number /= 1000;
      suffixIndex++;
    }

    return orginalNumber < 1000
      ? orginalNumber
      : number?.toFixed(1) + suffixes[suffixIndex];
  }

  const getWishlist = async () => {
    try {
      const response = await axios.get(devUrls.getWishlist, {
        withCredentials: true,
        params: { guid: user.guid },
      });
      response.data.wishlists.sort((a, b) => {
        return b.date_added - a.date_added;
      });
      dispatch(setWishlist({ wishlist: response.data.wishlists }));
    } catch (err) {
      console.log(err);
    }
  };

  const wishlistRemove = async (book) => {
    dispatch(
      setAlert({ text: `${book.name} removed from wishlist`, color: "#F75549" })
    );
    dispatch(removeFromWishlist({ book }));
    try {
      await axios.post(
        devUrls.removeFromWishlist,
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
          getWishlist();
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
          getWishlist();
        } else {
          dispatch(setAlert({ text: `There was an error`, color: "#F75549" }));
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBookSet = async () => {
    try {
      const response = await axios.get(
        `https://server.brightr.club/api_v2/get-wishlists?guid=${user.id}`,
        { withCredentials: true }
      );
      setWishListBooks(response.data.wishlists);

      const initialWishClickedMap = {};
      response.data.wishlists.forEach((book) => {
        initialWishClickedMap[book.isbn] = true;
      });
      setWishClickedMap(initialWishClickedMap);
    } catch (error) {
      console.error(error);
    }
  };

  // const getBooksCount = (countBooks) => {
  //   let wishlistCount = 0;
  //   countBooks.forEach((book) => {
  //     if (booksRead.length > 0) {
  //       booksRead.forEach((bookRead) => {
  //         if (bookRead === book.isbn) {
  //           wishlistCount++;
  //         }
  //       });
  //     }
  //   });
  //   let readCount = 0;
  //   countBooks.forEach((book) => {
  //     if (wishlist.length > 0) {
  //       wishlist.forEach((wish) => {
  //         if (wish.isbn === book.isbn) {
  //           readCount++;
  //         }
  //       });
  //     }
  //   });
  //   dispatch(
  //     setBooksSeries({ wishlistBooks: wishlistCount, readBooks: readCount })
  //   );
  // };

  useEffect(() => {
    if (isLoggedIn) {
      fetchBookSet();
    }
  }, [wishlist]);

  return (
    !isLoading && (
      <div
        className={`h-[180px] !w-[150px] relative !bg-transparent flex flex-col`}
      >
        <div className="relative p-[10px] bg-lightGrey rounded-md h-[150px]">
          <Link to={`/book/${isbn}`} className="m-auto !h-full !w-full">
            <img
              className="h-full !m-auto !max-h-[130px] w-auto !max-w-[130px]"
              src={image?.replace(".pg", ".jpg").replace(".jpgjpg", ".jpg")}
              alt={"Book name"}
              loading="lazy"
            />
          </Link>
          {isLoggedIn && stocks_available === 0 && (
            <div className="absolute top-0 left-0 h-full w-full bg-unHighlightLight rounded-md opacity-80 z-1 pointer-events-none" />
          )}

          {book_order && (
            <div className="absolute flex flex-row items-center justify-center bottom-[5px] right-0 h-[15px] w-[40px] bg-mainColorLight text-[9px] rounded-tl-[5px] rounded-bl-[5px]">
              <span className="translate-y-[1px]">{book_order}</span>
              <span className="text-secondary px-[2px] translate-y-[1px]">
                /
              </span>
              <span className="translate-y-[1px]">{total_books}</span>
            </div>
          )}
          {section === "wishlist" && (
            <div className="absolute top-[5px] right-[5px] h-max w-max bg-white z-10 pointer-events-none shadow-md rounded-[5px]">
              <div className="w-full text-white px-[5px] py-[2px] bg-unHighlightLight text-center text-[7px] font-semibold rounded-tr-[5px] rounded-tl-[5px]">
                {getMonth(date_added)}
              </div>
              <div className="w-full text-unHighlightLight text-center text-[12px] font-black">
                {getDate(date_added)}
              </div>
            </div>
          )}
        </div>
        {!hasRead && section !== "previous" ? (
          <div
            className={` ${
              wishClickedMap[book.isbn] && section !== "wishlist"
                ? "bg-mainColorLight"
                : "bg-lightGrey"
            } absolute p-[7px] bottom-0 left-1/2 -translate-x-1/2 h-[28px] mt-auto flex flex-row justify-center items-center w-full rounded-md gap-[5px]`}
          >
            <div className="flex-1 flex flex-row items-center justify-center">
              <div className="flex flex-row justify-between items-center text-black">
                <p className="text-[9px] font-semibold">{rating}</p>
                <div className="pl-[2px] -translate-y-[1px]">
                  <img src={star} alt="Rating" />
                </div>
              </div>
              <div className="flex flex-row items-center justify-between border-l-[0.5px] ml-[5px] pl-[5px] border-secondary">
                <p className="text-black font-semibold text-[9px]">
                  {formatNumber(parseFloat(review_count))}
                </p>
                <FaAmazon className="!w-[12px] px-[2px]" />
                <p className="text-black font-semibold text-[9px]">Reviews</p>
              </div>
            </div>
            {section === "suggestion" &&
              isLoggedIn &&
              pathname === "/your-library" && (
                <div className="cursor-pointer">
                  {wishClickedMap[isbn] ? (
                    <img
                      src={heartFill}
                      alt="heartFill"
                      className="w-[15px] h-[12px]"
                      onClick={() => {
                        addToReadList(isbn);
                        // getBooksCount(fromSet);
                      }}
                    />
                  ) : (
                    <img
                      src={heartOutline}
                      alt="heartFill"
                      className="w-[15px] h-[12px]"
                      onClick={() => addToReadList(isbn)}
                    />
                  )}
                </div>
              )}
            {section === "wishlist" &&
              isLoggedIn &&
              pathname === "/your-library" && (
                <IoIosClose
                  className="text-[15px] text-mainColor"
                  onClick={() => wishlistRemove(book)}
                />
              )}
          </div>
        ) : (
          <div
            className={`bg-secondaryLight absolute p-[7px] bottom-0 left-1/2 -translate-x-1/2 h-[28px] mt-auto flex flex-row justify-center items-center w-full rounded-md gap-[10px]`}
          >
            <span className="text-[9px] font-semibold">Read</span>
            <span>
              <img className="w-[12px]" src={bookIconOrange} alt="bookIcon" />
            </span>
          </div>
        )}
      </div>
    )
  );
};

export default BookSlider;
