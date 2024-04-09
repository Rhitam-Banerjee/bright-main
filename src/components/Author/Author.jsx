import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";
import urls from "../../utils/urls";

import { PopularAuthors } from "../BrowseLibrary";
import { NewBook } from "../Book";

import authorImg from "../../icons/authorImg.svg";

const NewAuthor = () => {
  function kFormatter(num) {
    return Math.abs(num) > 999
      ? (Math.abs(num) / 1000).toFixed(1) + "k"
      : Math.abs(num);
  }
  const { author } = useParams();
  const [hasLoaded, setHasLoaded] = useState(false);
  const [authorBooks, setAuthorBooks] = useState([]);
  const [authorDetails, setAuthorDetails] = useState({});

  const getAuthorDetails = async () => {
    const response = await axios
      .get(`${urls.getAuthorDetails}?author_id=${author}`)
      .then((res) => res.data)
      .catch((err) => console.log(err));
    setAuthorDetails(response.author_details);
    setHasLoaded(true);
  };

  const getBooksByAuthor = async () => {
    try {
      const response = await axios
        .get(`${urls.getBooksFromAuthor}?author_id=${author}`)
        .then((res) => res.data)
        .catch((err) => console.log(err));
      response.books.sort((a, b) => {
        return b.stocks_available - a.stocks_available;
      });
      setAuthorBooks(response.books);
      setHasLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAuthorDetails();
    getBooksByAuthor();
  }, [author]);
  return hasLoaded ? (
    <>
      <section className="mt-[50px] px-8 py-2 md:px-4 xs:px-2 mb-10 w-full m-auto flex flex-col justify-center items-center">
        <div className="flex flex-row md:flex-col-reverse max-w-[800px] m-auto">
          <div>
            <h2 className="font-semibold text-[2rem] text-unHighlightDark md:text-center my-7">
              {authorDetails.name}
            </h2>
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
            {authorDetails.series?.length} Series
          </span>
          <span className="pr-4 border-r-[2px] border-mainColor">
            {authorDetails.books_count} Books
          </span>
          <span>{kFormatter(authorDetails.review_count)} Reviews</span>
        </div>
        <div className="grid grid-cols-5 md:grid-cols-3 xs:grid-cols-2 gap-4 xs:gap-3 mt-10">
          {authorBooks?.map((book, index) => {
            return (
              <div key={index} className="!w-[150px]">
                <NewBook book={book} />
              </div>
            );
          })}
        </div>
      </section>
      <PopularAuthors />
    </>
  ) : (
    <h1 className="text-[1.5rem] text-center text-secondary font-bold">
      Loading
    </h1>
  );
};

export default NewAuthor;
