import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import urls from "../../utils/urls";

import { SearchBooks, SearchGenres, SearchSeries, SearchAuthors } from "./";

import { load, stopLoad } from "../../reducers/bookSlice";

const Search = () => {
  const { search } = useParams();
  const dispatch = useDispatch();
  const { age, loading } = useSelector((store) => store.book);
  const { isLoggedIn, searchText } = useSelector((store) => store.main);

  const [bookData, setBookData] = useState([]);
  const [authorData, setAuthorData] = useState([]);
  const [seriesData, setSeriesData] = useState([]);
  const [genreData, setGenreData] = useState([]);

  const getSearch = async () => {
    dispatch(load());
    try {
      const response = await axios
        .get(
          age === "" || age === undefined
            ? `${urls.getSearch}?to_search=${search.toString()}`
            : `${urls.getSearch}?age=${age}&to_search=${search.toString()}`
        )
        .then((res) => res.data)
        .catch((err) => console.log(err));
      response.result.books?.sort((a, b) => {
        return b.review_count - a.review_count;
      });
      response.result.books?.sort((a, b) => {
        return b.match - a.match;
      });
      if (isLoggedIn) {
        response.result.books.sort((a, b) => {
          return b.stocks_available - a.stocks_available;
        });
      }
      setBookData(response.result.books);
      response.result.authors?.sort((a, b) => {
        return b.review_count - a.review_count;
      });
      response.result.authors?.sort((a, b) => {
        return b.match - a.match;
      });
      setAuthorData(response.result.authors);

      response.result.series?.sort((a, b) => {
        return b.review_count - a.review_count;
      });
      response.result.series?.sort((a, b) => {
        return b.match - a.match;
      });
      setSeriesData(response.result.series);

      response.result.genres?.sort((a, b) => {
        return b.review_count - a.review_count;
      });
      response.result.genres?.sort((a, b) => {
        return b.match - a.match;
      });
      setGenreData(response.result.genres);
      dispatch(stopLoad());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSearch();
  }, [search, age]);

  return (
    <main className="mt-[140px] pl-8 md:px-2 pb-[10px]">
      {!loading ? (
        <>
          <h1 className="flex font-bold text-[12px] pb-[10px]">
            Search Results for{" "}
            <span className="text-secondary pl-2">{search}</span>
          </h1>
          <SearchBooks data={bookData} />
          {authorData?.length > 0 && <SearchAuthors data={authorData} />}
          {seriesData?.length > 0 && <SearchSeries data={seriesData} />}
          {genreData?.length > 0 && <SearchGenres data={genreData} />}
        </>
      ) : (
        <h1>Loading</h1>
      )}
    </main>
  );
};

export default Search;
