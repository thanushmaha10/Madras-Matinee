import { Toaster } from "react-hot-toast";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import SeatLayout from "./pages/SeatLayout";
import MyBookings from "./pages/MyBookings";
import Favorites from "./pages/Favorites";

const App = () => {
  const isAdmin = useLocation().pathname.startsWith("/admin");
  return (
    <>
      <Toaster />
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/movies/:id/:date" element={<SeatLayout />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="my-bookings" element={<MyBookings />} />
      </Routes>
      {!isAdmin && <Footer />}
    </>
  );
};

export default App;
