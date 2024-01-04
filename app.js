import path from "node:path"
import { env } from "node:process"

import cookieParser from "cookie-parser"
import express from "express"
import createError from "http-errors"
import mongoose from "mongoose"
import logger from "morgan"

import catalogRouter from "./routes/catalog.js"
import indexRouter from "./routes/index.js"
import usersRouter from "./routes/users.js"

const app      = express()
const mongoUrl = env.MONGO

console.log(env.MONGO)

const main    = async () => {
  await mongoose.connect(mongoUrl)
}
const dirname = path.dirname(new URL(import.meta.url).pathname)

mongoose.set("strictQuery", false)
main().catch(console.error)

// view engine setup
app.set("views", path.join(dirname, "views"))
app.set("view engine", "pug")

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(dirname, "public")))

app.use("/", indexRouter)
app.use("/users", usersRouter)
app.use("/catalog", catalogRouter)

// catch 404 and forward to error handler
app.use((_req, _res, next) => {
  const notFound = 404

  next(createError(notFound))
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

export default app
