import express from "express";
import {
  getfavourites,
  getUserBookings,
  updatefavourite,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/bookings", getUserBookings);
userRouter.post("/update-favourite", updatefavourite);
userRouter.get("/favourites", getfavourites);

export default userRouter;
