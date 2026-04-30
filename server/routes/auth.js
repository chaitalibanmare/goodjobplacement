const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const JWT_SECRET = process.env.JWT_SECRET || 'gjp_secret'


// REGISTER
router.post('/register', async (req, res) => {
  try{

    const { name, email, password, phone, role } = req.body

    if(!name || !email || !password){
      return res.status(400).json({error:'Missing fields'})
    }

    // check existing user
    const exists = await User.findOne({email})
    if(exists){
      return res.status(400).json({error:'Email already registered'})
    }

    // password hash
    const hash = await bcrypt.hash(password, 10)

    // role default = user
    const userRole = role || "user"

    const user = new User({
      name,
      email,
      phone,
      passwordHash: hash,
      role: userRole
    })

    await user.save()

    // create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user:{
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

  }catch(err){
    console.error(err)
    res.status(500).json({error:'Server error'})
  }
})



// LOGIN
router.post('/login', async (req, res) => {
  try{

    const { email, password } = req.body

    if(!email || !password){
      return res.status(400).json({error:'Missing fields'})
    }

    const user = await User.findOne({email})
    if(!user){
      return res.status(400).json({error:'Invalid credentials'})
    }

    const ok = await bcrypt.compare(password, user.passwordHash)
    if(!ok){
      return res.status(400).json({error:'Invalid credentials'})
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user:{
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

  }catch(err){
    console.error(err)
    res.status(500).json({error:'Server error'})
  }
})


module.exports = router