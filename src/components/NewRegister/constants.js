import bookIconBlue from "../../icons/bookIconBlue.svg";
import deliveryIconBlue from "../../icons/deliveryIconBlue.svg";
import contactIconBlue from "../../icons/contactIconBlue.svg";
import FirststepRegister from "./FirststepRegister";
import AddDetails from "./AddDetails";

import turtleIcon from "../../icons/turtleIcon.svg";
import bearIcon from "../../icons/bearIcon.svg";
import tigerIcon from "../../icons/tigerIcon.svg";
import turtleIconWhite from "../../icons/turtleIconWhite.svg";
import bearIconWhite from "../../icons/bearIconWhite.svg";
import tigerIconWhite from "../../icons/tigerIconWhite.svg";

export const features = [
  {
    title: "Choose Any Book",
    icon: bookIconBlue,
  },
  {
    title: "Free Doorstep Delivery",
    icon: deliveryIconBlue,
  },
  {
    title: "24x7 Support",
    icon: contactIconBlue,
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
  [
    {
      planId: 1,
      books: 1,
      title: "Basic",
      price: "2,499",
      avgRead: "9,500",
      totalBooks: "25",
      totalDeliveries: 25,
      duration: "6 months",
      razorpayId: "plan_Kfp8XM8HNym5or",
      planSelected: false,
      popular: false,
      icon: turtleIcon,
      activeIcon: turtleIconWhite,
    },
    {
      planId: 2,
      books: 2,
      title: "Standard",
      price: "3,699",
      avgRead: "18,000",
      totalBooks: "50",
      totalDeliveries: 25,
      duration: "6 months",
      razorpayId: "plan_KfpBDN0ZyGY29s",
      planSelected: true,
      popular: true,
      icon: bearIcon,
      activeIcon: bearIconWhite,
    },
    {
      planId: 3,
      books: 4,
      title: "Premium",
      price: "4,899",
      avgRead: "30,000",
      totalBooks: "100",
      totalDeliveries: 25,
      duration: "6 months",
      razorpayId: "plan_KfpCxeWR1J5CkD",
      planSelected: false,
      popular: false,
      icon: tigerIcon,
      activeIcon: tigerIconWhite,
    },
  ],
  [
    {
      planId: 1,
      books: 1,
      title: "Basic",
      price: "4,499",
      avgRead: "18,000",
      totalBooks: "50",
      totalDeliveries: 50,
      duration: "12 months",
      razorpayId: "plan_Kfp8XM8HNym5or",
      planSelected: false,
      popular: false,
      icon: turtleIcon,
      activeIcon: turtleIconWhite,
    },
    {
      planId: 2,
      books: 2,
      title: "Standard",
      price: "6,699",
      avgRead: "35,000",
      totalBooks: "100",
      totalDeliveries: 50,
      duration: "12 months",
      razorpayId: "plan_KfpBDN0ZyGY29s",
      planSelected: true,
      popular: false,
      icon: bearIcon,
      activeIcon: bearIconWhite,
    },
    {
      planId: 3,
      books: 4,
      title: "Premium",
      price: "8,899",
      avgRead: "55,000",
      totalBooks: "200",
      totalDeliveries: 50,
      duration: "12 months",
      razorpayId: "plan_KfpCxeWR1J5CkD",
      planSelected: false,
      popular: true,
      icon: tigerIcon,
      activeIcon: tigerIconWhite,
    },
  ],
];
