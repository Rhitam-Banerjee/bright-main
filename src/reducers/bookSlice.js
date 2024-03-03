import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bookSet: {},
  bookSetLimit: 5,
  age: localStorage.getItem("age"),
  searchedBookSet: [],
  searchQuery: "",
  loading: false,
  searchAges: [],
  bookInSeries: "",
  genersChosen: null,
  authors: [],
};

export const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    setBookInSeries: (state, { payload }) => {
      state.bookInSeries = payload;
    },
    setBooksAuthors: (state, { payload }) => {
      state.authors = payload;
    },
    setGenersChosen: (state, { payload }) => {
      state.genersChosen = payload;
    },
    setBookSet: (state, action) => {
      state.bookSet = action.payload.bookSet;
    },
    appendBookSet: (state, action) => {
      state.bookSet = { ...state.bookSet, ...action.payload.bookSet };
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload.searchQuery;
    },
    increaseBookSetLimit: (state) => {
      if (!state.loading) state.bookSetLimit = state.bookSetLimit + 5;
    },
    resetBookSet: (state) => {
      state.bookSetLimit = initialState.bookSetLimit;
    },
    setAge: (state, { payload }) => {
      state.bookSetLimit = initialState.bookSetLimit;
      state.age = payload;
    },
    load: (state) => {
      state.loading = true;
    },
    stopLoad: (state) => {
      state.loading = false;
    },
    setSearchedBookSet: (state, action) => {
      state.searchedBookSet = action.payload.searchedBookSet;
      const searchAgesSet = new Set();
      for (const bookSet of action.payload.searchedBookSet) {
        if (bookSet.max_age === 100) continue;
        for (let i = bookSet.min_age; i <= bookSet.max_age; ++i)
          searchAgesSet.add(i < 12 ? i : 12);
      }
      state.searchAges = Array.from(searchAgesSet).sort(
        (age1, age2) => age1 - age2
      );
      state.age =
        state.searchAges[Math.floor((state.searchAges.length - 1) / 2)];
    },
  },
});

export const {
  stopLoad,
  load,
  setAge,
  resetBookSet,
  increaseBookSetLimit,
  appendBookSet,
  setBookSet,
  setSearchQuery,
  setSearchedBookSet,
  setBooksAuthors,
  setAuthorChosen,
  setSeriesChosen,
  setBookInSeries,
  setGenersChosen,
} = bookSlice.actions;

export default bookSlice.reducer;
