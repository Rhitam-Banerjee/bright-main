import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "./styles.scss";
import { Navigation, Virtual } from "swiper/modules";

import { NewBook } from "../BrowseLibraryRenew";

const NewSlider = ({ container }) => {
  return (
    <Swiper
      slidesPerView={"auto"}
      spaceBetween={30}
      grabCursor={true}
      pagination={{
        clickable: true,
      }}
      navigation={true}
      modules={[Navigation, Virtual]}
      className="mySwiper !p-4"
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
