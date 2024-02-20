import { useEffect, useRef, useState } from "react";
import { MostPopularDump, NewSeriesDump } from "./";
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
    <div>
      <MostPopularDump />
      <NewSeries />
      <NewSeriesDump />
      <div ref={loadSeriesGenre}></div>
      {isLoadSeriesGenre && (
        <>
          <AuthorSection />
          <NewGenre />
        </>
      )}
    </div>
  );
};
export default BrowseLibraryRenew;
