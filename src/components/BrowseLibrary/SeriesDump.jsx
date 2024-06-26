import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";

import urls from "../../utils/urls";
import axios from "axios";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import "swiper/css/virtual";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Virtual } from "swiper/modules";

import { NewBook } from "../Book";
import {
  appendBookSet,
  increaseBookSetLimit,
  load,
  resetBookSet,
  setBookSet,
  stopLoad,
} from "../../reducers/bookSlice";

const NewSeriesDump = () => {
  const loadMoreRef = useRef(null);
  const heightRef = useRef(null);
  const dispatch = useDispatch();
  const { age, bookSet, bookSetLimit } = useSelector((store) => store.book);
  const { isLoggedIn } = useSelector((store) => store.main);
  const [seriesLoaded, setSeriesLoaded] = useState(false);
  const getBooks = async () => {
    // if (loading) return;
    try {
      dispatch(load());
      const response = await axios
        .get(
          age === "" || age === undefined
            ? `${urls.getAllSeries}?start=${bookSetLimit - 5}&end=${
                bookSetLimit + 25
              }`
            : `${urls.getAllSeries}?age=${age}&start=${bookSetLimit - 5}&end=${
                bookSetLimit + 25
              }`
        )
        .then((res) => res.data)
        .catch((err) => {
          console.log(err);
        });
      const title = Object.keys(await response.book_set);
      // setSeries(title);
      title.forEach((serie) => {
        response.book_set[`${serie}`].sort((a, b) => {
          return b.review_count - a.review_count;
        });
      });
      if (isLoggedIn) {
        title.forEach((serie) => {
          response.book_set[`${serie}`].sort((a, b) => {
            return b.stocks_available - a.stocks_available;
          });
        });
      }
      // setSeriesBook(await response.books_series);

      setBookSet(null);
      if (bookSetLimit === 5)
        dispatch(setBookSet({ bookSet: response.book_set }));
      else dispatch(appendBookSet({ bookSet: response.book_set }));
      setSeriesLoaded(true);
      dispatch(stopLoad());
    } catch (err) {
      console.log(err);
    }
  };
  const loadMore = () => {
    if (loadMoreRef.current)
      if (window.innerHeight + window.scrollY >= loadMoreRef.current.offsetTop)
        dispatch(increaseBookSetLimit());
  };
  useEffect(() => {
    appendBookSet(null);
    getBooks();
  }, [age, bookSetLimit]);
  useEffect(() => {
    dispatch(resetBookSet());
    window.addEventListener("scroll", loadMore);
    return () => {
      window.removeEventListener("scroll", loadMore);
    };
  }, []);
  return (
    seriesLoaded && (
      <section className="pl-8 md:px-2">
        {Object.keys(bookSet).map((serie, index) => {
          return (
            <div key={index}>
              <div
                className="flex flex-row items-baseline text-[12px]"
                ref={heightRef}
              >
                <p className="pl-0 font-bold" key={index}>
                  {serie.replace(/\s*\(.*?\)\s*/g, "")}
                </p>
                {bookSet[`${serie}`][0].authors?.split(",")[0] && (
                  <p className="text-[12px] font-bold text-unHighlightDark border-l-[1px] ml-[10px] pl-[10px] border-secondary">
                    {bookSet[`${serie}`][0].author?.split(",")[0]}
                  </p>
                )}

                {bookSet[`${serie}`][0].publisher?.split(",")[0] && (
                  <p
                    className={`xs:hidden font-bold text-unHighlightLight text-[12px] border-l-[1px] ml-[10px] pl-[10px] border-secondary`}
                  >
                    {bookSet[`${serie}`][0].publisher?.split(",")[0]}
                  </p>
                )}
              </div>
              <Swiper
                slidesPerView={"auto"}
                grabCursor={true}
                // centeredSlides={true}
                freeMode={true}
                navigation={true}
                modules={[FreeMode, Navigation, Virtual]}
                className="mySwiper py-4 border-b-[0.5px] border-secondary pb-[14px] mb-[10px] no-slider-arrow"
              >
                {bookSet[`${serie}`].map((book, index) => {
                  return (
                    <SwiperSlide
                      key={index}
                      className="flex flex-col !w-[150px]"
                    >
                      <NewBook book={book} />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          );
        })}
        <div ref={loadMoreRef}></div>
      </section>
    )
  );
};

export default NewSeriesDump;
