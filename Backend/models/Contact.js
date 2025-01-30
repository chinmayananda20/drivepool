const mongoose = require("mongoose");
const ContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);
mongoose.models = {};

module.exports = mongoose.model("Contact", ContactSchema);
