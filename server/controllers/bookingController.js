import Booking from "../models/Booking.js";
import Show from "../models/Show.js";

// Function to check availability of selected seats for a movie
const checkSeatsAvailability = async (showId, selectedSeats) => {
  try {
    const showData = await Show.findById(showId);

    if (!showData) return false;

    const occupiedSeats = showData.occupiedSeats;

    const isAnySeatTaken = selectedSeats.some((seat) => occupiedSeats[seat]);

    return !isAnySeatTaken;
  } catch (err) {
    console.error(err.message);
    return false;
  }
};

export const createBooking = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { showId, selectedSeats } = req.body;
    const { origin } = req.headers;

    //check if the the seat is available
    const isAvailable = await checkSeatsAvailability(showId, selectedSeats);

    if (!isAvailable) {
      return res.json({
        success: false,
        message: "Selected seats are not available.",
      });
    }

    //get the show details
    const showData = await Show.findById(showId).populate("movie");

    //create a new booking
    const booking = await Booking.create({
      user: userId,
      show: showId,
      amount: showData.showPrice * selectedSeats.length,
      bookedSeats: selectedSeats,
    });

    selectedSeats.map((seat) => {
      showData.occupiedSeats[seat] = userId;
    });

    showData.markModified("occupiedSeats");

    await showData.save();

    res.json({ success: true, message: "Seat Booked Successfully" });
  } catch (err) {
    console.error(err.message);
    res.json({ success: false, message: err.message });
  }
};

export const getOccupiedSeats = async (req, res) => {
  try {
    const { showId } = req.params;
    const showData = await Show.findById(showId);

    const occupiedSeats = Object.keys(showData.occupiedSeats);

    res.json({ success: true, occupiedSeats });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const payBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { userId } = req.auth(); // Clerk user

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }

    // ownership check
    if (booking.user.toString() !== userId) {
      return res.json({ success: false, message: "Not authorized" });
    }

    if (booking.isPaid) {
      return res.json({ success: true, message: "Already paid" });
    }

    const showData = await Show.findById(booking.show);

    // permanently occupy seats
    booking.bookedSeats.forEach((seat) => {
      showData.occupiedSeats[seat] = booking.user;
    });

    showData.markModified("occupiedSeats");
    booking.isPaid = true;

    await booking.save();
    await showData.save();

    res.json({ success: true, message: "Payment successful" });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Payment failed" });
  }
};
