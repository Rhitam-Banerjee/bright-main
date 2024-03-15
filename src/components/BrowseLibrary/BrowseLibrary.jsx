import { useEffect, useRef, useState } from "react";
import {
  AmazonTopBooks,
  NewYorkTimes,
  MostSoughtAfter,
  SeriesDump,
  YoutubeTopBooks,
  AmazonAuthors,
  PopularSeries,
  PopularGenre,
} from ".";
import { PopularAuthors, AmazonSeries, AmazonGenre } from "./";
import { useSelector } from "react-redux";
import { setIsMobile } from "../../reducers/mainSlice";
import { useLocation } from "react-router-dom";
const BrowseLibrary = () => {
  const { age } = useSelector((store) => store.book);
  const location = useLocation();
  const { pathname } = location;
  // const [scrollPos,setScrollPos] = useState()
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
      if (
        window.innerHeight + window.scrollY >=
        loadSeries.current.offsetTop - 500
      )
        setIsLoadSeries(true);
  };

  const scrollToPage = () => {
    if (pathname === "/browse-library") {
      const getScrollPos = sessionStorage.getItem("scrollPosition");
      if (getScrollPos) {
        window.scrollTo(0, parseInt(getScrollPos));
        sessionStorage.setItem("scrollPosition", 0);
      }
    }
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
    setIsLoadSeries(false);
  }, [age]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem("scrollPosition", window.scrollY);
    };
    window.addEventListener("scroll", handleBeforeUnload);
    return () => {
      window.removeEventListener("scroll", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    window.addEventListener("load", scrollToPage);
    return () => {
      window.removeEventListener("load", scrollToPage);
    };
  }, []);
  return (
    <main className="mt-[140px]">
      <AmazonTopBooks />
      <AmazonSeries />
      <YoutubeTopBooks />
      <AmazonAuthors />
      <div ref={loadSoughtAfter}></div>
      {isLoadSoughtAfter && (
        <>
          <NewYorkTimes />
          <PopularSeries />
          <MostSoughtAfter />
          <PopularAuthors />
          <AmazonGenre />
          <PopularGenre />
        </>
      )}
      <div ref={loadSeries}></div>
      {isLoadseries && (
        <>
          <SeriesDump />
        </>
      )}
    </main>
  );
};
export default BrowseLibrary;
