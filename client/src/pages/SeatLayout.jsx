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
        : [...prev, seatId],
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
              className={`border-primary/60 h-6 w-6 rounded border text-[10px] transition sm:h-7 sm:w-7 sm:text-xs md:h-8 md:w-8 md:text-sm ${
                selectedSeats.includes(seatId)
                  ? "bg-primary text-white"
                  : "hover:bg-primary/20"
              } `}
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
    <div className="flex flex-col px-6 py-30 md:flex-row md:px-16 md:pt-50 lg:px-40">
      <div className="bg-primary/10 border-primary/20 h-max w-full rounded-lg border py-10 lg:sticky lg:top-32 lg:w-60">
        <p className="px-6 text-lg font-semibold">Available Timings</p>
        <div className="mt-5 space-y-1">
          {show.dateTime[date].map((item) => (
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

        <button className="bg-primary hover:bg-primary-dull mt-10 flex items-center gap-2 rounded-full px-8 py-3 text-sm font-medium transition active:scale-95 sm:mt-16">
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
