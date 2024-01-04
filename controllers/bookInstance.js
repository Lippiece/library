import asyncHandler from "express-async-handler"
import { body, validationResult } from "express-validator"

import Book from "../models/book.js"
import BookInstance from "../models/bookinstance.js"

// Display list of all BookInstances.
export const list = asyncHandler(async (req, res, _next) => {
  if (req.query.fetch === "true") {
    const allBookInstances = await BookInstance.find().populate("book").exec()

    return res.render("bookInstancesList", {
      list: allBookInstances,
      title: "Book Instance List",
    })
  }

  res.render("bookInstancesList", {
    title: "Book Instance List",
  })
})

// Display detail page for a specific BookInstance.
export const bookInstance = asyncHandler(async (req, res, next) => {
  const instance = await BookInstance.findById(req.params.id)
    .populate("book")
    .exec()

  if (instance === null) {
    // No results.
    const error = new Error("Book not found")

    error.status = 404

    return next(error)
  }

  res.render("bookInstance", {
    instance,
    title: instance.book.title,
  })
})

// Display BookInstance create form on GET.
export const bookinstanceCreateGet = asyncHandler(async (req, res, next) => {
  if (req.query.fetch === "true") {
    const books = await Book.find().exec()

    return res.render("bookInstanceForm", {
      books,
      title: "Add a book copy",
    })
  }

  res.render("bookInstanceForm", {
    title: "Add a book copy",
  })
})

// Handle BookInstance create on POST.
export const bookinstanceCreatePost = [
  body("book", "Book must be specified").escape(),
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("due_back", "Invalid date")
    .optional({ values: "falsy" })
    .trim()
    .isISO8601()
    .escape(),
  body("status", "Status must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, _next) => {
    const errors                              = validationResult(req)
    const { book, due_back, imprint, status } = req.body

    if (errors.isEmpty()) {
      const newInstance = new BookInstance({
        book,
        due_back,
        imprint,
        status,
      })

      await newInstance.save()

      res.redirect(newInstance.url)
    }

    const books = await Book.find().exec()

    res.render("bookInstanceForm", {
      books,
      errors: errors.array(),
      instance: { book, due_back, imprint, status },
      title: "Add a book copy",
    })
  }),
]

// Display BookInstance delete form on GET.
export const bookinstance_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance delete GET")
})

// Handle BookInstance delete on POST.
export const bookinstance_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance delete POST")
})

// Display BookInstance update form on GET.
export const bookinstance_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance update GET")
})

// Handle bookinstance update on POST.
export const bookinstance_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance update POST")
})
