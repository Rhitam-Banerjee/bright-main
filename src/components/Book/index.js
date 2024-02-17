import { Fragment, useEffect, useState } from "react";
import "./styles.scss";
import { FaStar } from "react-icons/fa";
import BookSlider from "../BookSlider";
import { AiOutlineHeart } from "react-icons/ai";
import { Link, useNavigate, useParams } from "react-router-dom";
import { productDetails, stats } from "./constants";
import { setAlert } from "../../reducers/mainSlice";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist } from "../../reducers/wishlistSlice";
import axios from "axios";
import urls from "../../utils/urls";
import randomInteger from "random-int";
import moment from "moment";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import devUrls from "../../utils/devUrls";
import ReadMore from "react-read-more-read-less";

const Book = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    main: { isLoggedIn },
  } = useSelector((state) => state);
  const { isbn } = useParams();
  const [book, setBook] = useState(null);
  const [similarBooks, setSimilarBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [secondaryImages, setSecondaryImages] = useState(null);
  const [authorsList, setAuthorsList] = useState(null);
  const [videoSource, setVideoSource] = useState(null);

  useEffect(() => {
    const getSecondaryImages = async () => {
      const response = await axios.get(
        `https://server.brightr.club/api_v2_books/book-images/${isbn}`
      );

      setSecondaryImages(response.data.other_images);
    };
    getSecondaryImages();
  }, [isbn]);

  const getBook = async () => {
    try {
      const response = await axios.get(urls.getBooks, {
        params: { search_query: String(isbn) },
      });
      const newBook = response.data.books[0];
      setBook({
        ...newBook,
        stars: !isNaN(Number(newBook.rating))
          ? Math.round(Number(newBook.rating))
          : 0,
        pages: newBook.pages && `${newBook.pages}`,
        price: newBook.price && `₹ ${newBook.price}/-`,
        for_age:
          newBook.for_age || `${newBook.min_age} - ${newBook.max_age} years`,
        publication_date:
          newBook.publication_date &&
          moment(newBook.publication_date).format("MMM Do YY"),
        paperbackprice: newBook.paperbackprice,
        boardbookprice: newBook.boardbookprice,
        hardcoverprice: newBook.hardcoverprice,
      });
      setCategories(
        Array.from(
          new Set(newBook.categories.map(({ category }) => category.name))
        )
      );
    } catch (err) {
      console.log(err);
      navigate("/");
    }
  };

  const wishlistAdd = async (book) => {
    dispatch(
      setAlert({ text: `${book.name} added to wishlist`, color: "#33A200" })
    );
    dispatch(addToWishlist({ book }));
    try {
      await axios.post(
        devUrls.addToWishlist,
        { isbn: book.isbn },
        { withCredentials: true }
      );
    } catch (err) {
      console.log(err);
    }
  };

  const getSimilarBooks = async () => {
    const response = await axios.get(urls.getBooks, {
      params: {
        start: 0,
        end: 10,
        age: randomInteger(book.min_age, book.max_age),
      },
    });
    setSimilarBooks(response.data.books);
  };

  useEffect(() => {
    async function fetchBookDetails() {
      try {
        const response = await axios.get(
          `https://server.brightr.club/api_v2_books/getAuthorsByISBN?isbn=${isbn}`
        );
        setAuthorsList(response.data.authors);
      } catch (error) {
        console.error(error);
      }
    }

    fetchBookDetails();
  }, []);
  useEffect(() => {
    if (book) getSimilarBooks();
    console.log(book);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book]);

  useEffect(() => {
    getBook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isbn]);

  useEffect(() => {
    const fetchVideoSource = async () => {
      if (isbn) {
        try {
          setVideoSource(null);

          const response = await axios.get(
            `https://server.brightr.club/api_v2_books/book-video/${isbn}`
          );
          setVideoSource(response.data.video_source);

          console.info(response.data.video_source);
        } catch (error) {
          setVideoSource(null);

          console.error(error);
        }
      }
    };
    fetchVideoSource();
  }, [isbn]);

  if (!book)
    return (
      <h1 style={{ margin: "10rem", textAlign: "center", padding: "1rem" }}>
        Loading...
      </h1>
    );
  return (
    <div className="single-book">
      <div className="book text-white">
        <div className="book-main-details">
          <h1>
            {book.name.length > 55 ? `${book.name.slice(0, 55)}...` : book.name}
          </h1>
          <div className="rating">
            {Array(book.stars)
              .fill(true)
              .map((_, i) => {
                if (i > Number(book.stars - 1 || -1))
                  return <FaStar style={{ color: "#F2F2F2" }} key={i} />;
                return <FaStar style={{ color: "#DFB300" }} />;
              })}
            {!/[a-z]/i.test(book.rating) && <div>{book.rating}</div>}
          </div>
          <div className="stats">
            {stats.map((stat, i) => {
              if (!book[stat.name] && !stat.default)
                return <Fragment key={i} />;
              return (
                <div className="stat" key={i}>
                  <img alt="Stat" src={stat.image} />
                  <p>{book[stat.name] ? `${book[stat.name]}` : stat.default}</p>
                </div>
              );
            })}
            <a href="#product-details">View More</a>
          </div>
          <div className="categories">
            <h4>Series:</h4>
            {categories
              .filter(
                (category) =>
                  category !== "Best Seller - Most Popular" &&
                  category !== "Global Bestseller" &&
                  category !== "Most Popular Series" &&
                  category !== "Editor Pick" &&
                  category !== "Bedtime Stories" &&
                  category !== "Family Time" &&
                  category !== "Book that Inspired Movies" &&
                  category !== "New York Times Bestseller" &&
                  category !== "Good Habits" &&
                  category !== "Teacher Pick" &&
                  category !== "S.T.E.A.M. Learning" &&
                  category !== "Learning Times"
              )
              .map((category) => {
                return (
                  <Link to={`/series/${category}`}>
                    <div key={category.id} className="category">
                      {category}
                    </div>
                  </Link>
                );
              })}
          </div>
          <div className="categories">
            {authorsList && (
              <>
                <h4>Authors:</h4>
                {authorsList.map((author, key) => (
                  <div key={author.id} className="category ">
                    <Link to={`/author/${author}`}>{author}</Link>
                  </div>
                ))}
              </>
            )}
          </div>

          <div className=" flex flex-col category">
            {book && book.boardbookprice > 2 && (
              <h4 className="  font-bold  category">
                Amazon BoardBook Price ₹ {book.boardbookprice}
              </h4>
            )}
            {book && book.paperbackprice > 2 && (
              <h4 className=" font-bold  category">
                Amazon PaperBack Price ₹ {book.paperbackprice}
              </h4>
            )}
            {book && book.hardcoverprice > 2 && (
              <h4 className="  font-bold categories">
                Amazon HardCover Price ₹ {book.hardcoverprice}
              </h4>
            )}
          </div>

          {book.description && (
            <div className="description">
              <h4>Description</h4>
              <ReadMore
                readMoreText={<b>Read More</b>}
                readLessText={<b>Read Less</b>}
                charLimit={150}
              >
                {book.description}
              </ReadMore>
            </div>
          )}
        </div>
        <div className="book-image">
          <div className="image">
            {secondaryImages || videoSource ? (
              <Splide
                options={{
                  width: "100%",
                }}
                aria-label="React Splide Example"
              >
                <SplideSlide>
                  <img
                    alt="Book"
                    src={book.image
                      .replace("US2", "US8")
                      .replace("SX2", "SX8")
                      .replace("_US", "_SY")}
                  />
                </SplideSlide>

                {secondaryImages &&
                  secondaryImages.map((image, i) => {
                    if (i === 0) return <Fragment key={i} />;
                    return (
                      <SplideSlide key={image}>
                        <img
                          className="book-image"
                          style={{ maxHeight: "300px", objectFit: "cover" }}
                          src={image.image_source}
                          alt="Book"
                        />
                      </SplideSlide>
                    );
                  })}

                {videoSource && (
                  <SplideSlide
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <video
                        style={{ height: "300px", maxWidth: "280px" }}
                        src={videoSource}
                        autoPlay
                        muted
                        loop
                      />
                    </div>
                  </SplideSlide>
                )}
              </Splide>
            ) : (
              <img
                alt="Book"
                src={book.image
                  .replace("SY2", "SY8")
                  .replace("SX2", "SX8")
                  .replace("US2", "US8")}
              />
            )}
          </div>
          {isLoggedIn && (
            <button onClick={() => wishlistAdd(book)}>
              <AiOutlineHeart />
              <p>Add to Wishlist</p>
            </button>
          )}
        </div>
      </div>
      <BookSlider
        books={similarBooks}
        title="More Like This"
        bookBackground="#F1F1F0"
      />
      <div className="product-details" id="product-details">
        <h3 className="text-white">Product Details</h3>
        <div className="product-detail-list">
          {productDetails.map((detail, i) => {
            if (!book[detail.name]) return <Fragment key={i} />;
            return (
              <div className="product-detail" key={i}>
                <b>{detail.title}</b>
                <p>{book[detail.name] || detail.default}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Book;
