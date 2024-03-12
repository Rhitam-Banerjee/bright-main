import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Suspense, lazy, useEffect } from "react";

import devUrls from "./utils/devUrls";
import axios from "axios";

import Header from "./components/Header/NewHeader";
import Landing from "./components/Landing";
import { Book } from "./components/Book";
import YourLibrary from "./components/YourLibrary";
import SearchBooks from "./components/OldBrowseLibrary/SearchBooks";
import Author from "./components/Author/Author";
import Footer from "./components/Footer";

import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/Login/ForgotPassword";

import Content from "./components/Content";
import HowItWorks from "./components/Content/HowItWorks";
import Pricing from "./components/Pricing";

import { login, resetAlert } from "./reducers/mainSlice";

import { IoIosCloseCircle } from "react-icons/io";
import "./index.css";
import Series from "./components/Series/Series";

const LazyBrowseLibraryRenew = lazy(() =>
  import("./components/BrowseLibrary/BrowseLibrary")
);

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const {
    book: { loading },
    main: { alert, isLoggedIn },
  } = useSelector((state) => state);

  const refresh = async () => {
    try {
      const response = await axios.get(devUrls.getUser, {
        withCredentials: true,
      });
      if (response.data.user) dispatch(login({ user: response.data.user }));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    if (alert) setTimeout(() => dispatch(resetAlert()), 5000);
  }, [dispatch, alert]);

  return (
    <div className="app">
      {alert.text && (
        <div
          className="alert flex flex-row items-center justify-around"
          style={{ backgroundColor: alert.color }}
        >
          <p>{alert.text}</p>
          <IoIosCloseCircle
            className="text-white ml-auto"
            onClick={() => dispatch(resetAlert())}
          />
        </div>
      )}
      {loading && <span className="loader"></span>}
      <Header />
      <Routes>
        <Route
          path="/browse-library"
          element={
            <Suspense fallback={<h1>Loading...</h1>}>
              <LazyBrowseLibraryRenew />
            </Suspense>
          }
        />
        <Route path="/book/:isbn" element={<Book />} />
        <Route path="/author/:author" element={<Author />} />
        <Route path="/series/:series" element={<Series />} />
        <Route path="/search-books" element={<SearchBooks />} />
        <Route
          path="/your-library"
          element={isLoggedIn ? <YourLibrary /> : <Navigate to="/" />}
        />
        <Route
          path="/forgot-password"
          element={isLoggedIn ? <Navigate to="/" /> : <ForgotPassword />}
        />
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/register"
          element={isLoggedIn ? <Navigate to="/" /> : <Register />}
        />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about-us" element={<Content type="About Us" />} />
        <Route path="/contact-us" element={<Content type="Contact Us" />} />
        <Route path="/disclaimer" element={<Content type="Disclaimer" />} />
        <Route
          path="/privacy-policy"
          element={<Content type="Privacy Policy" />}
        />
        <Route
          path="/refund-policy"
          element={<Content type="Refund Policy" />}
        />
        <Route
          path="/terms-and-conditions"
          element={<Content type="Terms and Conditions" />}
        />
        <Route path="/" element={<Landing />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
