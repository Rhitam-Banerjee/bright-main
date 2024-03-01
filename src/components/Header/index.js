import { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { searchBarPages } from "./constants";
import {
  load,
  stopLoad,
  setSearchedBookSet,
  setSearchQuery,
} from "../../reducers/bookSlice";
import urls from "../../utils/urls";
import axios from "axios";
import { setAlert } from "../../reducers/mainSlice";
import devUrls from "../../utils/devUrls";
import { AiOutlineSearch } from "react-icons/ai";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    main: { isLoggedIn },
    book: { age, searchQuery },
  } = useSelector((state) => state);
  const [showDropDown, setShowDropDown] = useState(false);
  const location = useLocation();

  const search = async () => {
    navigate("/search-books");
    if (searchQuery.trim().length < 3) {
      dispatch(setSearchedBookSet({ searchedBooks: [] }));
      return dispatch(
        setAlert({ text: "Enter atleast 3 characters", color: "#F75549" })
      );
    }
    dispatch(load());
    const response = await axios.get(urls.searchBooks, {
      params: { search_query: searchQuery.trim() },
    });
    dispatch(setSearchedBookSet({ searchedBookSet: response.data.book_set }));
    dispatch(stopLoad());
  };

  const logOut = async () => {
    try {
      await axios.post(devUrls.logout, {}, { withCredentials: true });
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setShowDropDown(false);
  }, [age, location]);

  return (
    <header>
      {searchBarPages.includes(location.pathname) && (
        <div className="search-bar mobile-search-bar">
          <input
            type="text"
            placeholder="Search by author, title, age, genre..."
            value={searchQuery}
            onChange={({ target: { value } }) =>
              dispatch(setSearchQuery({ searchQuery: value }))
            }
          />
          <button onClick={search}>
            <AiOutlineSearch />
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
