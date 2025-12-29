import mongoose from "mongoose";

const connectDb = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });
    await mongoose.connect(`${process.env.MONGODB_URI}/madrasmatinee`);
  } catch (err) {
    console.log(err.message);
  }
};

export default connectDb;
