import { StarIcon, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favourites")) || [];
    setIsFav(favs.includes(movie._id));
  }, [movie._id]);

  const toggleFavourite = (e) => {
    e.stopPropagation();

    const favs = JSON.parse(localStorage.getItem("favourites")) || [];

    let updatedFavs;
    if (favs.includes(movie._id)) {
      updatedFavs = favs.filter((id) => id !== movie._id);
    } else {
      updatedFavs = [...favs, movie._id];
    }

    localStorage.setItem("favourites", JSON.stringify(updatedFavs));
    setIsFav(!isFav);
  };

  return (
    <div className="flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-66">
      <div className="relative">
        <img
          onClick={() => {
            navigate(`/movies/${movie._id}`);
            scrollTo(0, 0);
          }}
          src={movie.backdrop_path}
          alt={`${movie.title} Poster`}
          className="rounded-lg h-52 w-full object-cover object-right-bottom cursor-pointer"
        />

        <button
          onClick={toggleFavourite}
          className="absolute top-2 right-2 p-2 rounded-full bg-black/60 backdrop-blur hover:bg-black/80 transition"
        >
          <Heart
            className={`w-4 h-4 ${
              isFav ? "text-red-500 fill-red-500" : "text-white"
            }`}
          />
        </button>
      </div>

      <p className="font-semibold mt-2 truncate">{movie.title}</p>

      <p className="text-sm text-gray-400 mt-2">
        {new Date(movie.release_date).getFullYear()} •{" "}
        {movie.genres
          .slice(0, 2)
          .map((genre) => genre.name)
          .join(" | ")}{" "}
        • {movie.runtime} mins
      </p>

      <div className="flex items-center justify-between mt-4 pb-3">
        <button
          onClick={() => {
            navigate(`/movies/${movie._id}`);
            scrollTo(0, 0);
          }}
          className="px-4 py-2 text-xs bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
        >
          Buy Tickets
        </button>

        <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
          <StarIcon className="w-4 h-4 text-primary fill-primary" />
          {movie.vote_average.toFixed(1)}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;