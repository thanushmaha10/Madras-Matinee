import { Toaster } from "react-hot-toast";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import SeatLayout from "./pages/SeatLayout";
import MyBookings from "./pages/MyBookings";
import Favourites from "./pages/Favorites";
import Dashboard from "./pages/admin/Dashboard";
import Layout from "./pages/admin/Layout";
import AddShows from "./pages/admin/AddShows";
import ListBookings from "./pages/admin/ListBookings";
import ListShows from "./pages/admin/ListShows";
import { useAppContext } from "./context/AppContext";
import { SignIn } from "@clerk/clerk-react";
import Loader from "./components/Loader";

const App = () => {
  const isAdmin = useLocation().pathname.startsWith("/admin");
  const { user, appLoading } = useAppContext();

   if (appLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <Loader />
      </div>
    );
  }
  
  return (
    <>
      <Toaster />
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/movies/:id/:date" element={<SeatLayout />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route
          path="/admin/*"
          element={
            user ? (
              <Layout />
            ) : (
              <div className="min-h-screen flex justify-center items-center">
                <SignIn fallbackRedirectUrl={"/admin"} />
              </div>
            )
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="add-shows" element={<AddShows />} />
          <Route path="list-shows" element={<ListShows />} />
          <Route path="list-bookings" element={<ListBookings />} />
        </Route>
      </Routes>
      {!isAdmin && <Footer />}
    </>
  );
};

export default App;
