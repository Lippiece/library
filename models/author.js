import { DateTime } from "luxon"
import { model, Schema } from "mongoose"

const AuthorSchema = new Schema(
  {
    date_of_birth: { type: Date },
    date_of_death: { type: Date },
    family_name: { maxLength: 100, required: true, type: String },
    first_name: { maxLength: 100, required: true, type: String },
  },
  {
    virtuals: {
      birthFormatted: {
        get() {
          return this.date_of_birth
            ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(
                DateTime.DATE_MED,
              )
            : "N/A"
        },
      },

      deathFormatted: {
        get() {
          return this.date_of_death
            ? DateTime.fromJSDate(this.date_of_death).toLocaleString(
                DateTime.DATE_MED,
              )
            : "N/A"
        },
      },

      name: {
        get() {
          return `${this.family_name}, ${this.first_name}`
        },
      },

      url: {
        get() {
          return `/catalog/author/${this._id}`
        },
      },
    },
  },
)

// Export model
export default model("Author", AuthorSchema)
