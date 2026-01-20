import BlurCircle from "../components/BlurCircle";
import MovieCard from "../components/MovieCard";
import MovieCardSkeleton from "../components/MovieCardSkeleton";
import { useAppContext } from "../context/AppContext";

const Movies = () => {

  const {shows, showsLoading} = useAppContext();


  return (
    <div className="relative my-40 mb-60 min-h-[80vh] overflow-hidden px-6 md:px-16 lg:px-40 xl:px-44">
      <BlurCircle top="150px" left="0px" />
      <BlurCircle top="50px" right="50px" />

      <h1 className="my-4 text-lg font-medium">Now showing</h1>

      <div className="flex flex-wrap gap-8 max-sm:justify-center">
        {showsLoading &&
          [...Array(10)].map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}

        {!showsLoading &&
          shows.map((movie) => (
            <MovieCard key={movie._id || movie.id} movie={movie} />
          ))}
      </div>

      {!showsLoading && shows.length === 0 && (
        <div className="flex h-[40vh] items-center justify-center w-full">
          <h1 className="text-center text-3xl font-bold">
            No movies available
          </h1>
        </div>
      )}
    </div>
  );
};

export default Movies;
