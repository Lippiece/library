import { model, Schema } from "mongoose"

const GenreSchema = new Schema(
  {
    name: { maxLength: 100, minLength: 3, required: true, type: String },
  },
  {
    virtuals: {
      url: {
        get() {
          return `/catalog/genre/${this._id}`
        },
      },
    },
  },
)

const Genre = model("Genre", GenreSchema)

// Export model
export default Genre
