import mongoose from "mongoose";

const {Schema} = mongoose;

const BookSchema = new Schema({
  author: { ref: "Author", required: true, type: Schema.Types.ObjectId },

  genre : [ 
    { ref: "Genre", type: Schema.Types.ObjectId }],

  isbn: { required: true, type: String },
  summary: { required: true, type: String },
  title: { required: true, type: String },
}, {
  virtuals: {
    url: {
      get() {
        return `/catalog/book/${this._id}`;
      },
    },
  },
});

const a        = 123_123
const aasdasas = 12

// Export model
export default mongoose.model("Book", BookSchema);
