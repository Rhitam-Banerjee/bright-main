import React, { useEffect, useState } from "react";
import { aboutAuthor } from "./constants";
import authorImg from "../../icons/author.png";
import axios from "axios";
import urls from "../../utils/urls";
import { useParams } from "react-router-dom";
import { AuthorSection, NewBook } from "../BrowseLibraryRenew";
const NewAuthor = () => {
  const { desc } = aboutAuthor;
  function kFormatter(num) {
    return Math.abs(num) > 999
      ? (Math.abs(num) / 1000).toFixed(1) + "k"
      : Math.abs(num);
  }
  const { author } = useParams();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [authorHasDetails, setAuthorHasDetials] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [authorBooks, setAuthorBooks] = useState([]);
  const [authorSeries, setAuthorSeries] = useState([]);
  const [authorReview, setAuthorReview] = useState(null);

  const getBooksByAuthorAll = async () => {
    const response = await axios
      .get(`${urls.getBooksByAuthorAll}?author=${author}`)
      .then((res) => res.data)
      .catch((err) => console.log(err));
    setHasLoaded(true);
    if (response.message) {
      response.author_details.books.sort((a, b) => {
        return b.stock_available - a.stock_available;
      });
      setAuthorBooks(response.author_details.books);
      setAuthorSeries(response.author_details.series);
      let totalReview = 0;
      response.author_details.books.forEach((book) => {
        totalReview += parseInt(book.review_count);
      });
      setAuthorReview(kFormatter(totalReview));
    } else {
      setErrorMessage(response.msg);
    }
  };

  useEffect(() => {
    getBooksByAuthorAll();
  }, [author]);
  if (errorMessage) {
    return (
      <h1 className="text-[1.5rem] text-center text-secondary font-bold">
        {errorMessage}
      </h1>
    );
  }
  return hasLoaded ? (
    <>
      <section className="px-8 py-2 md:px-4 xs:px-2 mb-10 w-full m-auto flex flex-col justify-center items-center">
        <div className="flex flex-row md:flex-col-reverse max-w-[800px] m-auto">
          <div>
            <h2 className="font-semibold text-[2rem] text-unHighlightDark md:text-center my-7">
              {author}
            </h2>
            <p className="font-light text-[0.8rem] text-unHighlightDark">
              {desc}
            </p>
          </div>
          <div className="saturate-0 grid place-items-center">
            <img
              className="!max-w-[300px]"
              src={authorImg}
              alt="author_Image"
            />
          </div>
        </div>
        <div className="mt-10 w-full flex-1 flex flex-row items-center justify-center gap-4 text-unHighlightDark">
          <span className="pr-4 border-r-[2px] border-mainColor">
            {authorSeries?.length} Series
          </span>
          <span className="pr-4 border-r-[2px] border-mainColor">
            {authorBooks?.length} Books
          </span>
          <span>{authorReview} Reviews</span>
        </div>
        <div className="grid grid-cols-3 xs:grid-cols-2 gap-4 xs:gap-3 mt-10">
          {authorBooks?.map((book, index) => {
            return (
              <div key={index} className="!w-[150px]">
                <NewBook book={book} />
              </div>
            );
          })}
        </div>
      </section>
      <AuthorSection />
    </>
  ) : (
    <h1 className="text-[1.5rem] text-center text-secondary font-bold">
      Loading
    </h1>
  );
};

export default NewAuthor;
