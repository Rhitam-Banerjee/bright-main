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

const YourLibrary = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.main);
  const { orderBucket, bucket, wishlist, suggestedBooks } = useSelector(
    (store) => store.wishlist
  );
  const [activeChild, setActiveChild] = useState(0);
  useEffect(() => {}, []);

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
                  setActiveChild(index);
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
                      {child.age_group} - {child.age_group + 1}
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
          <div className="bucket-details">
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
      </section>
      <div className="w-[95%] mx-auto h-[0.5px] my-[20px] bg-secondary" />
      {Wishlist.length > 0 && <Wishlist />}
    </main>
  );
};

export default YourLibrary;
