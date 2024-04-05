import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import devUrls from "../../utils/devUrls";

import { suggestedCategories, bookArchives } from "./constants";

import {
  setBucket,
  setWishlist,
  setSuggestedBooks,
  setDumpedBooks,
  setPreviousBooks,
  setCurrentBooks,
  setOrderBucket,
  setCompleteAuthors,
  setCompleteSeries,
} from "../../reducers/wishlistSlice";
import { setUser, setAlert } from "../../reducers/mainSlice";
import {
  getAgeGroupColor,
  getDay,
  getDate,
  getFormattedDate,
} from "../../utils";

import { FaEdit, FaCalendar } from "react-icons/fa";
import { PiFlagPennantFill } from "react-icons/pi";

import BrowseLibraryLinks from "../Content/BrowseLibraryLinks";

import BookSlider from "../BookSlider";
import "./styles.scss";

const YourLibrary = () => {
  const state = useSelector((state) => state);
  const {
    main: { user },
    wishlist: {
      orderBucket,
      bucket,
      wishlist,
      suggestedBooks,
      completeAuthors,
      completeSeries,
      booksRead,
    },
  } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [changingBucket, setChangingBucket] = useState(false);

  const getOrderBucket = async () => {
    try {
      const response = await axios.get(devUrls.getOrderBucket, {
        withCredentials: true,
        params: { guid: user.guid },
      });
      dispatch(setOrderBucket({ orderBucket: response.data.wishlists }));
    } catch (err) {
      console.log(err);
    }
  };

  const getBucket = async () => {
    try {
      const response = await axios.get(devUrls.getBucket, {
        withCredentials: true,
        params: { guid: user.guid },
      });
      dispatch(setBucket({ bucket: response.data.wishlists }));
    } catch (err) {
      console.log(err);
    }
  };

  const getWishlist = async () => {
    try {
      const response = await axios.get(devUrls.getWishlist, {
        withCredentials: true,
        params: { guid: user.guid },
      });
      dispatch(setWishlist({ wishlist: response.data.wishlists }));
    } catch (err) {
      console.log(err);
    }
  };

  const getCurrentBooks = async () => {
    try {
      const response = await axios.get(devUrls.getCurrentBooks, {
        withCredentials: true,
        params: { guid: user.guid },
      });
      dispatch(setCurrentBooks({ currentBooks: response.data.books }));
    } catch (err) {
      console.log(err);
    }
  };

  const getPreviousBooks = async () => {
    try {
      const response = await axios.get(devUrls.getPreviousBooks, {
        withCredentials: true,
        params: { guid: user.guid },
      });
      dispatch(setPreviousBooks({ previousBooks: response.data.books }));
    } catch (err) {
      console.log(err);
    }
  };

  const getDumpedBooks = async () => {
    try {
      const response = await axios.get(devUrls.getDumpedBooks, {
        withCredentials: true,
        params: { guid: user.guid },
      });
      dispatch(setDumpedBooks({ dumpedBooks: response.data.dumps }));
    } catch (err) {
      console.log(err);
    }
  };

  const getSuggestions = async () => {
    if (user.children?.length) {
      const newSuggestedBooks = [];
      for (const child of user.children) {
        try {
          const response = await axios.get(devUrls.getSuggestedBooks, {
            withCredentials: true,
            params: { guid: child.guid },
          });
          newSuggestedBooks.push(response.data.suggestions);
        } catch (err) {
          console.log(err);
        }
      }
      dispatch(setSuggestedBooks({ suggestedBooks: newSuggestedBooks }));
    }
  };

  const createBucket = async () => {
    try {
      await axios.get(devUrls.createBucket, {
        withCredentials: true,
      });
      getBucket();
    } catch (err) {
      if (err.response?.data.message)
        dispatch(
          setAlert({ text: err.response.data.message, color: "#F75549" })
        );
    }
  };

  const placeOrder = async () => {
    try {
      await axios.get(devUrls.placeOrder, {
        withCredentials: true,
      });
      getOrderBucket();
      getBucket();
      getCurrentBooks();
      getPreviousBooks();
      dispatch(setAlert({ text: "Order placed", color: "#33A200" }));
    } catch (err) {
      if (err.response?.data.message)
        dispatch(
          setAlert({ text: err.response.data.message, color: "#F75549" })
        );
    }
  };

  const removeBucket = async (book) => {
    try {
      await axios.post(
        devUrls.removeFromBucket,
        { isbn: book.isbn },
        { withCredentials: true }
      );
      getBucket();
    } catch (err) {
      if (err.response?.data.message)
        dispatch(
          setAlert({ text: err.response.data.message, color: "#F75549" })
        );
      console.log(err);
    }
    setChangingBucket(false);
  };

  const updateDeliveryDate = async (event) => {
    try {
      const response = await axios.post(
        devUrls.changeDeliveryDate,
        {
          delivery_date: getFormattedDate(event.target.value),
        },
        { withCredentials: true }
      );
      dispatch(setAlert({ text: "Delivery date updated", color: "#33A200" }));
      dispatch(setUser({ user: response.data.user }));
    } catch (err) {
      console.log(err);
      dispatch(setAlert({ text: err.response.data.message, color: "#F75549" }));
    }
  };

  const getUserCompleteBooks = async () => {
    try {
      const response = await axios
        .get(`${devUrls.getUserCompleteBooks}?guid=${user.guid}`)
        .then((res) => res.data)
        .catch((err) => console.log(err));
      console.log(response.result);
      if (response.result) {
        response.result.author.sort((a, b) => {
          return b.books_read - a.books_read;
        });
        dispatch(setCompleteAuthors(response.result.author));
        response.result.category.sort((a, b) => {
          return b.books_read - a.books_read;
        });
        dispatch(setCompleteSeries(response.result.category));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getWishlist();
  }, [orderBucket, bucket]);

  useEffect(() => {
    getOrderBucket();
    getBucket();
    getSuggestions();
    getPreviousBooks();
    getDumpedBooks();
    getCurrentBooks();
    getUserCompleteBooks();
  }, []);

  return (
    <div className="your-library">
      <h3>Your Library</h3>
      <div className="bucket">
        <h3>Next Delivery Bucket</h3>
        {orderBucket.length ? (
          <div className="bucket-details">
            <div className="bucket-list">
              {orderBucket.map((book, i) => {
                return (
                  <div className="bucket-book" key={i}>
                    <img src={book.image} alt="Book" />
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="blue-button create-bucket">No Bucket Created</p>
        )}
        <button className="blue-button date-button">
          <span>
            Delivery Date
            {user.next_delivery_date &&
              ` - ${getDate(user.next_delivery_date)}`}
          </span>
          <FaEdit />
          <input type="date" onChange={updateDeliveryDate} />
        </button>
        {user.next_delivery_date && (
          <div className="time-date">
            <div className="time-date-column">
              <img src="/icons/time.png" alt="Time" />
              <p>Time - {user.delivery_time}</p>
            </div>
            <div className="time-date-column">
              <FaCalendar />
              <p>Day - {getDay(user.next_delivery_date)}</p>
            </div>
          </div>
        )}
      </div>
      <div className="wishlist">
        <h3>Wishlist</h3>
        {wishlist.length > 0 ? (
          <BookSlider books={wishlist} showTags={false} overlay="wishlist" />
        ) : (
          <div className="empty-wishlist">
            <h2>
              <span>Like Books</span> to add
              <br />
              them in your wishlist
            </h2>
            <img src="/icons/wishlist.png" alt="Wishlist" />
          </div>
        )}
      </div>
      {/* {user.children?.map((child, i) => {
        return (
          <div className="suggestions" key={i}>
            <BookSlider
              books={suggestedBooks.length ? suggestedBooks[i] : []}
              color={getAgeGroupColor(child.dob)}
              categories={suggestedCategories}
              title={`Suggested for ${child.name}`}
              overlay="suggested"
            />
          </div>
        );
      })} */}
      {completeSeries?.length > 0()}
      {/* {completeAuthors?.length>0 && <div>

        </div>} */}
      <BrowseLibraryLinks />
    </div>
  );
};

export default YourLibrary;
