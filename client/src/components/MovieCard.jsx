import { StarIcon, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import timeFormat from "../lib/timeformat";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const {
    imageBaseUrl,
    user,
    favouriteMovies,
    axios,
    getToken,
    fetchFavouriteMovies,
  } = useAppContext();

  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    setIsFav(
      favouriteMovies.some(
        (m) => String(m._id || m.id) === String(movie._id || movie.id)
      )
    );
  }, [favouriteMovies, movie]);

  const handleToggleFavourite = async (e) => {
    e.stopPropagation();

    if (!user) {
      toast.error("Please sign in to add favourites");
      return;
    }

    setIsFav((prev) => !prev);

    try {
      const { data } = await axios.post(
        "/api/user/update-favourite",
        { movieId: movie._id || movie.id },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (!data.success) {
        setIsFav((prev) => !prev);
        toast.error("Failed to update favourite");
        return;
      }

      fetchFavouriteMovies();
    } catch (err) {
      setIsFav((prev) => !prev);
      toast.error("Something went wrong" + err.message);
    }
  };

  return (
    <div className="flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-66">
      <div className="relative">
        <img
          onClick={() => {
            navigate(`/movies/${movie._id || movie.id}`);
            scrollTo(0, 0);
          }}
          src={imageBaseUrl + movie.backdrop_path}
          alt={movie.title}
          className="rounded-lg h-52 w-full object-cover cursor-pointer"
        />

        <button
          onClick={handleToggleFavourite}
          className="absolute top-2 right-2 p-2 rounded-full bg-black/60 backdrop-blur hover:bg-black/80 transition"
        >
          <Heart
            className={`w-4 h-4 ${
              isFav ? "fill-primary text-primary" : "text-white"
            }`}
          />
        </button>
      </div>

      <p className="font-semibold mt-2 truncate">{movie.title}</p>

      <p className="text-sm text-gray-400 mt-2">
        {new Date(movie.release_date).getFullYear()} •
        {movie.genres
          .slice(0, 2)
          .map((g) => g.name)
          .join(" | ")}{" "}
        • {timeFormat(movie.runtime)}
      </p>

      <div className="flex items-center justify-between mt-4 pb-3">
        <button
          onClick={() => {
            navigate(`/movies/${movie._id || movie.id}`);
            scrollTo(0, 0);
          }}
          className="px-4 py-2 text-xs bg-primary hover:bg-primary-dull transition rounded-full font-medium"
        >
          Buy Tickets
        </button>

        <p className="flex items-center gap-1 text-sm text-gray-400">
          <StarIcon className="w-4 h-4 text-primary fill-primary" />
          {movie.vote_average.toFixed(1)}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
