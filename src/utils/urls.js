// const domain = process.env.REACT_APP_API + "/api";

// const newDomain = process.env.REACT_APP_API + "/api_v2_books";

// const newDomainUpdated = process.env.REACT_APP_API + "/api_v2_books";
const host = process.env.REACT_APP_API;
// const host = "http://127.0.0.1:5000";

const domain = `${host}/api`;

const newDomain = `${host}/api_v2_books`;

const newDomainUpdated = `${host}/api_v3`;

const urls = {
  getMostBorrowedBooks: domain + "/get-most-borrowed",
  getAmazonBestsellersBooks: domain + "/get-bestsellers",
  getAuthorBooks: domain + "/get-author-books",
  getSeriesBooks: domain + "/get-series-books",
  getPublisherBooks: domain + "/get-publisher-books",
  getTypeBooks: domain + "/get-type-books",
  getAuthors: domain + "/get-authors",
  getSeries: domain + "/get-series",
  getPublishers: domain + "/get-publishers",
  getTypes: domain + "/get-types",
  getBook: domain + "/get-book-details",
  search: domain + "/search",
  getSimilarBooks: domain + "/get-similar-books",
  submitMobile: domain + "/submit-mobile",
  signup: domain + "/signup",
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
  getGenres: domain + "/get-genres",
  submitPreferences: domain + "/submit-preferences",
  addAddress: domain + "/add-address",
  addChildren: domain + "/add-children",
  confirmMobileNumber: domain + "/confirm-mobile",
  resendOtp: domain + "/resend-otp",
  choosePlan: domain + "/choose-plan",
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

  getBookSet: newDomain + "/get-book-set",
  getCategoryBooks: newDomain + "/get-category-books",
  getMustReadSet: newDomain + "/get-must-read-set",
  getBooks: newDomain + "/get-new-books",
  searchBooks: newDomain + "/search-new-books",
  getMostPopularSet: newDomain + "/get-most-popular-set",

  // getBooksByAuthor: `${newDomainUpdated}/get-books-author`,
  getPopularAuthor: `${newDomainUpdated}/get-books-author-popular`,
  getBooksByAuthorAll: `${newDomainUpdated}/get-all-books-author`,
  getAuthorNameBook: `${newDomainUpdated}/get-author-from-book`,

  getBooksSeries: `${newDomainUpdated}/get-book-set`,
  getBooksSeriesMore: `${newDomainUpdated}/get-book-set-all`,
  getSeriesNameBook: `${newDomainUpdated}/get-set-from-book`,

  getBooksGenre: `${newDomainUpdated}/get-genre-book`,
  getBooksGenreMore: `${newDomainUpdated}/get-genre-book-all`,

  getPopularBooks: `${newDomainUpdated}/get-global-best-seller`,
  getBookYTVideos: `${newDomainUpdated}/get-videos-from-book`,
  getBookSetYtVideos: `${newDomainUpdated}/get-book-set-video`,
};

export default urls;
