import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { dummyDateTimeData, dummyShowsData } from "../assets/assets";
import Loader from "../components/Loader";
import { ArrowRightIcon, ClockIcon } from "lucide-react";
import isoTimeFormat from "../lib/isoTimeFormat";
import BlurCircle from "../components/BlurCircle";
import toast from "react-hot-toast";

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

  const getShow = async () => {
    const show = dummyShowsData.find((show) => show._id === id);
    if (show) {
      setShow({
        movie: show,
        dateTime: dummyDateTimeData,
      });
    }
  };

  const handleSeatClick = (seatId) => {
    if (!selectedTime) return toast("Please select time first");

    if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5) {
      return toast("You can only select 5 seats");
    }

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    );
  };

  const renderSeats = (row, count = 9) => (
    <div key={row} className="mt-2">
      <div className="grid grid-cols-9 gap-1 sm:gap-2 justify-center">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          return (
            <button
              key={seatId}
              onClick={() => handleSeatClick(seatId)}
              className={`
                h-6 w-6 text-[10px]
                sm:h-7 sm:w-7 sm:text-xs
                md:h-8 md:w-8 md:text-sm
                rounded border border-primary/60
                transition
                ${
                  selectedSeats.includes(seatId)
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

  useEffect(() => {
    getShow();
  }, []);

  return show ? (
    <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50">
      <div className="w-full lg:w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max lg:sticky lg:top-32">
        <p className="text-lg font-semibold px-6">Available Timings</p>
        <div className="mt-5 space-y-1">
          {show.dateTime[date].map((item) => (
            <div
              key={item.time}
              onClick={() => setSelectedTime(item)}
              className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition ${
                selectedTime?.time === item.time
                  ? "bg-primary text-white"
                  : "hover:bg-primary/20"
              }`}
            >
              <ClockIcon className="w-4 h-4" />
              <p className="text-sm">{isoTimeFormat(item.time)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative flex-1 flex flex-col items-center">
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle bottom="0" right="0" />

        <h1 className="text-xl sm:text-2xl font-semibold mb-4">
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
            strokeWidth="18"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
          />
        </svg>

        <p className="text-xs sm:text-sm mb-4 text-yellow-100">SCREEN SIDE</p>

        <div
          className="w-full overflow-auto"
          style={{
            WebkitOverflowScrolling: "touch",
            touchAction: "pan-x pan-y pinch-zoom",
          }}
        >
          <div className="flex flex-col items-center mt-6 text-xs text-gray-300 min-w-[420px]">
            {/* FIRST GROUP (A–B) */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {groupRows[0].map((row) => renderSeats(row))}
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-10">
              {groupRows.slice(1).map((group, idx) => (
                <div key={idx}>{group.map((row) => renderSeats(row))}</div>
              ))}
            </div>
          </div>
        </div>

        <button className="flex items-center gap-2 mt-10 sm:mt-16 px-8 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium active:scale-95">
          Proceed to Checkout
          <ArrowRightIcon strokeWidth={3} className="w-4 h-4" />
        </button>
      </div>
    </div>
  ) : (
    <Loader />
  );
};

export default SeatLayout;
