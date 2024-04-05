import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import devUrls from "../../utils/devUrls";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "swiper/css/virtual";
import { FreeMode, Navigation, Virtual } from "swiper/modules";

import deliveryIconWhite from "../../icons/deliveryIconWhite.svg";

import {
  setBooksRead,
  setBucket,
  setCompleteAuthors,
  setCompleteSeries,
  setOrderBucket,
  setPreviousBooks,
  setWishlist,
} from "../../reducers/wishlistSlice";

import Wishlist from "./Wishlist";
import {
  CompleteSeries,
  CompleteAuthors,
  PreviousBooks,
  SearchBooks,
} from "./";

import { setAcitveChild, setAlert, setUser } from "../../reducers/mainSlice";

const getDay = (date) => {
  const d = new Date(date);
  const day = d.toLocaleDateString("default", { weekday: "long" });
  return `${day}`;
};
const getDate = (date) => {
  const d = new Date(date);
  const dateNumber = d.getDate();
  return `${dateNumber}`;
};
const getMonth = (date) => {
  const d = new Date(date);
  const month = d.toLocaleString("default", { month: "long" });
  return `${month}`;
};
const getFormattedDate = (date) => {
  const d = new Date(date);
  let month = String(d.getMonth() + 1);
  if (month.length < 2) month = "0" + month;
  let day = String(d.getDate() + 1);
  if (day.length < 2) day = "0" + day;
  return `${d.getFullYear()}-${month}-${day - 1}`;
};
const YourLibrary = () => {
  const dispatch = useDispatch();
  const { user, activeChild } = useSelector((store) => store.main);
  const {
    orderBucket,
    bucket,
    wishlist,
    completeAuthors,
    completeSeries,
    previousBooks,
  } = useSelector((store) => store.wishlist);

  const [changeDeliveryShow, setChangeDeliveryShow] = useState(false);

  const getOrderBucket = async () => {
    try {
      const response = await axios.get(devUrls.getOrderBucket, {
        withCredentials: true,
        params: { guid: user.guid },
      });
      dispatch(setOrderBucket({ orderBucket: response.data.wishlists }));
    } catch (err) {
      console.log(err);
    }
  };

  const getBucket = async () => {
    try {
      const response = await axios.get(devUrls.getBucket, {
        withCredentials: true,
        params: { guid: user.guid },
      });
      dispatch(setBucket({ bucket: response.data.wishlists }));
    } catch (err) {
      console.log(err);
    }
  };

  const getWishlist = async () => {
    try {
      const response = await axios.get(devUrls.getWishlist, {
        params: { guid: user.guid },
      });
      response.data.wishlists.sort((b, a) => {
        return b.date_added - a.date_added;
      });
      console.log(response.data.wishlists);
      dispatch(setWishlist({ wishlist: response.data.wishlists }));
    } catch (err) {
      console.log(err);
    }
  };

  const getPreviousBooks = async () => {
    try {
      const response = await axios.get(devUrls.getPreviousBooks, {
        withCredentials: true,
        params: { guid: user.guid },
      });
      dispatch(setPreviousBooks({ previousBooks: response.data.books }));
    } catch (err) {
      console.log(err);
    }
  };

  const updateDeliveryDate = async (event) => {
    try {
      const response = await axios.post(
        devUrls.changeDeliveryDate,
        {
          delivery_date: getFormattedDate(event.target.value),
        },
        { withCredentials: true }
      );
      dispatch(setAlert({ text: "Delivery date updated", color: "#33A200" }));
      dispatch(setUser({ user: response.data.user }));
    } catch (err) {
      console.log(err);
      dispatch(setAlert({ text: err.response.data.message, color: "#F75549" }));
    }
  };

  const getUserCompleteBooks = async () => {
    try {
      const response = await axios
        .get(devUrls.getUserCompleteBooks, {
          withCredentials: true,
          params: { guid: user.guid },
        })
        .then((res) => res.data)
        .catch((err) => console.log(err));
      if (response.result) {
        dispatch(setBooksRead(response.result.books));
        response.result.author.sort((a, b) => {
          return b.books_read - a.books_read;
        });
        dispatch(setCompleteAuthors(response.result.author));
        response.result.category.sort((a, b) => {
          return b.books_read - a.books_read;
        });
        dispatch(setCompleteSeries(response.result.category));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getWishlist();
    getOrderBucket();
    getBucket();
    getPreviousBooks();
    getUserCompleteBooks();
  }, []);

  return (
    <main className="relative mt-[100px] px-[15px]">
      {/* <section className="mt-[9px] w-max mx-auto">
        <Swiper
          slidesPerView={"auto"}
          grabCursor={true}
          freeMode={true}
          navigation={true}
          modules={[FreeMode, Navigation, Virtual]}
          className="mySwiper no-slider-arrow p-4"
        >
          {user.children?.map((child, index) => {
            return (
              <SwiperSlide
                key={index}
                className={`!max-w-[180px] !h-auto rounded-[5px]
                ${
                  activeChild === index
                    ? "bg-mainColor shadow-customShadowLight"
                    : "bg-mainColorLight"
                }
                `}
                onClick={() => {
                  dispatch(setAcitveChild(index));
                }}
              >
                <div className="flex flex-col justify-between items-start w-[180px] h-[83px] p-[12px]">
                  <img className="w-[16px]" src={childIcon} alt="ChildIcon" />
                  <span className="text-[11px] text-white font-semibold">
                    {child.name}
                  </span>
                  <div className="text-[9px] font-semibold">
                    <span className="text-secondary">Age group - </span>
                    <span className="text-white">
                      {child.age} - {child.age + 1}
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </section> */}
      {/* <section className="p-[20px] mt-[20px] mx-auto w-full max-w-[360px] flex flex-col justify-between items-center gap-[10px] bg-mainColor rounded-[5px]">
        <div className="w-full flex flex-row justify-between items-center">
          <div className="flex flex-row justify-start items-center gap-[10px]">
            <img
              className="w-[20px]"
              src={deliveryIconWhite}
              alt="DeliveryIcon"
            />
            <span className="text-[13px] font-semibold text-white">
              Next Delivery
            </span>
          </div>
          {user.next_delivery_date && (
            <div className="ml-auto relative">
              <div
                className="flex flex-col justify-start items-center w-max h-max bg-white rounded-[5px]"
                onClick={() => setChangeDeliveryShow(!changeDeliveryShow)}
              >
                <div className="w-full p-[3px] bg-unHighlightLight text-center text-[8px] text-white font-bold rounded-tl-[5px] rounded-tr-[5px]">
                  {getDay(user.next_delivery_date)}
                </div>
                <div className="w-full text-unHighlightLight text-center text-[12px] font-black">
                  {getDate(user.next_delivery_date)}
                </div>
                <div className="w-full text-unHighlightLight text-center text-[7px] font-semibold">
                  {getMonth(user.next_delivery_date)}
                </div>
              </div>
              {changeDeliveryShow && (
                <div className="absolute top-full right-0 ">
                  <input type="date" onChange={updateDeliveryDate} />
                </div>
              )}
            </div>
          )}
        </div>
        {orderBucket.length > 0 ? (
          <Swiper
            slidesPerView={"auto"}
            grabCursor={true}
            freeMode={true}
            navigation={true}
            modules={[FreeMode, Navigation, Virtual]}
            className="mySwiper !py-4 no-slider-arrow max-w-[360px] w-max mx-auto"
          >
            {orderBucket?.map((book, index) => {
              return (
                <SwiperSlide key={index} virtualIndex={index}>
                  <div className="flex flex-col justify-center items-center !w-[200px] !h-[200px] bg-lightGrey rounded-[5px]">
                    <div className="relative !max-w-[160px] w-full h-[160px]">
                      <img
                        className="!max-w-[160px] !max-h-[160px]"
                        src={book.image}
                        alt="BookImage"
                      />
                      <div className="absolute -bottom-[20px] -left-[15px] text-[48px] font-bold text-white font-outline-1">
                        {index + 1}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        ) : (
          <div></div>
        )}
      </section> */}
      {wishlist.length > 0 && <Wishlist />}
      {completeSeries.length > 0 && <CompleteSeries />}
      <SearchBooks />
      {completeAuthors.length > 0 && <CompleteAuthors />}
      {previousBooks.length > 0 && <PreviousBooks />}
    </main>
  );
};

export default YourLibrary;
