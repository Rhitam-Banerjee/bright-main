import React from "react";

import { InstagramEmbed } from "react-social-media-embed";

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "./styles.css";

const videosEmbed = [
  "https://www.instagram.com/p/C4e_floSSSU/",
  "https://www.instagram.com/p/C4e_Z99SCPL/",
  //   "https://www.instagram.com/p/C4cVdB3yZLJ/",
  "https://www.instagram.com/p/C4e_dGgStHI/",
  "https://www.instagram.com/p/C4cYQlWyFmm/",
  "https://www.instagram.com/p/C4cVSEWyFLP/",
  "https://www.instagram.com/p/C34gO2GSxXD/",
  "https://www.instagram.com/p/C34fzhOSsXH/",
  "https://www.instagram.com/p/C3pbNjay-3o/",
];
const InstagramEmbedSection = () => {
  return (
    <Swiper
      slidesPerView={"auto"}
      autoplay={{
        delay: 3500,
        disableOnInteraction: true,
      }}
      loop={true}
      navigation={true}
      modules={[Navigation, Autoplay]}
      className="mySwiper py-[20px]"
    >
      {videosEmbed.map((video, index) => {
        return (
          <SwiperSlide className="w-[112px] h-[350px]">
            <InstagramEmbed
              className="!w-full !h-full"
              key={index}
              url={video}
            />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default InstagramEmbedSection;
