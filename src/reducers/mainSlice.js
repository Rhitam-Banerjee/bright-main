import { createSlice } from "@reduxjs/toolkit";
// import { plans } from "../components/Register/PlanDetails/constants";
import { planDetails } from "../components/NewRegister/constants";

const initialState = {
  isLoggedIn: false,
  alert: { text: "", color: "" },
  user: {},
  plan: planDetails[1],
  // plan: plans[2],
  registrationStep: 0,
  childPreferences: [],
  ageDropDown: false,
  searchText: "",
  registerDetails: {
    otpSent: false,
    name: "",
    mobileNumber: "",
    contactNumber: "",
    otp: "",
    selectedPlan: planDetails[1],
    // selectedPlan: plans[1],
    selectedSubscription: 6,
    address: "",
    pinCode: "",
    childName: "",
    childDateOfBirth: "",
    children: [],
    verificationDone: false,
    paymentDone: false,
    registrationDone: false,
    paymentStatus: "",
  },
};

export const mainSlice = createSlice({
  name: "main",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
    },
    setAlert: (state, action) => {
      state.alert = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
    },
    resetAlert: (state) => {
      state.alert = initialState.alert;
    },
    setAgeDropDown: (state) => {
      state.ageDropDown = !state.ageDropDown;
    },
    setSearchText: (state, { payload }) => {
      state.searchText = payload;
    },
    searchReset: (state) => {
      state.searchText = initialState.searchText;
    },
    nextStepRegister: (state) => {
      state.registrationStep = state.registrationStep + 1;
      state.registerDetails.paymentDone = false;
    },
    previousStepRegister: (state, action) => {
      if (state.registrationStep)
        state.registrationStep = state.registrationStep - 1;
    },
    goToStepRegister: (state, action) => {
      state.registrationStep = action.payload.i;
    },
    setRegisterDetails: (state, action) => {
      state.registerDetails = { ...state.registerDetails, ...action.payload };
    },
    addChildToRegisterDetails: (state) => {
      state.registerDetails.children = [
        ...state.registerDetails.children,
        {
          name: state.registerDetails.childName,
          dateOfBirth: state.registerDetails.childDateOfBirth,
        },
      ];
      state.registerDetails.childName = "";
      state.registerDetails.childDateOfBirth = "";
    },
    initializePreferences: (state, action) => {
      state.childPreferences = action.payload.children.map((child) => {
        if (child.preferences)
          return {
            guid: child.guid,
            lastBooks: [
              child.preferences.last_book_read1,
              child.preferences.last_book_read2,
              child.preferences.last_book_read3,
            ],
            numberOfBooksRead: child.preferences.books_read_per_week,
            readingLevel: child.preferences.reading_level,
            types: child.preferences.formats,
            authors: child.preferences.authors,
            series: child.preferences.series,
            categories: child.preferences.categories,
          };
        return {
          guid: child.guid,
          lastBooks: Array(3).fill(""),
          numberOfBooksRead: -1,
          readingLevel: -1,
          types: [],
          authors: [],
          series: [],
          categories: [],
        };
      });
    },
    updatePreferences: (state, action) => {
      state.childPreferences[action.payload.i] = action.payload.preference;
    },
    flushRegisterDetails: (state) => {
      state.registerDetails = initialState.registerDetails;
      state.registrationStep = 0;
    },
  },
});

export const {
  login,
  setAlert,
  setUser,
  resetAlert,
  setAgeDropDown,
  setSearchText,
  searchReset,
  nextStepRegister,
  previousStepRegister,
  goToStepRegister,
  setRegisterDetails,
  addChildToRegisterDetails,
  flushRegisterDetails,
  updatePreferences,
  initializePreferences,
} = mainSlice.actions;

export default mainSlice.reducer;
