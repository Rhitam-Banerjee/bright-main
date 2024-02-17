import "./styles.scss";
import { Link } from "react-router-dom";
import { sections, faq, youtubePlaylist } from "./constants";
import { Fragment, useState } from "react";
import Hero from "../Content/Hero";
// import { IoMdAdd, IoMdRemove } from "react-icons/io";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const Landing = () => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
  const [statements, setStatements] = useState(faq);

  return (
    <div>
      <main className='landing' id='home'>
        <Hero />
        <div className='sections'>
          {sections.map((section) => {
            return (
              <div key={section.id} className='section'>
                <div className='section-wrapper'>
                  <div className='section-info'>
                    <div className='section-info-heading'>
                      <h2>{section.title}</h2>
                      <h2 style={{ color: section.color }}>
                        {section.subTitle}
                      </h2>
                    </div>
                    <p>{section.text}</p>
                    {section.link && (
                      <Link to={section.link}>{section.linkText}</Link>
                    )}
                    {section.outerLink && (
                      <a href={section.outerLink} target='_blank'>
                        {section.icon || <Fragment />}
                        {section.linkText}
                      </a>
                    )}
                  </div>
                  <div className='section-image'>
                    <img src={section.image} alt='Section' />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      {/* <div className='FAQ'>
        <h1>Frequently Asked Questions</h1>
        {statements.map((val, _) => {
          return (
            <div className='questionContainer'>
              <div
                onClick={() =>
                  setStatements((prev) => {
                    return prev.map((val, idx) => {
                      return idx === _
                        ? { ...val, display: !val.display }
                        : { ...val };
                    });
                  })
                }
                className='questionBlock'
              >
                <p>{val.q}</p>

                {val.display ? <IoMdRemove size={70} /> : <IoMdAdd size={70} />}
              </div>
              <div
                style={{
                  paddingBottom: val.display ? "1.5em" : 0,
                  paddingTop: val.display ? "1.5em" : 0,
                  maxHeight: val.display ? "1500px" : 0,
                  overflow: "hidden",
                  transition: "all .5s ease-in-out",
                }}
                className='answerBlock'
              >
                {val.a} {val.html}
              </div>
            </div>
          );
        })}
      </div> */}
      <div className='customerJourney'>
        Customer Journey
        <Carousel
          responsive={responsive}
          infinite={true}
          autoPlaySpeed={1000}
          keyBoardControl={true}
          customTransition='all 1s'
          transitionDuration={2000}
          containerClass='carousel-container'
          removeArrowOnDeviceType={["tablet", "mobile"]}
          dotListClass='custom-dot-list-style'
          itemClass='carousel-item-padding-40-px'
        >
          {youtubePlaylist.map((value) => (
            <div>
              <iframe
                title='Customer Feedback'
                loading='lazy'
                width='350'
                height='200'
                srcDoc={`<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style><a href=https://www.youtube.com/embed/${value}/?autoplay=1><img src=https://img.youtube.com/vi/${value}/hqdefault.jpg alt='Something Went Wrong'><span>▶</span></a>`}
              ></iframe>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default Landing;
