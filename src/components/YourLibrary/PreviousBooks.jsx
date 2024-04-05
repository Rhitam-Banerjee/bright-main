import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "swiper/css/virtual";
import { FreeMode, Navigation, Virtual } from "swiper/modules";

import { FaClock } from "react-icons/fa";
import { useSelector } from "react-redux";
import BookSlider from "./BookSlider";

const PreviousBooks = () => {
  const { previousBooks } = useSelector((store) => store.wishlist);

  return (
    <section className="mt-[20px] w-full">
      <div className="mb-[10px] flex flex-row justify-start items-center gap-[10px]">
        <FaClock className="text-[15px] text-mainColor" />
        <span className="text-[12px] font-bold">Previous Books</span>
      </div>
      <Swiper
        slidesPerView={"auto"}
        grabCursor={true}
        freeMode={true}
        navigation={true}
        modules={[FreeMode, Navigation, Virtual]}
        className="mySwiper no-slider-arrow"
      >
        {previousBooks?.map((book, index) => {
          return (
            <SwiperSlide key={index} className="!w-[150px]">
              <BookSlider book={book} section={"previous"} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
};

export default PreviousBooks;
