const mongoose = require("mongoose");
const RequestSchema = new mongoose.Schema(
  {
    sender: { type: String, required: true },
    receiver: { type: String,  required: true },
    ride_id: { type: String },
    receiver_name : { type: String},
    from : {type:String},
    to : {type:String},
    message : {type:String ,default:null},
    sender_name :{type:String,required:true},
    accepted :{type:Boolean}
  },
  { timestamps: true } ,
);
mongoose.models = {};

module.exports = mongoose.model("Request", RequestSchema);
