const mongoose = require("mongoose");
const ConversationSchema = new mongoose.Schema(
  {
    messages: [{ type: Object }]
  },
  { timestamps: true }
);
mongoose.models = {};

module.exports = mongoose.model("Conversation", ConversationSchema);
