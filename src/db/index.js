import mongoose from "mongoose"
import DataBaseName from "../constants.js"

const connectDb = async () => {
  try {
    const database = await mongoose.connect(`${process}/${DataBaseName}`)
    const response = database.Connection.host
    console.log(response)
    return response

  } catch (error) {
    return error
  }
}

export default connectDb;
