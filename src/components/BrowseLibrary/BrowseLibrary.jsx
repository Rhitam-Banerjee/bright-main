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
const BrowseLibraryRenew = () => {
  const [isLoadSeriesGenre, setIsLoadSeriesGenre] = useState(false);
  const loadSeriesGenre = useRef();
  const loadMore = () => {
    if (loadSeriesGenre.current)
      if (
        window.innerHeight + window.scrollY >=
        loadSeriesGenre.current.offsetTop - 600
      )
        setIsLoadSeriesGenre(true);
  };
  useEffect(() => {
    window.addEventListener("scroll", loadMore);
    return () => {
      window.removeEventListener("scroll", loadMore);
    };
  }, []);
  return (
    <div className="mt-[120px]">
      <AmazonTopBooks />
      <AmazonSeries />
      <YoutubeTopBooks />
      <AmazonAuthors />
      <div ref={loadSeriesGenre}></div>
      {isLoadSeriesGenre && (
        <>
          <NewYorkTimes />
          <AmazonGenre />
          <MostSoughtAfter />
          <PopularAuthors />
          <SeriesDump />
        </>
      )}
    </div>
  );
};
export default BrowseLibraryRenew;
