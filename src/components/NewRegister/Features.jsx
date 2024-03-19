import React from "react";

import badgeIcon from "../../icons/badgeIconOrange.svg";

import { features } from "./constants";

const Features = () => {
  return (
    <>
      <section className="flex flex-col justify-center items-center max-w-[230px] text-center">
        <div className="mb-[20px]">
          <img className="w-[27px] h-[27px]" src={badgeIcon} alt="BadgeIcon" />
        </div>
        <p className="text-[15px] font-bold text-mainColor">
          Become a Brightr Club member
        </p>
        <p className="text-[13px] font-semibold">
          Illuminate your reading journey
        </p>
      </section>
      <section className="mt-[20px] flex flex-row justify-between w-full max-w-[320px] mx-auto gap-[25px]">
        {features.map((feature, index) => {
          return (
            <div
              key={index}
              className="flex flex-col justify-center items-center gap-[15px]"
            >
              <span>
                <img
                  className="w-[20px] h-[20px]"
                  src={feature.icon}
                  alt="FeatureIcon"
                />
              </span>
              <span className="text-[13px] text-mainColor font-semibold text-center">
                {feature.title}
              </span>
            </div>
          );
        })}
      </section>
    </>
  );
};

export default Features;
