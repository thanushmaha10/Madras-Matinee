import {
  ChartLineIcon,
  CircleDollarSignIcon,
  PlayCircleIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react";
import { dummyDashboardData } from "../../assets/assets";
import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import Title from "../../components/admin/Title";
import BlurCircle from "../../components/BlurCircle";
import dateFormat from "../../lib/dateFormat";

const Dashboard = () => {
  const currency = import.meta.env.VITE_CURRENCY;

  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUser: 0,
  });
  const [loading, setLoading] = useState(true);

  const dashboardCards = [
    {
      title: "Total Bookings",
      value: dashboardData.totalBookings || "0",
      icon: ChartLineIcon,
    },
    {
      title: "Total Revenue",
      value: currency + dashboardData.totalRevenue || "0",
      icon: CircleDollarSignIcon,
    },
    {
      title: "Active Shows",
      value: dashboardData.activeShows.length || "0",
      icon: PlayCircleIcon,
    },
    {
      title: "Total Users",
      value: dashboardData.totalUser || "0",
      icon: UsersIcon,
    },
  ];

  const fetchDashboardData = async () => {
    setDashboardData(dummyDashboardData);
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return !loading ? (
    <>
      <Title text1="Admin" text2="Dashboard" />
      <div className="relative mt-6 flex flex-wrap gap-4">
        <BlurCircle top="-100px" left="-100px" />
        <div className="flex w-full flex-wrap gap-4">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              className="bg-primary/10 border-primary/20 flex w-full max-w-50 items-center justify-between rounded-md border px-4 py-3"
            >
              <div>
                <h1 className="text-sm">{card.title}</h1>
                <p className="mt-1 text-xl font-medium">{card.value}</p>
              </div>
              <card.icon className="h-6 w-6" />
            </div>
          ))}
        </div>
      </div>
      <p className="mt-10 text-lg font-medium">Active Shows</p>
      <div className="relative mt-4 flex max-w-5xl flex-wrap gap-6">
        <BlurCircle top="100px" right="-10%" />
        {dashboardData.activeShows.map((show) => (
          <div
            key={show._id}
            className="bg-primary/10 border-primary/20 h-full w-55 overflow-hidden rounded-lg border pb-3 transition duration-300 hover:-translate-y-1"
          >
            <img
              src={show.movie.poster_path}
              alt="Movie Poster"
              className="h-60 w-full object-cover"
            />
            <p className="truncate p-2 font-medium">{show.movie.title}</p>
            <div className="flex items-center justify-between px-2">
              <p className="text-lg font-medium">
                {currency} {show.showPrice}
              </p>
              <p className="mt-1 flex items-center gap-1 pr-1 text-sm text-gray-400">
                <StarIcon className="text-primary fill-primary h-4 w-4" />
                {show.movie.vote_average.toFixed(1)}
              </p>
            </div>
            <p className="px-2 pt-2 text-sm text-gray-500">
              {dateFormat(show.showDateTime)}
            </p>
          </div>
        ))}
      </div>
    </>
  ) : (
    <Loader />
  );
};

export default Dashboard;
