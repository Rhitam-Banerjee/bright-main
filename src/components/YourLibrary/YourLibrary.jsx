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

import borwseIconOrangeFill from "../../icons/browseIconOrangeFill.svg";
import childIcon from "../../icons/childIconYourLibrary.svg";

import {
  setBucket,
  setCurrentBooks,
  setOrderBucket,
  setPreviousBooks,
  setWishlist,
} from "../../reducers/wishlistSlice";
import Wishlist from "./Wishlist";
import CompleteSeries from "./CompleteSeries";
import { setAcitveChild, setAlert, setUser } from "../../reducers/mainSlice";
import { FaEdit } from "react-icons/fa";

const getDate = (date) => {
  const d = new Date(date);
  const month = d.toLocaleString("default", { month: "long" });
  return `${d.getDate()} ${month} ${d.getFullYear()}`;
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
  const { orderBucket, bucket, wishlist, suggestedBooks, completeSeries } =
    useSelector((store) => store.wishlist);

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
        withCredentials: true,
        params: { guid: user.guid },
      });
      dispatch(setWishlist({ wishlist: response.data.wishlists }));
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

  const getCompleteSeries = async () => {
    const response = await axios.get(devUrls.getCompleteSeries, {
      withCredentials: true,
      params: { guid: user.children[activeChild].guid },
    });
    // console.log(user.children[activeChild]);
  };

  useEffect(() => {
    getWishlist();
  }, [orderBucket, bucket]);

  useEffect(() => {
    getOrderBucket();
    getBucket();
  }, []);

  // useEffect(() => {
  //   getCompleteSeries();
  // }, [activeChild]);

  return (
    <main className="mt-[100px] px-[5px]">
      <section className="mt-[9px] w-max mx-auto">
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
      </section>
      <section className="max-w-[350px] w-full mx-auto mt-[15px] flex flex-col justify-between items-center">
        <span className="text-[12px] font-bold text-mainColor">
          Next book bucket
        </span>
        <span className="text-[10px] font-semibold text-secondary">
          Upcomming delivery
        </span>
        {orderBucket.length ? (
          <div className="bucket-details mt-[50px]">
            <div className="bucket-list">
              {orderBucket.map((book, i) => {
                return (
                  <div className="bucket-book" key={i}>
                    <img src={book.image} alt="Book" />
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="blue-button create-bucket">No Bucket Created</p>
        )}
        <button className="blue-button date-button">
          <span>
            Delivery Date
            {user.next_delivery_date &&
              ` - ${getDate(user.next_delivery_date)}`}
          </span>
          <FaEdit />
          <input type="date" onChange={updateDeliveryDate} />
        </button>
      </section>
      <div className="w-[95%] mx-auto h-[0.5px] my-[20px] bg-secondary" />
      {wishlist.length > 0 && <Wishlist />}
      {completeSeries.length > 0 && <CompleteSeries />}
    </main>
  );
};

export default YourLibrary;
