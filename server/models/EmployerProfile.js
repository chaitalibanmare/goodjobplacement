const mongoose = require("mongoose")

const EmployerProfileSchema = new mongoose.Schema({

userId:{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
required:true
},

companyName:String,
email:String,
contact:String,
yearsCompleted:Number,
address:String,

logo:String,
companyImage:String

})

module.exports = mongoose.model("EmployerProfile",EmployerProfileSchema)