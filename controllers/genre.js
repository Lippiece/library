import asyncHandler from "express-async-handler"
import { body, validationResult } from "express-validator"
import { StatusCodes } from "http-status-codes"

import Book from "../models/book.js"
import Genre from "../models/genre.js"

// Display list of all Genre.
export const list = asyncHandler(async (req, res, next) => {
  if (req.query.fetch === "true") {
    const genres = await Genre.find({}).sort({ name: 1 }).exec()

    res.render("genreList", {
      genres,
      title: "Genre List",
    })
  }

  const genres = []

  res.render("genreList", {
    genres,
    title: "Genre List",
  })
})

// Display detail page for a specific Genre.
export const genreDetail = asyncHandler(async (req, res, next) => {
  const genre = await Genre.findById(req.params.id).exec()
  const books = await Book.find({ genre: req.params.id }).exec()

  if (genre === null) {
    // No results.
    const error = new Error("Genre not found")

    error.status = 404

    return next(error)
  }

  return res.render("genre", {
    books,
    genre,
    title: genre.name,
  })
})

// Display Genre create form on GET.
export const genreCreateGet = asyncHandler(async (req, res, next) =>
  res.render("genreForm", { title: "Create Genre" }),
)

// Handle Genre create on POST.
// Handle Genre create on POST.
export const genreCreatePost = [
  // Validate and sanitize the name field.
  body("name", "Genre name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors   = validationResult(req)
    const { name } = req.body

    // Create a genre object with escaped and trimmed data.
    const genre = new Genre({ name })

    if (errors.isEmpty()) {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      const existingGenre = await Genre.findOne({ name })
        .collation({ locale: "en", strength: 2 })
        .exec()

      if (existingGenre) {
        // Genre exists, redirect to its detail page.
        res.redirect(existingGenre.url)
      } else {
        await genre.save()

        // New genre saved. Redirect to genre detail page.
        res.redirect(genre.url)
      }
    } else {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("genreForm", {
        errors: errors.array(),
        genre,
        title: "Create Genre",
      })
    }
  }),
]

// Display Genre delete form on GET.
export const genre_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre delete GET")
})

// Handle Genre delete on POST.
export const genre_delete = asyncHandler(async (req, res, next) => {
  const genre = await Genre.findById(req.params.id).exec()

  if (genre === null) {
    res.sendStatus(StatusCodes.NOT_FOUND)

    return
  }

  const books = await Book.find({ genre: req.params.id }).exec()

  if (books.length > 0) {
    res.send(`Cannot delete genre ${genre.name} because it is associated with ${books.length} books`)

    return
  }

  await genre.deleteOne()

  res.send(`Deleted genre ${genre.name}`)
})

// Display Genre update form on GET.
export const genre_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update GET")
})

// Handle Genre update on POST.
export const genre_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Genre update POST")
})
