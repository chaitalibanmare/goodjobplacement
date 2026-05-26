const jwt = require('jsonwebtoken')
const supabase = require('../supabaseClient') // ✅ Use Supabase

const JWT_SECRET = process.env.JWT_SECRET || 'gjp_secret'

async function auth(req, res, next) {
  const h = req.headers.authorization
  if (!h) return res.status(401).json({ error: 'No token' })
  
  const parts = h.split(' ')
  if (parts.length !== 2) return res.status(401).json({ error: 'Invalid auth header' })
  
  const token = parts[1]
  try {
    // 1. Verify the JWT token
    const data = jwt.verify(token, JWT_SECRET)

    // 2. Find the user in Supabase (excluding the password hash)
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, role, phone, full_name, qualifications, experience, photo, resume')
      .eq('id', data.id)
      .single()

    if (error || !user) {
      return res.status(401).json({ error: 'User not found' })
    }

    // 3. Attach user to the request object
    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

module.exports = auth