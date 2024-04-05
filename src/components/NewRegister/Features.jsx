import React from "react";

import { features } from "./constants";

const Features = () => {
  return (
    <>
      <section className="flex flex-col justify-center items-center max-w-[230px] text-center">
        <p className="text-[15px] font-bold text-mainColor">
          Become a Brightr Club member
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
