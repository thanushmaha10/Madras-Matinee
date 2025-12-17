import { useState } from "react";
import { dummyTrailers } from "../assets/assets";
import BlurCircle from "./BlurCircle";
import ReactPlayer from "react-player";

const TrailerSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0]);
  console.log(currentTrailer.videoUrl);
  return (
    <div>
      <p className="mx-auto max-w-[960px] text-lg font-medium text-gray-300">
        Trailers
      </p>
      <div className="relative mt-6">
        {/* <BlurCircle top="-100px" right="-100px" /> */}
        <ReactPlayer
          url={currentTrailer.videoUrl}
          controls={false}
          className="mx-auto max-w-full"
          width="960px"
          height="540px"
        />
      </div>
    </div>
  );
};

export default TrailerSection;
