import { useEffect, useState } from "react";
import BlurCircle from "../components/BlurCircle";
import timeFormat from "../lib/timeformat";
import dateFormat from "../lib/dateFormat";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const { axios, getToken, user, imageBaseUrl } = useAppContext();

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getMyBookings = async () => {
    try {
      const { data } = await axios.get("/api/user/bookings", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const payNow = async (bookingId) => {
    try {
      const { data } = await axios.post(
        `/api/booking/pay/${bookingId}`,
        {},
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success) {
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, isPaid: true } : b))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      getMyBookings();
    }
  }, [user]);

  // console.log("Bookings:", bookings);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-8 px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold leading-tight">
          No Bookings Found
        </h1>

        <p className="text-gray-400 text-base md:text-lg max-w-md">
          Looks like you haven’t booked any shows yet. Explore movies and book
          your tickets now.
        </p>

        <button
          onClick={() => navigate("/movies")}
          className="flex items-center gap-2 px-8 py-3 text-sm md:text-base bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
        >
          Book Now
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-[80vh] px-6 pt-30 md:px-16 md:pt-40 lg:px-40">
      <BlurCircle top="100px" left="100px" />
      <div>
        <BlurCircle bottom="0px" left="600px" />
      </div>
      <h1 className="mb-4 text-lg font-semibold">My Bookings</h1>

      {bookings.map((item, index) => (
        <div
          key={index}
          className="bg-primary/8 border-primary/20 mt-4 flex max-w-3xl flex-col justify-between rounded-lg border p-2 md:flex-row"
        >
          <div className="flex flex-col md:flex-row">
            <img
              src={imageBaseUrl + item.show.movie.poster_path}
              alt="Movie Poster"
              className="aspect-video h-auto rounded object-cover object-bottom md:max-w-45"
            />
            <div className="flex flex-col p-4">
              <p className="text-lg font-semibold">{item.show.movie.title}</p>
              <p className="text-sm text-gray-400">
                {timeFormat(item.show.movie.runtime)}
              </p>
              <p className="mt-auto text-sm text-gray-400">
                {dateFormat(item.show.showDateTime)}
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between p-4 md:items-end md:text-right">
            <div className="flex items-center gap-4">
              <p className="mb-3 text-2xl font-semibold">
                {currency}
                {item.amount}
              </p>
              {!item.isPaid && (
                <button
                  onClick={() => payNow(item._id)}
                  className="mb-3 rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-white
               transition-all duration-300
               hover:bg-primary-dull hover:scale-105 hover:shadow-lg"
                >
                  Pay Now
                </button>
              )}
            </div>
            <div className="text-sm">
              <p>
                <span className="text-gray-400">Total Tickets:</span>
                {item.bookedSeats.length}
              </p>
              <p>
                <span className="text-gray-400">Seat Number:</span>
                {item.bookedSeats.join(", ")}
              </p>
            </div>
          </div>
        </div>
      ))}
      <div
        className="
    mt-10
    rounded-lg
    border border-red-400/30
    bg-red-400/10
    px-4 py-3
    text-sm text-red-300

    lg:fixed
    lg:right-10
    lg:top-40
    lg:w-72
  "
      >
        <p className="mb-1 font-medium">Demo Project</p>
        <p className="text-xs leading-relaxed">
          Payments are disabled in this demo. Clicking <b>Pay Now</b> will
          simply confirm your booking without any real transaction.
        </p>
      </div>
    </div>
  );
};

export default MyBookings;
