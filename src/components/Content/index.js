import aboutUs from "./AboutUs";
import contactUs from "./ContactUs";

const contentPages = {
  "About Us": { content: aboutUs },
  "Contact Us": { content: contactUs },
};

const Content = ({ type }) => {
  return (
    <div className={`mt-[70px]`}>
      <div className="">{contentPages[type].content}</div>
    </div>
  );
};

export default Content;
