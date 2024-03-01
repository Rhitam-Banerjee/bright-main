import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "swiper/css/virtual";
import { FreeMode, Navigation, Virtual } from "swiper/modules";

import { NewBook } from "../Book";

const NewSlider = ({ container }) => {
  return (
    <Swiper
      slidesPerView={"auto"}
      grabCursor={true}
      centeredSlides={true}
      centeredSlidesBounds={true}
      freeMode={true}
      navigation={true}
      modules={[FreeMode, Navigation, Virtual]}
      className="mySwiper !py-4 no-slider-arrow"
    >
      {container.map((book, index) => {
        return (
          <SwiperSlide
            key={index}
            className="flex flex-col !w-[150px]"
            virtualIndex={index}
          >
            <NewBook book={book} />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default NewSlider;
