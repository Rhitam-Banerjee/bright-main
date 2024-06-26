const host = process.env.REACT_APP_API;
// const host = "http://127.0.0.1:5000";

const domain = `${host}/api_v2`;

const newDomain = `${host}/api_v3_dev`;

const urls = {
  getUser: domain + "/get-user",
  addToWishlist: domain + "/add-to-wishlist",
  removeFromWishlist: domain + "/wishlist-remove",
  dumpBook: domain + "/suggestion-to-dump",
  wishlistPrevious: domain + "/wishlist-prev",
  wishlistNext: domain + "/wishlist-next",
  dumpRead: domain + "/dump-action-read",
  dumpDislike: domain + "/dump-action-dislike",
  retainBook: domain + "/retain-current-book",
  login: domain + "/login",
  logout: domain + "/logout",
  submitMobileNumber: domain + "/submit-mobile",
  getTypes: domain + "/get-types",
  getAuthors: domain + "/get-authors",
  getGenres: domain + "/get-genres",
  getSeries: domain + "/get-series",
  submitPreferences: domain + "/submit-preferences",
  addAddress: domain + "/add-address",
  addChildren: domain + "/add-children",
  confirmMobileNumber: domain + "/confirm-mobile",
  resendOtp: domain + "/resend-otp",
  signup: domain + "/signup",
  choosePlan: domain + "/choose-plan",
  chooseSubscription: domain + "/choose-plan-duration",
  changePlan: domain + "/change-plan",
  generateSubscriptionId: domain + "/generate-subscription-id",
  generateOrderId: domain + "/generate-order-id",
  verifySubscription: domain + "/verify-subscription",
  subscriptionSuccessful: domain + "/subscription-successful",
  verifyOrder: domain + "/verify-order",
  orderSuccessful: domain + "/payment-successful",
  createBucket: domain + "/create-bucket-list",
  placeOrder: domain + "/confirm-order",
  removeFromBucket: domain + "/bucket-remove",
  getBucket: domain + "/get-buckets",
  getWishlist: domain + "/get-wishlists",
  getCurrentBooks: domain + "/get-current-books",
  getPreviousBooks: domain + "/get-previous-books",
  getDumpedBooks: domain + "/get-dumps",
  getSuggestedBooks: domain + "/get-suggestions",
  changeDeliveryDate: domain + "/change-delivery-date",
  changePassword: domain + "/change-password",
  forgotPassword: domain + "/forgot-password",
  getOrderBucket: domain + "/get-order-bucket",

  getUserCompleteBooks: `${newDomain}/get-user-complete-books`,
};

export default urls;
