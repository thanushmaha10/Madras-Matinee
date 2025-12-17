import { useState } from "react";
import { dummyTrailers } from "../assets/assets";
import BlurCircle from "./BlurCircle";
import ReactPlayer from "react-player";
import { PlayCircleIcon } from "lucide-react";

const TrailerSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0]);
  return (
    <div>
      <p className="mx-auto max-w-[960px] text-lg font-medium text-gray-300">
        Trailers
      </p>
      <div className="relative mt-6">
        <BlurCircle top="-100px" right="-100px" />
        <ReactPlayer
          src={currentTrailer.videoUrl}
          controls={false}
          className="mx-auto max-w-full"
          width="960px"
          height="540px"
        />
      </div>

      <div className="group mx-auto mt-8 grid max-w-3xl grid-cols-4 gap-4 md:gap-8">
        {dummyTrailers.map((trailer) => {
          return (
            <div
              key={trailer.image}
              className="relative cursor-pointer transition duration-300 group-hover:not-hover:opacity-50 hover:-translate-y-1 max-md:h-60 md:max-h-60"
              onClick={() => setCurrentTrailer(trailer)}
            >
              <img
                src={trailer.image}
                alt="trailer"
                className="h-full w-full rounded-lg object-cover brightness-75"
              />
              <PlayCircleIcon
                strokeWidth={1.6}
                className="absolute top-1/2 left-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 transform md:h-12 md:w-8"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrailerSection;
