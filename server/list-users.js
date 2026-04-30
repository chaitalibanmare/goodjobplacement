require('dotenv').config()
const mongoose = require('mongoose')
const User = require('./models/User')

;(async ()=>{
  try{
    const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/goodjob'
    await mongoose.connect(MONGO, {useNewUrlParser:true, useUnifiedTopology:true})
    const users = await User.find().select('-passwordHash')
    console.log('Users in DB:')
    console.dir(users, {depth:4})
    await mongoose.disconnect()
  }catch(err){
    console.error('Error listing users:', err.message || err)
    process.exit(1)
  }
})()
