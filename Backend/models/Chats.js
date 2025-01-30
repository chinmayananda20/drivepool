const mongoose = require("mongoose");
const ChatsSchema = new mongoose.Schema(
  {
    users: [{type: String, required: true}],
    conversation_id:{type: String, required: true}
  },
  {timestamps:true}
);
mongoose.models = {};

module.exports = mongoose.model("Chats", ChatsSchema);
