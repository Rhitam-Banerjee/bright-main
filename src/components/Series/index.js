import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Star from "../../icons/Star";
import "./styles.scss";
import { setAlert } from "../../reducers/mainSlice";
const Series = () => {
  const {
    main: { user, isLoggedIn },
  } = useSelector((state) => state);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const decodedSeries = decodeURIComponent(params.series);

  const [seriesBooks, setSeriesBooks] = useState(null);
  const initialExpandedState = Array().fill(false);
  const [expanded, setExpanded] = useState(initialExpandedState);

  const [wishClickedMap, setWishClickedMap] = useState({});
  const [wishListBooks, setWishListBooks] = useState([]);

  const limitDescription = (description, limit) => {
    if (description) {
      if (description.split(" ").length > limit) {
        return description.split(" ").slice(0, limit).join(" ") + " ...";
      }
      return description;
    } else {
      return "";
    }
  };

  const toggleExpanded = (index) => {
    const updatedExpanded = [...expanded];
    updatedExpanded[index] = !updatedExpanded[index];
    setExpanded(updatedExpanded);
  };

  useEffect(() => {
    async function fetchBooks() {
      const response = await axios.get(
        `https://server.brightr.club/api_v2_books/getBooksByCategory?category_name=${params.series}`
      );

      setSeriesBooks(response.data.books_in_category);
    }
    fetchBooks();
  }, []);

  useEffect(() => {
    if (seriesBooks) {
      console.log(seriesBooks[0].image);
    }
  }, [seriesBooks]);

  const addToReadList = async (isbn) => {
    const isbnData = {
      isbn: isbn,
    };

    try {
      // Check if the book is already in the wishlist
      const isBookInWishlist = wishListBooks.some((book) => book.isbn === isbn);

      if (!isBookInWishlist) {
        // If the book is not in the wishlist, make the API call
        const response = await axios.post(
          `https://server.brightr.club/api_v2/add-to-wishlist`,
          isbnData,
          { withCredentials: true }
        );

        // Update wishListBooks state with the new book
        setWishListBooks((prevBooks) => [...prevBooks, response.data]);

        // Update wishClickedMap to mark the book as clicked
        setWishClickedMap((prevMap) => {
          const updatedMap = { ...prevMap };
          updatedMap[isbn] = true;
          return updatedMap;
        });

        dispatch(setAlert({ text: ` added to wishlist`, color: "#33A200" }));
      } else {
        // If the book is already in the wishlist, make the API call to remove

        try {
          const response = await axios.post(
            `https://server.brightr.club/api_v2/wishlist-remove`,
            isbnData,
            { withCredentials: true }
          );
          dispatch(
            setAlert({ text: ` Removed from wishlist`, color: "#F75549" })
          );
          // Update wishListBooks state by removing the book
          setWishListBooks((prevBooks) =>
            prevBooks.filter((book) => book.isbn !== isbn)
          );

          // Update wishClickedMap to mark the book as not clicked
          setWishClickedMap((prevMap) => {
            const updatedMap = { ...prevMap };
            updatedMap[isbn] = false;
            return updatedMap;
          });
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
    }
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
  }, [wishListBooks]);

  const renderBookDescription = (book, index) => {
    const limitedDescription = limitDescription(book.description, 10);
    return (
      <div style={{ fontSize: "16px" }}>
        {expanded[index] ? book.description : limitedDescription}
      </div>
    );
  };

  return (
    <div>
      {seriesBooks && (
        <div className='series'>
          <div className='series-box-head'>
            <div className='image-box'>
              <div className='side-image-box '>
                <img alt='' src={seriesBooks[0].image} className='side-image' />
                {seriesBooks[1] && (
                  <img
                    alt=''
                    src={seriesBooks[1].image}
                    className='side-image'
                  />
                )}
              </div>
              {seriesBooks[2] && (
                <img
                  alt=''
                  src={seriesBooks[2].image}
                  className='main-image '
                  style={{ zIndex: 1 }}
                />
              )}
            </div>

            <div className='series-quantity'>
              <p>{decodedSeries} Collection</p>
              <p>({seriesBooks.length}) books</p>
            </div>
          </div>
          <div className='series-list '>
            <hr />
            <div
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                marginTop: "1rem",
              }}
            >
              Books in this series ({seriesBooks.length}) books
            </div>
            <div style={{ marginTop: "1rem" }} className='  '>
              {seriesBooks.map((book, index) => (
                <>
                  <div className='series-list-item'>
                    <img
                      onClick={() => navigate(`/book/${book.isbn}`)}
                      className='series-list-image '
                      src={book.image}
                    />
                    <div className='series-list-details '>
                      <h1 className='book-name'>{book.name}</h1>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          fontSize: "12px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            fontWeight: "500",
                            gap: "0.5rem",
                          }}
                        >
                          {book.authors != "null" &&
                            book.authors.map((author) => (
                              <p style={{ fontSize: "16px" }} key={author.id}>
                                <Link to={`/author/${author}`}>{author}</Link>
                              </p>
                            ))}
                        </div>
                        <p
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            fontSize: "16px",
                            marginTop: "10px",
                          }}
                        >
                          <>{book.rating}</>
                          <>
                            <Star />
                          </>
                          <> ({book.review_count}) Reviews</>
                        </p>
                      </div>
                      {isLoggedIn && (
                        <button
                          className='wishlist-button'
                          onClick={() => addToReadList(book.isbn)}
                          style={{
                            border: `1px solid  ${
                              wishClickedMap[book.isbn] ? "#9e9e9e" : "#FFCE44"
                            }`,
                            color: `${
                              wishClickedMap[book.isbn] ? "#9e9e9e" : "#FFCE44"
                            }`,
                          }}
                        >
                          ADD TO Wishlist
                        </button>
                      )}
                      {renderBookDescription(book, index)}
                      {book.description && book.description.length > 10 && (
                        <button
                          onClick={() => toggleExpanded(index)}
                          style={{
                            cursor: "pointer",
                            textAlign: "left",
                            color: "rgb(59 130 246)",
                            backgroundColor: "#fff",
                            fontSize: "16px",
                          }}
                        >
                          {expanded[index] ? "Read Less" : "Read More"}
                        </button>
                      )}
                      {!book.description && <>Description not avaialable</>}
                      {seriesBooks && (
                        <div style={{ fontWeight: "600" }}>
                          Amazon Price:
                          {(() => {
                            const maxPrice = Math.max(
                              book.boardbookprice,
                              book.hardcoverprice,
                              book.paperbackprice
                            );

                            if (maxPrice > 2) {
                              let type = "";
                              if (maxPrice === book.boardbookprice) {
                                type = "BoardBook";
                              } else if (maxPrice === book.hardcoverprice) {
                                type = "Hardcover";
                              } else {
                                type = "Paperback";
                              }

                              return (
                                <p>
                                  Price - ₹{maxPrice} | Type - {type}
                                </p>
                              );
                            } else {
                              return <p> </p>;
                            }
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                  <hr />
                </>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Series;
