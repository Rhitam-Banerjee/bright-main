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

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Virtual } from "swiper/modules";

import { NewBook } from "./";
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
  const { age, bookSet, loading, bookSetLimit } = useSelector(
    (store) => store.book
  );
  const [seriesLoaded, setSeriesLoaded] = useState(false);
  const getBooks = useMemo(
    () => async () => {
      if (loading) return;
      try {
        dispatch(load());
        const response = await axios
          .get(
            age === "" || age === undefined
              ? `${urls.getBooksSeriesMore}?start=${bookSetLimit - 5}&end=${
                  bookSetLimit + 10
                }`
              : `${urls.getBooksSeriesMore}?age=${age}&start=${
                  bookSetLimit - 5
                }&end=${bookSetLimit + 10}`
          )
          .then((res) => res.data)
          .catch((err) => {
            console.log(err);
          });
        delete response.books_series["Best Seller - Most Popular"];
        delete response.books_series["Most Popular Series"];
        delete response.books_series["New York Times Bestseller"];
        delete response.books_series["Global Bestseller"];
        delete response.books_series["Teacher Pick"];
        const title = Object.keys(await response.books_series);
        // setSeries(title);
        title.forEach((serie) => {
          response.books_series[`${serie}`].sort((a, b) => {
            return b.stock_available - a.stock_available;
          });
        });
        // setSeriesBook(await response.books_series);

        setBookSet(null);
        if (bookSetLimit === 5)
          dispatch(setBookSet({ bookSet: response.books_series }));
        else dispatch(appendBookSet({ bookSet: response.books_series }));
        setSeriesLoaded(true);
      } catch (err) {
        console.log(err);
      }
      dispatch(stopLoad());
    },
    [age, bookSetLimit]
  );
  const loadMore = () => {
    if (loadMoreRef.current)
      if (window.innerHeight + window.scrollY >= loadMoreRef.current.offsetTop)
        dispatch(increaseBookSetLimit());
  };
  useEffect(() => {
    appendBookSet(null);
    getBooks();
  }, [getBooks]);
  useEffect(() => {
    dispatch(resetBookSet());
    window.addEventListener("scroll", loadMore);
    return () => {
      window.removeEventListener("scroll", loadMore);
    };
  }, []);
  return (
    seriesLoaded && (
      <section className="px-8 md:px-2">
        {Object.keys(bookSet).map((serie, index) => {
          return (
            <div key={index}>
              <div
                className="flex flex-row items-baseline text-[12px]"
                ref={heightRef}
              >
                <p className="font-bold pl-[18px]" key={index}>
                  {serie.replace(/\s*\(.*?\)\s*/g, "")}
                </p>
                {bookSet[`${serie}`][0].authors?.split(",")[0] && (
                  <p className="text-[12px] border-l-[0.5px] ml-[10px] pl-[10px] border-secondary">
                    {bookSet[`${serie}`][0].authors?.split(",")[0]}
                  </p>
                )}

                {bookSet[`${serie}`][0].publisher?.split(",")[0] && (
                  <p
                    className={`xs:hidden text-[12px] border-l-[0.5px] ml-[10px] pl-[10px] border-secondary`}
                  >
                    {bookSet[`${serie}`][0].publisher?.split(",")[0]}
                  </p>
                )}
              </div>
              <Swiper
                slidesPerView={"auto"}
                spaceBetween={30}
                grabCursor={true}
                pagination={{
                  clickable: true,
                }}
                navigation={true}
                modules={[Navigation, Virtual]}
                className="mySwiper bg-transparent !p-4 border-b-[0.5px] border-unHighlight pb-[14px] mb-[10px]"
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
