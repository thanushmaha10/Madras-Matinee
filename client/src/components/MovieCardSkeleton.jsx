const MovieCardSkeleton = () => {
  return (
    <div className="flex flex-col justify-between p-3 bg-gray-800 rounded-2xl w-66 animate-pulse">
      <div className="h-52 bg-gray-700 rounded-lg" />

      <div className="mt-3 h-4 bg-gray-700 rounded w-3/4" />
      <div className="mt-2 h-3 bg-gray-700 rounded w-1/2" />

      <div className="flex items-center justify-between mt-4">
        <div className="h-8 w-24 bg-gray-700 rounded-full" />
        <div className="h-4 w-10 bg-gray-700 rounded" />
      </div>
    </div>
  );
};

export default MovieCardSkeleton;