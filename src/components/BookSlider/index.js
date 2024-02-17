import { useState, useEffect, useRef } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import "./styles.scss";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import "react-loading-skeleton/dist/skeleton.css";
import { getOverlay } from "./utils";
import { useSelector, useDispatch } from "react-redux";
import { getDate } from "../../utils";
import moment from "moment";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { setAlert } from "../../reducers/mainSlice";

const BookSlider = ({
  title,
  books,
  booksTitle,
  overlay,
  showOverlay = true,
  ranking,
}) => {
  const {
    main: { user, isLoggedIn },
    wishlist: { bucket },
    book: { age },
  } = useSelector((state) => state);

  const dispatch = useDispatch();
  const location = useLocation();
  const [sectionBooks, setSectionBooks] = useState(
    books.length ? books : ["No books to show"]
  );
  const [booksScroll, setBooksScroll] = useState(0);
  const [wishClickedMap, setWishClickedMap] = useState({});
  const [wishListBooks, setWishListBooks] = useState([]);
  const booksRef = useRef(null);

  const slide = (direction, ref) => {
    const element = ref.current.container.current;
    setBooksScroll(element.scrollLeft);
    if (direction === "right")
      element.scrollTo(element.scrollLeft + element.clientWidth - 100, 0);
    else element.scrollTo(element.scrollLeft - element.clientWidth - 100, 0);
  };

  useEffect(() => {
    async function fetchBookSet() {
      try {
        const response = await axios.get(
          `https://server.brightr.club/api_v2/get-wishlists?guid=${user.id}`,
          { withCredentials: true }
        );
        setWishListBooks(response.data.wishlists);

        // Initialize wishClickedMap based on books in the wishlist
        const initialWishClickedMap = {};
        response.data.wishlists.forEach((book) => {
          initialWishClickedMap[book.isbn] = true;
        });
        setWishClickedMap(initialWishClickedMap);
      } catch (error) {
        console.error(error);
      }
    }

    fetchBookSet();
  }, []);

  const addToReadList = async (isbn) => {
    const isbnData = { isbn: isbn };

    try {
      const isBookInWishlist = wishListBooks.some((book) => book.isbn === isbn);

      if (!isBookInWishlist) {
        // If the book is not in the wishlist, add it
        const response = await axios.post(
          `https://server.brightr.club/api_v2/add-to-wishlist`,
          isbnData,
          { withCredentials: true }
        );

        setWishListBooks((prevBooks) => [...prevBooks, response.data]);
        setWishClickedMap((prevMap) => {
          const updatedMap = { ...prevMap };
          updatedMap[isbn] = true;
          return updatedMap;
        });
        dispatch(setAlert({ text: `Added to wishlist`, color: "#33A200" }));
      } else {
        // If the book is already in the wishlist, remove it
        const response = await axios.post(
          `https://server.brightr.club/api_v2/wishlist-remove`,
          isbnData,
          { withCredentials: true }
        );

        setWishListBooks((prevBooks) =>
          prevBooks.filter((book) => book.isbn !== isbn)
        );
        setWishClickedMap((prevMap) => {
          const updatedMap = { ...prevMap };
          updatedMap[isbn] = false;
          return updatedMap;
        });
        dispatch(setAlert({ text: `Removed from wishlist`, color: "#F75549" }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getWishlistDeliveryDate = (i, date) => {
    if (bucket.length)
      return getDate(
        moment(date).add(7 * Math.round((i + 1) / user.books_per_week), "days")
      );
    return getDate(
      moment(date).add(
        7 * (Math.round((i + 1) / user.books_per_week) - 1),
        "days"
      )
    );
  };

  useEffect(() => {
    const element = booksRef.current.container.current;
    element.scrollTo(0, 0);
  }, [age]);

  useEffect(() => {
    if (books.length) setSectionBooks(books);
    else setSectionBooks(["No books to show"]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [books]);

  return (
    <div className="book-slider">
      {title && <h3 className="title text-white">{title}</h3>}
      <div className="books">
        {sectionBooks?.length &&
          sectionBooks[0] !== "No books to show" &&
          booksScroll !== 0 && (
            <AiOutlineLeft
              className="left-arrow"
              onClick={() => slide("left", booksRef)}
            />
          )}
        {sectionBooks?.length &&
          sectionBooks[0] !== "No books to show" &&
          booksRef?.current?.container.current.scrollWidth >
            booksRef?.current?.container.current.clientWidth && (
            <AiOutlineRight
              className="right-arrow"
              onClick={() => slide("right", booksRef, true)}
            />
          )}
        {booksTitle && <h3>{booksTitle}</h3>}
        <ScrollContainer vertical={false} ref={booksRef}>
          {!sectionBooks?.length || sectionBooks[0] === "No books to show" ? (
            <h3
              style={{ textAlign: "center", fontSize: "0.9rem" }}
              className="no-books-text"
            >
              No books to show
            </h3>
          ) : (
            <div className="book-list">
              {sectionBooks
                .filter(
                  (book, index, self) =>
                    index === self.findIndex((b) => b.isbn === book.isbn)
                )
                .map((book, i) => {
                  return (
                    <div
                      className={`book ${
                        isLoggedIn &&
                        (!book.stock_available ||
                          (book.stock_available === 99 &&
                            overlay === "wishlist"))
                          ? "book-not-available"
                          : ""
                      }`}
                      key={i}
                      style={{ position: "relative" }}
                    >
                      {ranking && (
                        <div className="ranking-div">
                          <span
                            className="inner-span"
                            style={{ position: "relative" }}
                          >
                            <span
                              className="ranking-text"
                              style={{
                                textShadow:
                                  "-2px 0 #4285f4, 0 2px #4285f4, 2px 0 #4285f4, 0 -2px #4285f4",
                              }}
                            >
                              {i + 1}
                            </span>
                          </span>
                        </div>
                      )}

                      <div className="book-image">
                        <Link to={`/book/${book.isbn}`}>
                          <img src={book.image} alt="Book" />
                        </Link>
                      </div>
                      <p style={{ textAlign: "center" }}>{book.name}</p>

                      <div className="book-details">
                        <div style={{ display: "flex" }}>
                          {book.rating && (
                            <div className="book-detail">
                              <p>{book.rating}</p>
                              <img src="/icons/star.png" alt="Rating" />
                            </div>
                          )}
                          {location.pathname != "/your-library" && (
                            <> &nbsp;| &nbsp;</>
                          )}

                          {book.review_count && !isNaN(book.review_count) && (
                            <div className="book-detail">
                              <img src="/icons/reviews.png" alt="Reviews" />
                              <p>
                                {Number(book.review_count).toLocaleString()}
                              </p>
                            </div>
                          )}
                        </div>
                        {location.pathname != "/your-library" && isLoggedIn && (
                          <button
                            style={{
                              color: `${
                                wishClickedMap[book.isbn] ? "gray" : "#FFCE44"
                              }`,
                            }}
                            className="wish-button"
                            onClick={() => addToReadList(book.isbn)}
                          >
                            WISH
                          </button>
                        )}
                      </div>

                      {isLoggedIn &&
                        overlay === "wishlist" &&
                        (!book.stock_available ||
                          book.stock_available === 99) && (
                          <p className="all-copies-booked">All Copies Booked</p>
                        )}
                      {location.pathname === "/your-library" &&
                        showOverlay &&
                        getOverlay(
                          overlay,
                          sectionBooks,
                          book,
                          i,
                          dispatch,
                          isLoggedIn
                        )}
                    </div>
                  );
                })}
            </div>
          )}
        </ScrollContainer>
      </div>
    </div>
  );
};

export default BookSlider;
