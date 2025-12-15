import { ArrowRight } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen overflow-hidden">
      <div className='absolute inset-0 bg-[url("/backgroundImage.png")] bg-cover bg-center scale-105 blur-sm'></div>

      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative z-10 flex flex-col items-start justify-center gap-8 h-full px-6 md:px-16 lg:px-36 pt-28 md:pt-36 text-white">
        <h1 className="text-5xl md:text-[70px] md:leading-[1.1] font-semibold max-w-xl">
          Madras <br /> Matinee
        </h1>

        <p className="text-lg md:text-2xl text-gray-300 max-w-xl mb-2">
          Experience Cinema Like Never Before
        </p>
        <button
          onClick={() => navigate("/movies")}
          className="flex items-center gap-1 mt-6 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
        >
          Explore Movies <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
