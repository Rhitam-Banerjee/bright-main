import { useEffect, useRef, Fragment, useState } from "react";

import "./styles.scss";
import ScrollContainer from "react-indiana-drag-scroll";
import BookSlider from "../BookSlider";
import { useDispatch, useSelector } from "react-redux";
import {
  increaseBookSetLimit,
  resetBookSet,
  appendBookSet,
  setBookSet,
  setAge,
  load,
  stopLoad,
} from "../../reducers/bookSlice";
import BrowseLibraryLinks from "../Content/BrowseLibraryLinks";
import axios from "axios";
import urls from "../../utils/urls";
import React from "react";

const ages = 12;

const Genre = () => {
  const loadMoreRef = useRef(null);
  const ageScrollRef = useRef(null);
  const dispatch = useDispatch();
  const {
    main: { isLoggedIn },
    book: { loading, age, bookSetLimit },
  } = useSelector((state) => state);
  const [genre, setGenre] = useState(null);
  const [topBooks, setTopBooks] = useState(null);
  const [bestSeller, setBestSellers] = useState(null);
  const [teachersPick, setTeachersPick] = useState(null);

  const getGenreBookSet = async () => {
    if (loading) return;
    try {
      dispatch(load());
      const response = await axios.get(
        `https://server.brightr.club/api_v2_books/get-books-by-genre?age=${age}&start=0&end=80`
      );
      const uniqueGenres = {};
    const filteredGenre = response.data.book_set.filter((books) => {
      const normalizedGenre = books.genre.replace(/^"|"$/g, "");
      if (
        books.books.length >= 5 &&
        normalizedGenre !== "" &&
        !uniqueGenres[normalizedGenre]
      ) {
        uniqueGenres[normalizedGenre] = true;
        return true;
      }
      return false;
    });

    setGenre(filteredGenre);

    } catch (err) {
      console.log(err);
    }
    dispatch(stopLoad());
  };
  const getBestSellersBookSet = async () => {
    if (loading) return;
    try {
      dispatch(load());
      const response = await axios.get(
        `https://server.brightr.club/api_v2_books/getGlobalBestsellersByAge?age=${age}`
      );
      setBestSellers(response.data.book_set);
    } catch (err) {
      console.log(err);
    }
    dispatch(stopLoad());
  };
  const getTeachersBookSet = async () => {
    if (loading) return;
    try {
      dispatch(load());
      const response = await axios.get(
        `https://server.brightr.club/api_v2_books/getTeacherPicksByAge?age=${age}`
      );
      setTeachersPick(response.data.book_set);
      console.log(response.data.book_set);
    } catch (err) {
      console.log(err);
    }
    dispatch(stopLoad());
  };

  const getTopBookSet = async () => {
    if (loading) return;
    try {
      dispatch(load());
      const response = await axios.get(
        `https://server.brightr.club/api_v2_books/getTopBooksByReviewCount?age=${age}`
      );
      setTopBooks(response.data.book_set);
    } catch (err) {
      console.log(err);
    }
    dispatch(stopLoad());
  };

  const scrollToCenter = () => {
    if (ageScrollRef.current)
      ageScrollRef.current.container.current.scrollLeft =
        145.5 * (age === "12+" ? 13 : age) -
        ageScrollRef.current.container.current.clientWidth / 2 +
        72;
  };

  useEffect(() => {
    scrollToCenter();
  }, [age]);

  useEffect(
    () => {
      setGenre(null);
      setTopBooks(null);
      getGenreBookSet();
      getTopBookSet();
      getBestSellersBookSet();
      getTeachersBookSet();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [age, bookSetLimit]
  );

  return (
    <div className="browse-library">
      <h1>Browse Library</h1>
      <div className="filters">
        <h3>Select By Age</h3>
        <ScrollContainer vertical={false} ref={ageScrollRef}>
          <div className="filter-list">
            {Array(ages)
              .fill(true)
              .map((_, i) => {
                return (
                  <div
                    key={i}
                    className={`filter ${i === age ? "selected-filter" : ""}`}
                    onClick={() => dispatch(setAge({ age: i }))}
                  >
                    <h2>
                      {i} - {i + 1}
                    </h2>
                    <p>Years</p>
                  </div>
                );
              })}
            <div
              className={`filter ${age === "12+" ? "selected-filter" : ""}`}
              onClick={() => dispatch(setAge({ age: "12+" }))}
            >
              <h2>12+</h2>
              <p>Years</p>
            </div>
          </div>
        </ScrollContainer>
      </div>

      {topBooks &&
        topBooks.map((books) => {
          return (
            <React.Fragment key={books.category}>
              <BookSlider
                ranking={true}
                title={"Top Books"}
                books={books.books}
                getBooks={getTopBookSet}
              />
            </React.Fragment>
          );
        })}

      {teachersPick &&
        teachersPick.map((books) => {
          return (
            <React.Fragment key={books.category}>
              <BookSlider
                ranking={true}
                title={"Teachers Pick"}
                books={books.books}
                getBooks={getTopBookSet}
              />
            </React.Fragment>
          );
        })}

      {bestSeller &&
        bestSeller.map((books) => {
          if (books.genre != "") {
            return (
              <React.Fragment key={books.category}>
                <BookSlider
                  ranking={true}
                  title={"Best Sellers"}
                  books={books.books}
                  getBooks={getGenreBookSet}
                />
              </React.Fragment>
            );
          }
          return null;
        })}

      {genre &&
        genre.map((books) => {
          if (books.books.length >= 5 && books.genre != "") {
            return (
              <React.Fragment key={books.category}>
                <BookSlider
                  title={books.genre.replace(/^"|"$/g, "")}
                  books={books.books}
                  getBooks={getGenreBookSet}
                />
              </React.Fragment>
            );
          }
          return null;
        })}

      <div ref={loadMoreRef}></div>
      <BrowseLibraryLinks />
    </div>
  );
};

export default Genre;
