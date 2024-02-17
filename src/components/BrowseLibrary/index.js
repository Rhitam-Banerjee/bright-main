import { useEffect, useRef } from "react";
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

const ages = 12;

const BrowseLibrary = () => {
  const loadMoreRef = useRef(null);
  const ageScrollRef = useRef(null);
  const dispatch = useDispatch();
  const {
    main: { isLoggedIn },
    book: { loading, age, bookSet, bookSetLimit },
  } = useSelector((state) => state);

  const getBookSet = async () => {
    if (loading) return;
    try {
      dispatch(load());
      const response = await axios.get(urls.getBookSet, {
        params: {
          age: age === "12+" ? 13 : age,
          section_name: "Browse Library",
          start: bookSetLimit - 5 ,
          end: bookSetLimit+15,
        },
      });
      response.data.book_set = response.data.book_set.map((bookSet) => {
        return {
          ...bookSet,
          books: bookSet.books.sort(
            (a, b) => b.stock_available - a.stock_available
          ),
        };
      });
      setBookSet(null);
      if (bookSetLimit === 5)
        dispatch(setBookSet({ bookSet: response.data.book_set }));
      else dispatch(appendBookSet({ bookSet: response.data.book_set }));

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

  const loadMore = () => {
    if (loadMoreRef.current)
      if (window.innerHeight + window.scrollY >= loadMoreRef.current.offsetTop)
        dispatch(increaseBookSetLimit());
  };

  useEffect(() => {
    scrollToCenter();
  }, [age]);

  useEffect(
    () => {
      setBookSet(null)
      appendBookSet(null)
      getBookSet();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [age, bookSetLimit]
  );

  useEffect(() => {
    dispatch(resetBookSet());
    window.addEventListener("scroll", loadMore);
    return () => {
      window.removeEventListener("scroll", loadMore);
    };
  }, []);
  const sortByBestSeller = (a, b) => {
    if (a.category === "Best Seller - Most Popular") {
      return -1;
    } else if (b.category === "Best Seller - Most Popular") {
      return 1;
    } else {
      return 0;
    }
  };
  const getUniqueCategories = (bookSet) => {
    const uniqueCategories = {};
    bookSet.forEach((books) => {
      uniqueCategories[books.category] = books;
    });
    return Object.values(uniqueCategories);
  };
  const uniqueCategories = getUniqueCategories(bookSet);

  return (
    <div className='browse-library'>
      <h1>Browse Library</h1>
      <div className='filters'>
        <h3>Select By Age</h3>
        <ScrollContainer vertical={false} ref={ageScrollRef}>
          <div className='filter-list'>
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
      {uniqueCategories.sort(sortByBestSeller).map((books) => {
        return (
          <BookSlider
            key={books.category}
            title={books.category}
            books={books.books}
            getBooks={getBookSet}
          />
        );
      })}
      <div ref={loadMoreRef}></div>
      <BrowseLibraryLinks />
    </div>
  );
};

export default BrowseLibrary;
