import asyncHandler from "express-async-handler"
import { body, validationResult } from "express-validator"

import Author from "../models/author.js"
import Book from "../models/book.js"

// Display list of all Authors.
export const list = asyncHandler(async (req, res, next) => {
  if (req.query.fetch === "true") {
    const allAuthors = await Author.find().sort({ family_name: 1 }).exec()

    return res.render("authorList", {
      authorList: allAuthors,
      title: "Author List",
    })
  }

  res.render("authorList", {
    title: "Author List",
  })
})

// Display detail page for a specific Author.
export const detail = asyncHandler(async (req, res, next) => {
  // Get details of author and all their books (in parallel)
  const [author, books] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ])

  if (author === null) {
    // No results.
    const error = new Error("Author not found")

    error.status = 404

    return next(error)
  }

  res.render("author", {
    author,
    books,
    title: "Author Detail",
  })
})

// Display Author create form on GET.
export const authorCreateGet = asyncHandler(async (req, res, next) => {
  res.render("authorForm", { title: "Create Author" })
})

// Handle Author create on POST.
export const authorCreatePost = [
  body("surname")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Surname must be specified")
    .isAlphanumeric()
    .withMessage("Surname must contain only letters and numbers"),

  body("name")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("First name must be specified")
    .isAlphanumeric()
    .withMessage("First name must contain only letters and numbers"),

  body("birthdate").trim().escape().isISO8601().toDate(),

  body("death").trim().escape().isISO8601().toDate(),

  asyncHandler(async (req, res, next) => {
    const errors                              = validationResult(req)
    const { birthdate, death, name, surname } = req.body

    const author = new Author({
      date_of_birth: birthdate,
      date_of_death: death,
      family_name: surname,
      first_name: name,
    })

    if (errors.isEmpty()) {
      await author.save()

      res.redirect(author.url)
    }

    console.error(errors.array())
    res.render("authorForm", {
      author,
      errors: errors.array(),
      title: "Create Author",
    })
  }),
]

// Display Author delete form on GET.
export const author_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author delete GET")
})

// Handle Author delete on POST.
export const author_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author delete POST")
})

// Display Author update form on GET.
export const author_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author update GET")
})

// Handle Author update on POST.
export const author_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author update POST")
})
