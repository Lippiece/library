import express from "express"

import {
  author_delete_get,
  author_delete_post,
  author_update_get,
  author_update_post,
  authorCreateGet,
  authorCreatePost,
  detail as authorDetail,
  list as authorList,
} from "../controllers/author.js"


// Require controller modules.
import {
  book_delete_get,
  book_delete_post,
  book_update_get,
  book_update_post,
  bookCreateGet,
  bookCreatePost,
  bookDetail,
  bookList,
  index,
} from "../controllers/book.js"
import {
  bookInstance,
  bookinstance_delete_get,
  bookinstance_delete_post,
  bookinstance_update_get,
  bookinstance_update_post,
  bookinstanceCreateGet,
  bookinstanceCreatePost,
  list as bookInstancesList,
} from "../controllers/bookInstance.js"
import {
  genre_delete_get,
  genre_delete_post,
  genre_update_get,
  genre_update_post,
  genreCreateGet,
  genreCreatePost,
  genreDetail,
  list as genreList,
} from "../controllers/genre.js"

const router = express.Router()

// / BOOK ROUTES ///

// GET catalog home page.
router.get("/", index)

// GET request for creating a Book.
// NOTE This must come before routes that display Book (uses id).
router.get("/book/create", bookCreateGet)

// POST request for creating Book.
router.post("/book/create", bookCreatePost)

// GET request to delete Book.
router.get("/book/:id/delete", book_delete_get)

// POST request to delete Book.
router.post("/book/:id/delete", book_delete_post)

// GET request to update Book.
router.get("/book/:id/update", book_update_get)

// POST request to update Book.
router.post("/book/:id/update", book_update_post)

// GET request for one Book.
router.get("/book/:id", bookDetail)

// GET request for list of all Book items.
router.get("/books", bookList)

// / AUTHOR ROUTES ///

// GET request for creating Author.
// NOTE This must come before route for id (i.e. display author).
router.get("/author/create", authorCreateGet)

// POST request for creating Author.
router.post("/author/create", authorCreatePost)

// GET request to delete Author.
router.get("/author/:id/delete", author_delete_get)

// POST request to delete Author.
router.post("/author/:id/delete", author_delete_post)

// GET request to update Author.
router.get("/author/:id/update", author_update_get)

// POST request to update Author.
router.post("/author/:id/update", author_update_post)

// GET request for one Author.
router.get("/author/:id", authorDetail)

// GET request for list of all Authors.
router.get("/authors", authorList)

// / GENRE ROUTES ///

// GET request for creating a Genre.
// NOTE This must come before route that displays Genre (uses id).
router.get("/genre/create", genreCreateGet)

// POST request for creating Genre.
router.post("/genre/create", genreCreatePost)

// GET request to delete Genre.
router.get("/genre/:id/delete", genre_delete_get)

// POST request to delete Genre.
router.post("/genre/:id/delete", genre_delete_post)

// GET request to update Genre.
router.get("/genre/:id/update", genre_update_get)

// POST request to update Genre.
router.post("/genre/:id/update", genre_update_post)

// GET request for one Genre.
router.get("/genre/:id", genreDetail)

// GET request for list of all Genre.
router.get("/genres", genreList)

// / BOOKINSTANCE ROUTES ///

// GET request for creating a BookInstance.
// NOTE This must come before route that displays BookInstance (uses id).
router.get("/bookinstance/create", bookinstanceCreateGet)

// POST request for creating BookInstance.
router.post("/bookinstance/create", bookinstanceCreatePost)

// GET request to delete BookInstance.
router.get("/bookinstance/:id/delete", bookinstance_delete_get)

// POST request to delete BookInstance.
router.post("/bookinstance/:id/delete", bookinstance_delete_post)

// GET request to update BookInstance.
router.get("/bookinstance/:id/update", bookinstance_update_get)

// POST request to update BookInstance.
router.post("/bookinstance/:id/update", bookinstance_update_post)

// GET request for one BookInstance.
router.get("/bookinstance/:id", bookInstance)

// GET request for list of all BookInstance.
router.get("/bookinstances", bookInstancesList)

export default router
