import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import axios from "axios";

import star from "../../icons/star.svg";
import { FaAmazon, FaYoutube } from "react-icons/fa";
import { PiGoodreadsLogoFill } from "react-icons/pi";
import { SiNewyorktimes } from "react-icons/si";
import calednderIconOrange from "../../icons/calenderIconOrange.svg";
import heartOutline from "../../icons/heartstroke.svg";
import heartFill from "../../icons/heartfill.svg";
import totalVideoIcon from "../../icons/totalVideoIcon.svg";
import { setAlert } from "../../reducers/mainSlice";

const NewBook = ({ book, section = "amazon" }) => {
  const location = useLocation();
  const { pathname } = location;
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((store) => store.main);

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
    total_videos,
    total_views,
    book_duration,
    book_order,
    total_books,
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
  useEffect(() => {
    if (isLoggedIn) {
      fetchBookSet();
    }
  }, []);
  return (
    !isLoading && (
      <div
        className={`h-[180px] !w-full max-w-[150px] relative bg-white flex flex-col`}
      >
        <div className="relative p-[10px] bg-lightGrey rounded-md h-[150px]">
          <Link to={`/book/${isbn}`} className="m-auto !h-full !w-full">
            <img
              className="h-full !m-auto !max-h-[130px] w-auto !max-w-[130px]"
              src={image?.replace(".pg", ".jpg").replace(".jpgjpg", ".jpg")}
              alt={name}
              loading="lazy"
            />
          </Link>
          {isLoggedIn && stocks_available === 0 && (
            <div className="absolute top-0 left-0 h-full w-full bg-unHighlightLight rounded-md opacity-80 z-10 pointer-events-none" />
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
        </div>
        <div
          className={` ${
            wishClickedMap[book.isbn] ? "bg-mainColorLight" : "bg-lightGrey"
          } absolute p-[7px] bottom-0 left-1/2 -translate-x-1/2 h-[28px] mt-auto flex flex-row justify-center items-center w-full rounded-md gap-[10px]`}
        >
          <div className="flex-1 flex flex-row items-center justify-center">
            <div className="flex flex-row justify-between items-center text-black">
              {section === "NewYorkTimes" && (
                <>
                  <div className="pr-1 -translate-y-[1px]">
                    <img src={calednderIconOrange} alt="CalenderIcon" />
                  </div>
                  <div className="-translate-y-[1px]">
                    <span className="text-[9px] font-semibold">
                      {parseInt(book_duration / 5) * 5} +
                    </span>
                    <span className="text-[9px] font-semibold">Weeks</span>
                  </div>
                </>
              )}
              {section === "YoutubeBooks" && (
                <>
                  <div className="pr-1 -translate-y-[1px]">
                    <img src={totalVideoIcon} alt="CalenderIcon" />
                  </div>
                  <span className="text-[9px] font-semibold">
                    {total_videos}
                  </span>
                </>
              )}
              {(section === "amazon" || section === "goodreads") && (
                <>
                  <p className="text-[9px] font-semibold">{rating}</p>
                  <div className="pl-[2px] -translate-y-[1px]">
                    <img src={star} alt="Rating" />
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-row items-center justify-between border-l-[0.5px] ml-[5px] pl-[5px] border-secondary">
              {(section === "amazon" || section === "goodreads") && (
                <p className="text-black font-semibold text-[9px]">
                  {formatNumber(parseFloat(review_count))}
                </p>
              )}
              {section === "YoutubeBooks" && (
                <p className="text-black font-semibold text-[9px]">
                  {formatNumber(total_views)}
                </p>
              )}
              {section === "goodreads" && (
                <PiGoodreadsLogoFill className="!w-[14px] px-[1px] -translate-y-[1px] fill-[#59461b]" />
              )}
              {section === "amazon" && (
                <FaAmazon className="!w-[12px] px-[2px]" />
              )}
              {section === "NewYorkTimes" && (
                <SiNewyorktimes className="!w-[12px] px-[2px]" />
              )}
              {section === "YoutubeBooks" && (
                <FaYoutube className="!w-[12px] px-[2px] fill-[red] -translate-y-[1px]" />
              )}
              {section === "NewYorkTimes" && (
                <p className="text-black font-semibold text-[9px] translate-y-[1px]">
                  List
                </p>
              )}
              {section === "amazon" && (
                <p className="text-black font-semibold text-[9px]">Reviews</p>
              )}
              {section === "goodreads" && (
                <p className="text-black font-semibold text-[9px]">Rating</p>
              )}
              {section === "YoutubeBooks" && (
                <p className="text-black font-semibold text-[9px]">Views</p>
              )}
            </div>
          </div>
          {isLoggedIn && (
            <div className="cursor-pointer">
              {wishClickedMap[isbn] ? (
                <img
                  src={heartFill}
                  alt="heartFill"
                  className="w-[15px] h-[12px]"
                  onClick={() => addToReadList(isbn)}
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
        </div>
      </div>
    )
  );
};

export default NewBook;
