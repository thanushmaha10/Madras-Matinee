import { useEffect, useState } from "react";
// import { dummyShowsData } from "../../assets/assets";
import Loader from "../../components/Loader";
import { kConverter } from "../../lib/kConverter";
import Title from "../../components/admin/Title";
import { CheckIcon, DeleteIcon, StarIcon } from "lucide-react";
import dateFormat from "../../lib/dateFormat";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddShows = () => {
  const { axios, getToken, user, imageBaseUrl } = useAppContext();

  const currency = import.meta.env.VITE_CURRENCY;
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dateTimeSelection, setDateTimeSelection] = useState({});
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [showPrice, setShowPrice] = useState("");
  const [addingShow, setAddingShow] = useState(false);

  const formatDate = (date) => new Date(date).toLocaleDateString("en-GB");

  const fetchNowPlayingMovies = async () => {
    try {
      const { data } = await axios.get("/api/show/now-playing", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setNowPlayingMovies(data.movies);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const handleDateTimeAdd = () => {
    if (!dateTimeInput) return;
    const [date, time] = dateTimeInput.split("T");
    if (!date || !time) return;

    setDateTimeSelection((prev) => {
      const times = prev[date] || [];
      if (!times.includes(time)) {
        return { ...prev, [date]: [...times, time] };
      }
      return prev;
    });
  };

  const handleRemoveTime = (date, time) => {
    setDateTimeSelection((prev) => {
      const filteredTimes = prev[date].filter((t) => t !== time);
      if (filteredTimes.length === 0) {
        const { [date]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [date]: filteredTimes,
      };
    });
  };

  const handleSubmit = async()=>{
    try{
      setAddingShow(true);

      if(!selectedMovie || Object.keys(dateTimeSelection).length === 0 || !showPrice){
        toast('Missing required fields');
        return;
      }

      const showsInput = Object.entries(dateTimeSelection).map(([date,time]) => ({date,time}));

      const payload = {
        movieId: selectedMovie,
        showsInput,
        showPrice : Number(showPrice)
      }

      const {data} = await axios.post('/api/show/add-show', payload, {headers : {Authorization: `Bearer ${await getToken()}`}})

      if(data.success){
        toast.success(data.message)
        setSelectedMovie(null)
        setDateTimeSelection({})
        setShowPrice("")
      }else{
        toast.error(data.message)
      }

    }catch(err){
      console.error("Submission error:  ", err);
      toast.error("An error occured. Please try again")
    }finally{
      setAddingShow(false);
    }
  }

  useEffect(() => {
    if (user) {
      fetchNowPlayingMovies();
    }
  }, [user]);

  return nowPlayingMovies.length > 0 ? (
    <>
      <Title text1="Add" text2="Shows" />
      <p className="mt-10 text-lg font-medium">Now Playing Movies</p>
      <div className="overflow-x-auto pb-4">
        <div className="group mt-4 flex w-max flex-wrap gap-4">
          {nowPlayingMovies.map((movie) => (
            <div
              key={movie.id}
              className={`relative max-w-40 cursor-pointer transition duration-300 group-hover:not-hover:opacity-40 hover:-translate-y-1`}
              onClick={() => setSelectedMovie(movie.id)}
            >
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={imageBaseUrl + movie.poster_path}
                  alt="Movie Poster"
                  className="w-full object-cover brightness-90"
                />
                <div className="absolute bottom-0 left-0 flex w-full items-center justify-between bg-black/70 p-2 text-sm">
                  <p className="flex items-center gap-1 text-gray-400">
                    <StarIcon className="text-primary fill-primary h-4 w-4" />
                    {movie.vote_average.toFixed(1)}
                  </p>
                  <p className="text-gray-300">
                    {kConverter(movie.vote_count)} Votes
                  </p>
                </div>
              </div>
              {selectedMovie === movie.id && (
                <div className="bg-primary absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded">
                  <CheckIcon className="h-4 w-4 text-white" strokeWidth={2.5} />
                </div>
              )}
              <p className="truncate font-medium">{movie.title}</p>
              <p className="text-sm text-gray-400">{movie.release_date}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <label className="mb-2 block text-sm font-medium">Show Price</label>
        <div className="inline-flex items-center gap-2 rounded-md border border-gray-600 px-3 py-2">
          <p className="text-sm text-gray-400">{currency}</p>
          <input
            min={0}
            type="number"
            value={showPrice}
            onChange={(e) => setShowPrice(e.target.value)}
            placeholder="Enter Ticket price"
            className="outline-none"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-medium">
          Select Date and Time
        </label>
        <div className="inline-flex gap-5 rounded-lg border border-gray-600 p-1 pl-3">
          <input
            type="datetime-local"
            value={dateTimeInput}
            onChange={(e) => setDateTimeInput(e.target.value)}
            className="rounded-md outline-none"
          />
          <button
            onClick={handleDateTimeAdd}
            className="bg-primary/80 hover:bg-primary cursor-pointer rounded-lg px-3 py-2 text-sm text-white"
          >
            Add Time
          </button>
        </div>
      </div>

      {Object.keys(dateTimeSelection).length > 0 && (
        <div className="mt-6">
          <h2 className="mb-3 font-medium">Selected Date-Time</h2>

          <div className="flex flex-wrap gap-3">
            {Object.entries(dateTimeSelection).flatMap(([date, times]) =>
              times.map((time) => (
                <div
                  key={`${date}-${time}`}
                  className="border-primary flex items-center gap-2 rounded border px-3 py-1 text-sm"
                >
                  <span>{formatDate(date)}</span>
                  <span className="text-gray-400">|</span>
                  <span>{time}</span>

                  <DeleteIcon
                    onClick={() => handleRemoveTime(date, time)}
                    width={14}
                    className="ml-1 cursor-pointer text-red-500 hover:text-red-700"
                  />
                </div>
              ))
            )}
          </div>
        </div>
      )}
      <button onClick={handleSubmit} disabled={addingShow} className="bg-primary hover:bg-primary/90 mt-6 cursor-pointer rounded px-8 py-2 text-white transition-all">
        Add Show
      </button>
    </>
  ) : (
    <Loader />
  );
};

export default AddShows;
