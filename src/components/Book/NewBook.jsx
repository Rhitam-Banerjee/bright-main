import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import axios from "axios";

import star from "../../icons/star.svg";
import { FaAmazon } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";

import { setAlert } from "../../reducers/mainSlice";

const NewBook = ({ book }) => {
  const location = useLocation();
  const { pathname } = location;
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((store) => store.main);

  const [wishClickedMap, setWishClickedMap] = useState({});
  const [wishListBooks, setWishListBooks] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const { isbn, name, rating, review_count, image, stocks_available } = book;

  function kFormatter(num) {
    return Math.abs(num) > 999
      ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
      : Math.sign(num) * Math.abs(num);
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
              src={image?.replace("_US", "_SY")}
              alt={name}
              loading="lazy"
            />
          </Link>
          {isLoggedIn && stocks_available === 0 && (
            <div className="absolute top-0 left-0 h-full w-full bg-unHighlightLight rounded-md opacity-80 z-10 pointer-events-none" />
          )}
        </div>
        <div
          className={` ${
            wishClickedMap[book.isbn] ? "bg-mainColorLight" : "bg-lightGrey"
          } absolute p-[8px] bottom-0 left-1/2 -translate-x-1/2 h-[28px] mt-auto flex flex-row justify-center items-center w-full rounded-md`}
        >
          <div className="flex flex-row justify-between items-center text-black">
            <p className="text-[9px] font-semibold">
              {rating?.length > 4 ? rating?.slice(0, 4) : rating}
            </p>
            <div className="px-[2px] -translate-y-[1px]">
              <img src={star} alt="Rating" />
            </div>
          </div>
          <div className="flex flex-row items-center justify-between border-l-[0.5px] ml-2 pl-2 border-secondary">
            {/* <img className="!w-[10px] mr-2" src={amazon} alt="amazon" /> */}
            <p className="text-black font-semibold text-[9px]">
              {kFormatter(
                parseFloat(review_count?.toString()?.replace(/,/g, ""))
              )}
            </p>
            <FaAmazon className="!w-[12px] px-[2px]" />
            <p className="text-black font-semibold text-[9px]">Reviews</p>
            {/* <div className="">
            </div> */}
          </div>
          {isLoggedIn && pathname !== "/your-library" && (
            <div className="translate-x-1">
              {wishClickedMap[isbn] ? (
                <FaHeart
                  className="w-[15px] h-[12px]"
                  fill="#3B72FF"
                  onClick={() => addToReadList(isbn)}
                />
              ) : (
                <CiHeart
                  className="w-[15px] h-[12px] scale-150"
                  fill="#3B72FF"
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
