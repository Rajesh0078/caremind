import mongoose from "mongoose";
import { DB_URI } from "./env.js";

if (!DB_URI) {
  throw new Error("Please define DB_URI in environment variables");
}

const connectToDb = async () => {
  try {
    await mongoose.connect(DB_URI, { autoIndex: false });

    console.log("✅ Database connected successfully");
  } catch (error) {
    handleDbStartupError(error);
    process.exit(1);
  }
};

const handleDbStartupError = (error) => {
  if (
    error.code === 8000 ||
    error.codeName === "AtlasError" ||
    error.message?.includes("bad auth")
  ) {
    console.error("❌ MongoDB authentication failed");
    console.error("➡ Check username, password, DB name, and IP whitelist");
    return;
  }

  if (error.message?.includes("ENOTFOUND")) {
    console.error("❌ Database host not reachable (DNS issue)");
    return;
  }

  if (error.message?.includes("ECONNREFUSED")) {
    console.error("❌ Cannot connect to database (connection refused)");
    return;
  }

  if (error.message?.includes("Invalid scheme")) {
    console.error("❌ Invalid MongoDB connection string");
    return;
  }

  console.error("❌ Unknown database startup error");
};


export default connectToDb;
