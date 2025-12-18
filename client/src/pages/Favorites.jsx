import { useEffect, useState } from "react";
import { dummyShowsData } from "../assets/assets";
import BlurCircle from "../components/BlurCircle";
import MovieCard from "../components/MovieCard";

const Favourites = () => {
  const [favMovies, setFavMovies] = useState([]);

  useEffect(() => {
    const favouriteIds = JSON.parse(localStorage.getItem("favourites") || "[]");

    const favouriteSet = new Set(favouriteIds.map(String));

    const filteredMovies = dummyShowsData.filter((movie) =>
      favouriteSet.has(String(movie._id)),
    );

    setFavMovies(filteredMovies);
  }, []);

  console.log(favMovies);

  return favMovies.length > 0 ? (
    <div className="relative my-40 mb-60 min-h-[80vh] overflow-hidden px-6 md:px-16 lg:px-40 xl:px-44">
      <BlurCircle top="150px" left="0px" />
      <BlurCircle top="50px" right="50px" />

      <h1 className="my-4 text-lg font-medium">Your Favourite movies </h1>
      <div className="flex flex-wrap gap-8 max-sm:justify-center">
        {favMovies.map((movie) => (
          <MovieCard movie={movie} key={movie._id} />
        ))}
      </div>
    </div>
  ) : (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-center text-3xl font-bold">No Favourite movies</h1>
    </div>
  );
};

export default Favourites;
