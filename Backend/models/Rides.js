const mongoose = require("mongoose");
const RidesSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  name: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  date: { type: String, required: true },
  vechileName: { type: String, required: true },
  phone: { type: Number, required: true },
  vechileNumber: { type: String, required: true },
  time: { type: String, required: true },
  persons :{type:Number,required:true},
  amount :{type:Number,required:true},
  DL : {type: String , required : true},
  aadhaar : {type: String , required : true},
  carimg : {type: String },
  negotiable :{type:Boolean} 

})
module.exports = mongoose.models.Ride || mongoose.model('Ride', RidesSchema);