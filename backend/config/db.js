import mongoose from "mongoose";
import dns from "dns";

// Fix for DNS SRV resolution issue
dns.setDefaultResultOrder("ipv4first");

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://standardwebtechnologies:apblnlv544gOyIk9@cluster0.lp6o5.mongodb.net/ikafries"
    );
    console.log("DB Connected");
  } catch (error) {
    console.error("DB Connection Error:", error);
    throw error; // Re-throwing the error allows the calling code to handle it
  }
};
