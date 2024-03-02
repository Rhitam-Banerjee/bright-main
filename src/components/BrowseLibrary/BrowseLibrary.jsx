import { useEffect, useRef, useState } from "react";
import {
  AmazonTopBooks,
  NewYorkTimes,
  MostSoughtAfter,
  SeriesDump,
  YoutubeTopBooks,
  AmazonAuthors,
} from ".";
import { PopularAuthors, AmazonSeries, AmazonGenre } from "./";
import { useSelector } from "react-redux";
const BrowseLibrary = () => {
  const { age } = useSelector((store) => store.book);
  const [isLoadSoughtAfter, setIsLoadSoughtAfter] = useState(false);
  const [isLoadseries, setIsLoadSeries] = useState(false);
  const loadSoughtAfter = useRef();
  const loadSeries = useRef();
  const loadSoughtAfterBooks = () => {
    if (loadSoughtAfter.current)
      if (
        window.innerHeight + window.scrollY >=
        loadSoughtAfter.current.offsetTop - 600
      )
        setIsLoadSoughtAfter(true);
  };
  const loadSeriesBooks = () => {
    if (loadSeries.current)
      if (window.innerHeight + window.scrollY >= loadSeries.current.offsetTop)
        setIsLoadSeries(true);
  };
  useEffect(() => {
    window.addEventListener("scroll", loadSoughtAfterBooks);
    return () => {
      window.removeEventListener("scroll", loadSoughtAfterBooks);
    };
  }, []);
  useEffect(() => {
    window.addEventListener("scroll", loadSeriesBooks);
    return () => {
      window.removeEventListener("scroll", loadSeriesBooks);
    };
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [age]);
  return (
    <div className="mt-[120px]">
      <AmazonTopBooks />
      <AmazonSeries />
      <YoutubeTopBooks />
      <div ref={loadSoughtAfter}></div>
      {isLoadSoughtAfter && (
        <>
          <AmazonAuthors />
          <NewYorkTimes />
          <AmazonGenre />
          <MostSoughtAfter />
          <PopularAuthors />
          <SeriesDump />
        </>
      )}
      <div ref={loadSeries}></div>
      {isLoadseries && <SeriesDump />}
    </div>
  );
};
export default BrowseLibrary;
