import { useEffect, useState } from "react";
import { dummyBookingData } from "../assets/assets";
import { Loader } from "lucide-react";
import BlurCircle from "../components/BlurCircle";
import timeFormat from "../lib/timeformat";
import dateFormat from "../lib/dateFormat";

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getMyBookings = async () => {
    setBookings(dummyBookingData);
    setIsLoading(false);
  };

  useEffect(() => {
    getMyBookings();
  }, []);

  return !isLoading ? (
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
              src={item.show.movie.poster_path}
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
                <button className="bg-primary mb-3 cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium">
                  Pay Now
                </button>
              )}
            </div>
            <div className="text-sm">
              <p>
                <span className="text-gray-400">Total Tickets:</span>{" "}
                {item.bookedSeats.length}
              </p>
              <p>
                <span className="text-gray-400">Seat Number:</span>{" "}
                {item.bookedSeats.join(", ")}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <Loader />
  );
};

export default MyBookings;
