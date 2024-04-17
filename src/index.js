import connectDb from "./db/index.js";
import app from "./app.js";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
const portNo = process.env.PORT || 8080;
connectDb()
  .then(() => {
    app.listen(portNo, () => {
      console.log(`http://localhost:${portNo}`);
    });
  })
  .catch((err) => console.log(err || "database connectoion is unsucessfull"));
