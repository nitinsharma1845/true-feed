import mongoose from "mongoose";

declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

export async function dbConnect() {
  if (global.mongoose?.conn) {
    console.log("DB already connected");
    return global.mongoose.conn;
  }

  if (!global.mongoose) {
    global.mongoose = { conn: null, promise: null };
  }

  if (!global.mongoose.promise) {
    console.log("Creating new DB connection...");

    global.mongoose.promise = mongoose
      .connect(process.env.MONGO_URI!)
      .then((mongooseInstance) => {
        console.log("DB connected successfully");
        return mongooseInstance.connection; //
      });
  }

  global.mongoose.conn = await global.mongoose.promise;

  return global.mongoose.conn;
}
