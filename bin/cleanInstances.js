import { connect, disconnect } from "mongoose"

import BookInstance from "../models/bookinstance.js"

const mongoUrl =
  "mongodb+srv://fuck:Oxidizing-Shriek5-Conjuror-Gilled-Plug@cluster.uebl8ku.mongodb.net/?retryWrites=true&w=majority"
const main     = async () => {
  try {
    await connect(mongoUrl)
  } catch (error) {
    console.log(error)
  }
}

await main()

const instancesToDelete = await BookInstance.find({
  book: { $ne: null },
}).exec()

console.log(instancesToDelete)

try {
  await BookInstance.deleteMany({
    _id: instancesToDelete.map(index => index._id),
  })
} catch (error) {
  console.log(error)
}

await disconnect()
