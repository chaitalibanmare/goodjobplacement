const express = require("express")
const router = express.Router()
const EmployerProfile = require("../models/EmployerProfile")
const auth = require("../middleware/auth")
const multer = require("multer")

const storage = multer.diskStorage({
destination:"uploads/",
filename:(req,file,cb)=>{
cb(null,Date.now()+"-"+file.originalname)
}
})

const upload = multer({storage})


// GET PROFILE
router.get("/profile",auth,async(req,res)=>{

try{

const userId = req.user._id

const profile = await EmployerProfile.findOne({userId})

res.json({profile})

}catch(err){
res.status(500).json({message:"Server error"})
}

})


// SAVE / UPDATE PROFILE
router.post(
"/profile",
auth,
upload.fields([
{ name:"logo", maxCount:1 },
{ name:"companyImage", maxCount:1 }
]),
async(req,res)=>{

try{

const userId = req.user._id

let profile = await EmployerProfile.findOne({userId})

const data = {
companyName:req.body.companyName,
email:req.body.email,
contact:req.body.contact,
yearsCompleted:req.body.yearsCompleted,
address:req.body.address
}

if(req.files && req.files.logo){
data.logo = "/uploads/" + req.files.logo[0].filename
}

if(req.files && req.files.companyImage){
data.companyImage = "/uploads/" + req.files.companyImage[0].filename
}

if(profile){

await EmployerProfile.updateOne(
{userId},
{$set:data}
)

}else{

await EmployerProfile.create({
userId,
...data
})

}

const updated = await EmployerProfile.findOne({userId})

res.json({message:"Profile saved",profile:updated})

}catch(err){

console.log(err)
res.status(500).json({message:"Server error"})

}

})

module.exports = router