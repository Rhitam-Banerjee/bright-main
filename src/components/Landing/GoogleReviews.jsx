import React from "react";

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import { reviewsAll } from "./constants";
import { FaStar } from "react-icons/fa6";
import googleIcon from "../../icons/googleLogo.svg";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const GoogleReviews = () => {
  const getDateString = (dateInp) => {
    const date = new Date(dateInp);
    const dateString = date.getDate();
    const monthString = months[date.getMonth()];
    const yearString = date.getFullYear();
    return `${dateString} ${monthString} ${yearString}`;
  };
  return (
    <Swiper
      slidesPerView={"auto"}
      autoplay={{
        delay: 2500,
        disableOnInteraction: true,
      }}
      loop={true}
      navigation={true}
      modules={[Navigation, Autoplay]}
      className="mySwiper p-[30px] no-slider-arrow bg-mainColor"
    >
      {reviewsAll.map((review, index) => {
        return (
          <SwiperSlide
            key={index}
            className="p-[15px] flex flex-col items-center justify-between !w-[268px] !h-[217px] rounded-[5px] bg-white"
          >
            <div className="flex flex-row justify-start items-center gap-[1px] mb-[20px]">
              {Array(parseInt(review.rating))
                .fill(true)
                .map((_, i) => {
                  return <FaStar className="text-secondary text-[10px]" />;
                })}
            </div>
            <div className="flex flex-row items-center justify-between gap-[10px]">
              <a
                target="_blank"
                rel="noreferrer"
                href={`${review.reviewer_contributor_link}`}
              >
                <img
                  className="rounded-full w-[30px] h-[30px]"
                  src={review.reviewer_photo_link}
                  alt="User_Image"
                />
              </a>
              <div className="flex flex-col justify-start items-start">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={`${review.reviewer_contributor_link}`}
                  className="text-[13px] font-bold"
                >
                  {review.reviewer_name}
                </a>
                <span className="text-[10px]">
                  {getDateString(review.review_date_time)}
                </span>
              </div>
            </div>
            <div className="text-[9px] my-auto text-center text-unHighlightDark line-clamp-6">
              {review.review_text}
            </div>
            <div>
              <img
                className="w-[10px] h-[10px]"
                src={googleIcon}
                alt="Google_icon"
              />
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default GoogleReviews;
