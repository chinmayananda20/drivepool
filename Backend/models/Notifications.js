const mongoose = require("mongoose");
const NotificationsSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    chat_notification_on : [{type:String}]
  },
  { timestamps: true }
);
mongoose.models = {};

module.exports = mongoose.model("Notifications", NotificationsSchema);
