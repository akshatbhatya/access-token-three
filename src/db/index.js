import mongoose from "mongoose";
import DataBaseName from "../constants.js";

const connectDb = async () => {
  try {
    const data = mongoose.connect(`${process.env.MONGODB_URI}/${DataBaseName}`);
    const response = (await data).connection.host;
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    
  }
};

export default connectDb;
