import { DateTime } from "luxon"
import { model, Schema } from "mongoose"

const BookInstanceSchema = new Schema(
  {
    book: { ref: "Book", required: true, type: Schema.Types.ObjectId }, // reference to the associated book
    due_back: { default: Date.now, type: Date },
    imprint: { required: true, type: String },

    status: {
      default: "Maintenance",
      enum: ["Available", "Maintenance", "Loaned", "Reserved"],
      required: true,
      type: String,
    },
  },
  {
    virtuals: {
      dueBackFormatted: {
        get() {
          return DateTime.fromJSDate(this.due_back).toLocaleString(
            DateTime.DATE_MED,
          )
        },
      },

      url: {
        get() {
          return `/catalog/bookinstance/${this._id}`
        },
      },
    },
  },
)

// Export model
export default model("BookInstance", BookInstanceSchema)
