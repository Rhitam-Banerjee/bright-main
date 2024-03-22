import bookIconBlue from "../../icons/bookIconBlue.svg";
import cycleIconBlue from "../../icons/cycleIconBlue.svg";
import calenderIconBlue from "../../icons/calenderIconBlue.svg";
import FirststepRegister from "./FirststepRegister";
import AddDetails from "./AddDetails";
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
    title: "Change / Cancel Anytime",
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
    component: "",
  },
  {
    title: "Add Details",
    isOnStep: false,
    isComplete: false,
    component: <AddDetails />,
  },
];

export const registerFlow = [
  {
    title: "First Step",
    component: <FirststepRegister />,
  },
  {
    title: "Add Details",
    component: <AddDetails />,
  },
];

export const planDetails = [
  {
    planId: 1,
    books: 1,
    price: "2,499",
    popular: false,
    pricePerBook: "100",
    totalBooks: "Twenty Five",
    totalDeliveries: 25,
    duration: "6 months",
    razorpayId: "plan_Kfp8XM8HNym5or",
    planSelected: false,
  },
  {
    planId: 2,
    books: 2,
    price: "3,699",
    popular: true,
    pricePerBook: "100",
    totalBooks: "Fifty",
    totalDeliveries: 25,
    duration: "6 months",
    razorpayId: "plan_KfpBDN0ZyGY29s",
    planSelected: true,
  },
  {
    planId: 3,
    books: 4,
    price: "4,899",
    popular: false,
    pricePerBook: "100",
    totalBooks: "One Hundred",
    totalDeliveries: 25,
    duration: "6 months",
    razorpayId: "plan_KfpCxeWR1J5CkD",
    planSelected: false,
  },
];
