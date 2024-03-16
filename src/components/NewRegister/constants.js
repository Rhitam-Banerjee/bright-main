import bookIconBlue from "../../icons/bookIconBlue.svg";
import cycleIconBlue from "../../icons/cycleIconBlue.svg";
import calenderIconBlue from "../../icons/calenderIconBlue.svg";
export const features = [
  {
    title: "Choose Any Book",
    icon: bookIconBlue,
  },
  {
    title: "Free Doorstep Delivery",
    icon: cycleIconBlue,
  },
  {
    title: "Change/Cancel Anytime",
    icon: calenderIconBlue,
  },
];
export const stepsComplete = [
  {
    title: "Select Plan",
    isOnStep: true,
    isComplete: false,
  },
  {
    title: "Payment",
    isOnStep: false,
    isComplete: false,
  },
  {
    title: "Add Details",
    isOnStep: false,
    isComplete: false,
  },
];

export const planDetails = [
  {
    planId: 1,
    books: 1,
    price: "2,399",
    popular: false,
    pricePerBook: "100",
    totalBooks: "Twenty Four",
    totalDeliveries: 24,
    duration: "6 months",
    razorpayId: "plan_Kfp8XM8HNym5or",
    planSelected: false,
  },
  {
    planId: 2,
    books: 2,
    price: "3,599",
    popular: true,
    pricePerBook: "75",
    totalBooks: "Fourty Eight",
    totalDeliveries: 24,
    duration: "6 months",
    razorpayId: "plan_KfpBDN0ZyGY29s",
    planSelected: true,
  },
  {
    planId: 3,
    books: 4,
    price: "4,799",
    popular: false,
    pricePerBook: "50",
    totalBooks: "Ninty Six",
    totalDeliveries: 24,
    duration: "6 months",
    razorpayId: "plan_KfpCxeWR1J5CkD",
    planSelected: false,
  },
];
