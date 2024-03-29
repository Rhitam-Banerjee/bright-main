import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import devUrls from "../../utils/devUrls";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "swiper/css/virtual";
import { FreeMode, Navigation, Virtual } from "swiper/modules";

import heartFillBlue from "../../icons/heartfill.svg";

import { setWishlist } from "../../reducers/wishlistSlice";
import BookSlider from "../BookSlider";

const Wishlist = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.main);
  const { orderBucket, bucket, wishlist, suggestedBooks } = useSelector(
    (store) => store.wishlist
  );

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

  useEffect(() => {
    getWishlist();
  }, [orderBucket, bucket]);

  return (
    <section className="mt-[20px] w-full mx-auto px-[15px] ">
      <div className="flex flex-row justify-start items-center">
        <img
          className="w-[15px] mr-[5px]"
          src={heartFillBlue}
          alt="heartIcon"
        />
        <span className="text-[12px] font-bold">Wishlist</span>
      </div>
      <BookSlider books={wishlist} showTags={false} overlay="wishlist" />
    </section>
  );
};

export default Wishlist;
