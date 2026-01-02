import MovieCard from "../components/MovieCard";
import BlurCircle from "../components/BlurCircle";
import Loader from "../components/Loader";
import { useAppContext } from "../context/AppContext";
import { useClerk, useUser } from "@clerk/clerk-react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Favorite = () => {
  const { favouriteMovies, favouritesLoading } = useAppContext();
  const { openSignIn } = useClerk();
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  if (!isLoaded) {
    return <Loader />;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-6">
        <h1 className="text-xl font-semibold text-center">
          Please sign in to view favourite movies
        </h1>
        <button
          onClick={openSignIn}
          className="bg-primary hover:bg-primary-dull px-6 py-2 rounded-full font-medium transition"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (favouritesLoading) {
    return <Loader />;
  }

  if (favouriteMovies.length > 0) {
    return (
      <div className="relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]">
        <BlurCircle top="150px" left="0px" />
        <BlurCircle bottom="50px" right="50px" />

        <h1 className="text-lg font-medium my-4">Your Favorite Movies</h1>

        <div className="flex flex-wrap max-sm:justify-center gap-8">
          {favouriteMovies.map((movie) => (
            <MovieCard
              movie={movie}
              key={movie._id || movie.id}
              forceFavourite
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6">
  <h1 className="text-3xl font-bold text-center">
    No favourite movies available
  </h1>

  <button
    onClick={() => navigate("/movies")}
    className="flex items-center gap-1 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
  >
    Explore Movies
    <ArrowRight className="h-5 w-5" />
  </button>
</div>
  );
};

export default Favorite;
