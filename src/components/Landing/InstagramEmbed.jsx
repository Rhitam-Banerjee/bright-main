import React from "react";

import { InstagramEmbed } from "react-social-media-embed";

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "./styles.css";

const videosEmbed = [
  "https://www.instagram.com/reel/CypojpSyUV6/",
  "https://www.instagram.com/reel/CyVctFHy6Mx/",
  "https://www.instagram.com/reel/CyIsMn_yP1E/",
  "https://www.instagram.com/reel/Cvq-WoRvVmi/",
  "https://www.instagram.com/reel/Cu1LItZPx1k/",
  "https://www.instagram.com/reel/CzTAKUZSw1V/",
  "https://www.instagram.com/reel/Cy9_8z2yDKO/",
  "https://www.instagram.com/reel/CuorbgHtCUI/",
  "https://www.instagram.com/reel/CsqXAsfsHYT/",
];
const InstagramEmbedSection = () => {
  return (
    <Swiper
      slidesPerView={"auto"}
      loop={true}
      navigation={true}
      modules={[Navigation]}
      className="mySwiper p-[20px]"
    >
      {videosEmbed.map((video, index) => {
        return (
          <SwiperSlide key={index} className="w-full !h-[230px]">
            <InstagramEmbed
              key={index}
              className="!w-[167px] !h-full"
              url={video}
            />
            {/* <iframe
              title={video}
              className="!h-full !overflow-hidden"
              src={`${video}embed`}
            ></iframe> */}
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default InstagramEmbedSection;
