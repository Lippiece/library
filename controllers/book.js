import asyncHandler from "express-async-handler"
import { body, validationResult } from "express-validator"
import { StatusCodes } from "http-status-codes"

import Author from "../models/author.js"
import Book from "../models/book.js"
import BookInstance from "../models/bookinstance.js"
import Genre from "../models/genre.js"

export const index = asyncHandler(async (req, res, _next) => {
  if (req.query.fetch === "true") {
    const [
      numberBooks,
      numberBookInstances,
      numberAvailableBookInstances,
      numberAuthors,
      numberGenres,
    ] = await Promise.all([
      Book.countDocuments({}).exec(),
      BookInstance.countDocuments({}).exec(),
      BookInstance.countDocuments({ status: "Available" }).exec(),
      Author.countDocuments({}).exec(),
      Genre.countDocuments({}).exec(),
    ])

    const counts = [
      ["Authors", numberAuthors],
      ["Books", numberBooks],
      ["Book copies", numberBookInstances],
      ["Available", numberAvailableBookInstances],
      ["Genres", numberGenres],
    ]

    return res.render("index", {
      counts,

      title: "Local Library Home",
    })
  }

  const countsInitial = [
    ["Authors"],
    ["Books"],
    ["Book copies"],
    ["Available"],
    ["Genres"],
  ]

  res.render("index", {
    counts: countsInitial,

    title: "Local Library Home",
  })
})

// Display list of all books.
export const bookList = asyncHandler(async (req, res, _next) => {
  if (req.query.fetch === "true") {
    const allBooks = await Book.find({}, "title author")
      .sort({ title: 1 })
      .populate("author")
      .exec()

    return res.render("bookList", { bookList: allBooks, title: "Book List" })
  }

  res.render("bookList", { bookList: [], title: "Book List" })
})

// Display detail page for a specific book.
export const bookDetail = asyncHandler(async (req, res, next) => {
  if (req.query.fetch === "true") {
    // Get details of books, book instances for specific book
    const [book, bookInstances] = await Promise.all([
      Book.findById(req.params.id).populate("author").populate("genre").exec(),
      BookInstance.find({ book: req.params.id }).exec(),
    ])

    if (book === null) {
      // No results.
      const error = new Error("Book not found")

      error.status = 404

      return next(error)
    }

    return res.render("book", {
      book,
      bookInstances,
      title: book.title,
    })
  }

  res.render("book", {})
})

// Display book create form on GET.
export const bookCreateGet = asyncHandler(async (req, res, next) => {
  if (req.query.fetch === "true") {
    const authors = await Author.find({}).exec()
    const genres  = await Genre.find({}).exec()

    return res.render("bookForm", {
      authors,
      genres,
      title: "Create Book",
    })
  }

  res.render("bookForm", {
    title: "Create Book",
  })
})

// Handle book create on POST.
export const bookCreatePost = [
  (req, _res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre = req.body.genre === undefined ? [] : [req.body.genre]
    }

    next()
  },
  body("title").trim().isLength({ min: 1 }).escape(),
  body("author").trim().isLength({ min: 1 }).escape(),
  body("genre.*").escape(),
  body("summary").trim().isLength({ min: 1 }).escape(),
  body("isbn")
    .trim()
    .escape()
    .isNumeric()
    .withMessage("ISBN must be numeric")
    .isLength({ min: 1 }),

  asyncHandler(async (req, res, next) => {
    const errors                                  = validationResult(req)
    const { author, genre, isbn, summary, title } = req.body

    if (errors.isEmpty()) {
      const book = new Book({
        author,
        genre,
        isbn,
        summary,
        title,
      })

      await book.save()

      return res.redirect(book.url)
    }

    res.render("bookForm", {
      authors: await Author.find({}).exec(),
      errors: errors.array(),
      genres: await Genre.find({}).exec(),
      title: "Create Book",
    })
  }),
]

// Display book delete form on GET.
export const book_delete = asyncHandler(async (req, res, next) => {
  const _id           = req.url.split("/").at(-2)
  const book          = await Book.findById(_id).exec()
  const bookInstances = await BookInstance.find({ book }).exec()

  if (book === null) {
    res.sendStatus(StatusCodes.NOT_FOUND)

    return
  }

  await book.deleteOne()
  await BookInstance.deleteMany({ book })
  res.send(`Deleted ${book.title} and its ${
    bookInstances
    ? bookInstances.length
    : 0} copies`)
})

// Display book update form on GET.
export const book_update_get = asyncHandler(async (req, res, next) => {
  const _id  = req.url.split("/").at(-2)
  const book = await Book.findById(_id).exec()

  if (book === null) {
    res.sendStatus(StatusCodes.NOT_FOUND)
  }

  if (req.query.fetch === "true") {
    res.render("bookForm", {
      authors: await Author.find({}).exec(),
      book,
      genres: await Genre.find({}).exec(),
      title: "Update Book",
    })
  }

  res.render("bookForm", {
    title: "Update Book",
  })
})

// Handle book update on POST.
export const book_update_put = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Book update POST")
})
