import { useEffect, useRef, useState } from "react";
import {
  AmazonTopBooks,
  MostPopularDump,
  MostSoughtAfter,
  NewSeriesDump,
  YoutubeTopBooks,
} from "./";
import { AuthorSection, NewSeries, NewGenre } from "./";
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
      <NewSeries />
      <YoutubeTopBooks />
      <AuthorSection />
      <MostPopularDump />
      <div ref={loadSeriesGenre}></div>
      {isLoadSeriesGenre && (
        <>
          <NewGenre />
          <MostSoughtAfter />
          <NewSeriesDump />
        </>
      )}
    </div>
  );
};
export default BrowseLibraryRenew;
