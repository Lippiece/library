import "dotenv/config"

import path from "node:path"

import cookieParser from "cookie-parser"
import express from "express"
import createError from "http-errors"
import { StatusCodes } from "http-status-codes"
import mongoose from "mongoose"
import morgan from "morgan"

import catalogRouter from "./routes/catalog.js"
import indexRouter from "./routes/index.js"
import usersRouter from "./routes/users.js"

const app      = express()
const mongoUrl = process.env.MONGO
const main     = async () => {
  await mongoose.connect(mongoUrl)
  console.log("Connected to MongoDB")
}
const dirname  = path.dirname(new URL(import.meta.url).pathname)

mongoose.set("strictQuery", false)
main().catch(console.error)

// view engine setup
app.set("views", path.join(dirname, "views"))
app.set("view engine", "pug")

app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(dirname, "public")))

app.use("/", indexRouter)
app.use("/users", usersRouter)
app.use("/catalog", catalogRouter)

// catch 404 and forward to error handler
app.use((_req, _res, next) => {

  next(createError(StatusCodes.NOT_FOUND))
})

// error handler
app.use((error, req, res, _next) => {
  // set locals, only providing error in development
  res.locals.message = error.message
  res.locals.error   = req.app.get("env") === "development" ? error : {}

  // render the error page
  const serverError = 500

  res.status(error.status || serverError)
  res.render("error")
})

app.listen(3000)
console.log("Server running on port 3000")
