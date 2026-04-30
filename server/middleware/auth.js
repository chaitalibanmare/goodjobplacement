const jwt = require('jsonwebtoken')
const User = require('../models/User')

const JWT_SECRET = process.env.JWT_SECRET || 'gjp_secret'

async function auth(req, res, next){
  const h = req.headers.authorization
  if(!h) return res.status(401).json({error:'No token'})
  const parts = h.split(' ')
  if(parts.length !== 2) return res.status(401).json({error:'Invalid auth header'})
  const token = parts[1]
  try{
    const data = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(data.id).select('-passwordHash')
    if(!user) return res.status(401).json({error:'User not found'})
    req.user = user
    next()
  }catch(err){
    return res.status(401).json({error:'Invalid token'})
  }
}

module.exports = auth
