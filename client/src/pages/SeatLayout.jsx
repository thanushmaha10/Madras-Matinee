import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import { dummyDateTimeData, dummyShowsData } from "../assets/assets";
import Loader from "../components/Loader";
import { ArrowRightIcon, ClockIcon } from "lucide-react";
import isoTimeFormat from "../lib/isoTimeFormat";
import BlurCircle from "../components/BlurCircle";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const SeatLayout = () => {
  const groupRows = [
    ["A", "B"],
    ["C", "D"],
    ["E", "F"],
    ["G", "H"],
    ["I", "J"],
  ];

  const { id, date } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);

  const navigate = useNavigate();

  const { axios, getToken, user } = useAppContext();

  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`);
      if (data.success) {
        setShow(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSeatClick = (seatId) => {
    if (!selectedTime) return toast("Please select time first");

    if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5) {
      return toast("You can only select 5 seats");
    }

    if (occupiedSeats.includes(seatId)) {
      return toast("This seat is already booked");
    }

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
  };

  const renderSeats = (row, count = 9) => (
    <div key={row} className="mt-2">
      <div className="grid grid-cols-9 justify-center gap-1 sm:gap-2">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          return (
            <button
              key={seatId}
              onClick={() => handleSeatClick(seatId)}
              className={`border-primary/60 h-6 w-6 rounded border text-[10px] transition sm:h-7 sm:w-7 sm:text-xs md:h-8 md:w-8 md:text-sm

    ${
      occupiedSeats.includes(seatId)
        ? "cursor-not-allowed opacity-40"
        : selectedSeats.includes(seatId)
        ? "bg-primary text-white"
        : "hover:bg-primary/20"
    }
  `}
            >
              {seatId}
            </button>
          );
        })}
      </div>
    </div>
  );

  const getOccupiedSeats = async () => {
    try {
      const { data } = await axios.get(
        `/api/booking/seats/${selectedTime.showId}`
      );
      if (data.success) {
        setOccupiedSeats(data.occupiedSeats);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const bookTickets = async () => {
    try {
      if (!user) return toast.error("Please login to proceed");

      if (!selectedTime || !selectedSeats.length)
        return toast.error("Please select a time and seats");

      const { data } = await axios.post(
        "/api/booking/create",
        { showId: selectedTime.showId, selectedSeats },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        toast.success("Seats locked successfully");
        navigate("/my-bookings"); // 👈 go to MyBookings
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getShow();
  }, []);

  useEffect(() => {
    if (selectedTime) {
      getOccupiedSeats();
    }
  }, [selectedTime]);

  return show ? (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 md:gap-10 lg:gap-16 px-6 pt-28 md:px-16 md:pt-40 lg:px-40">
      <div className="bg-primary/10 border-primary/20 h-max w-full rounded-lg border py-10 text-center md:max-w-sm md:text-left lg:sticky lg:top-32 lg:w-60">
        <p className="px-6 text-lg font-semibold">Available Timings</p>
        <div className="mt-5 space-y-1 flex flex-col items-center md:items-start">
          {show?.dateTime?.[date]?.map((item) => (
            <div
              key={item.time}
              onClick={() => setSelectedTime(item)}
              className={`flex w-max cursor-pointer items-center gap-2 rounded-r-md px-6 py-2 transition ${
                selectedTime?.time === item.time
                  ? "bg-primary text-white"
                  : "hover:bg-primary/20"
              }`}
            >
              <ClockIcon className="h-4 w-4" />
              <p className="text-sm">{isoTimeFormat(item.time)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative flex flex-1 flex-col items-center">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle bottom="0" right="0" />

        <h1 className="mb-4 text-xl font-semibold sm:text-2xl">
          Select your seat
        </h1>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 80"
          className="mx-auto w-full sm:w-4/5"
        >
          <path
            d="M 10 40 Q 500 5 990 40"
            stroke="#FACC15"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
          />
        </svg>

        <p className="mb-4 text-xs text-yellow-100 sm:text-sm">SCREEN SIDE</p>

        <div
          className="w-full overflow-auto"
          style={{
            WebkitOverflowScrolling: "touch",
            touchAction: "pan-x pan-y pinch-zoom",
          }}
        >
          <div className="mt-6 flex min-w-[420px] flex-col items-center text-xs text-gray-300">
            <div className="mb-6 grid grid-cols-2 gap-6">
              {groupRows[0].map((row) => renderSeats(row))}
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-10">
              {groupRows.slice(1).map((group, idx) => (
                <div key={idx}>{group.map((row) => renderSeats(row))}</div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={bookTickets}
          className="bg-primary hover:bg-primary-dull mt-10 flex items-center gap-2 rounded-full px-8 py-3 text-sm font-medium transition active:scale-95 sm:mt-16"
        >
          Proceed to Checkout
          <ArrowRightIcon strokeWidth={3} className="h-4 w-4" />
        </button>
      </div>
    </div>
  ) : (
    <Loader />
  );
};

export default SeatLayout;
