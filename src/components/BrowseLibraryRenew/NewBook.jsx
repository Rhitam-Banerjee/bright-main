import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import axios from "axios";
import devUrls from "../../utils/devUrls";

import star from "../../icons/star.svg";
import amazon from "../../icons/amazon.svg";
import { FaHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";

import { setAlert } from "../../reducers/mainSlice";
import { addToWishlist } from "../../reducers/wishlistSlice";

const NewBook = ({ book }) => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((store) => store.main);

  const [isLoading, setIsLoading] = useState(true);
  const [wishClickedMap, setWishClickedMap] = useState({});
  const [wishListBooks, setWishListBooks] = useState([]);

  const { isbn, name, rating, review_count, image, stock_available } = book;
  const newImage = image.replace("_US", "_SY");

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
        const response = await axios.post(
          `https://server.brightr.club/api_v2/add-to-wishlist`,
          isbnData,
          { withCredentials: true }
        );

        setWishListBooks((prevBooks) => [...prevBooks, response.data]);
        setWishClickedMap((prevMap) => {
          const updatedMap = { ...prevMap };
          updatedMap[isbn] = true;
          return updatedMap;
        });
        dispatch(setAlert({ text: `Added to wishlist`, color: "#33A200" }));
      } else {
        // If the book is already in the wishlist, remove it
        const response = await axios.post(
          `https://server.brightr.club/api_v2/wishlist-remove`,
          isbnData,
          { withCredentials: true }
        );

        setWishListBooks((prevBooks) =>
          prevBooks.filter((book) => book.isbn !== isbn)
        );
        setWishClickedMap((prevMap) => {
          const updatedMap = { ...prevMap };
          updatedMap[isbn] = false;
          return updatedMap;
        });
        dispatch(setAlert({ text: `Removed from wishlist`, color: "#F75549" }));
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div
      className={`h-[180px] !w-full max-w-[150px] relative bg-white flex flex-col`}
    >
      <div className="relative p-[5px] border-mainColor border-opacity-20 border-[2px] rounded-md h-[150px]">
        <Link to={`/book/${isbn}`} className="m-auto !h-full !w-full">
          <img
            className="h-full !m-auto !max-h-[140px] w-auto !max-w-[140px]"
            src={newImage}
            alt={name}
            onLoad={() => setIsLoading(false)}
          />
        </Link>
        {stock_available === 0 && (
          <div className="absolute top-0 left-0 h-full w-full bg-slate-500 rounded-md opacity-80 z-10 pointer-events-none" />
        )}
      </div>
      {!isLoading && (
        <div
          className={` ${
            wishClickedMap[book.isbn] ? "bg-wishlistedBox" : "bg-unHighlight"
          } absolute p-[7px] bottom-0 h-[28px] mt-auto flex flex-row justify-between items-center w-full rounded-md`}
        >
          <div className="flex flex-row justify-between items-center text-black">
            <div className="mr-[2px]">
              <img src={star} alt="Rating" />
            </div>
            <p className="text-[9px] translate-y-[1px]">
              {rating.length > 4 ? rating.slice(0, 4) : rating}
            </p>
          </div>
          <div className="flex-1 flex flex-row items-center justify-center border-l-[0.5px] ml-2 pl-2 border-secondary">
            <img className="!w-[10px] mr-2" src={amazon} alt="amazon" />
            <div className="w-full text-black flex flex-row">
              <p className="text-black text-[9px]">
                {kFormatter(parseFloat(review_count.replace(/,/g, "")))}
              </p>
              <p className="text-black text-[9px] pl-[2px]">Review</p>
            </div>
          </div>
          {isLoggedIn && !isLoading && (
            <div>
              {wishClickedMap[book.isbn] ? (
                <FaHeart className="w-[15px] h-[12px]" fill="blue" />
              ) : (
                <CiHeart
                  className="w-[15px] h-[12px]"
                  fill="blue"
                  onClick={() => addToReadList(book.isbn)}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NewBook;
