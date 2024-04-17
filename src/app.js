import cookieParser from "cookie-parser"
import express from "express"
import cors from "cors"
const app = express()

app.use(express.static("public"))

app.use(
  express.urlencoded({
    limit: "16kb",
    extended:true
  })
)

app.use(
  express.json({
    limit: "16kb",
  })
)

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    Credential: true,
  })
)

app.use(cookieParser())

export default app;
