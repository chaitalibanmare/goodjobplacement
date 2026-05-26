const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const supabase = require('../supabaseClient') // ✅ Added Supabase

const JWT_SECRET = process.env.JWT_SECRET || 'secret123'

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing fields' })
    }

    // 1. Check if user already exists in Supabase
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single()

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }

    // 2. Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // 3. Save to Supabase
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([
        { name, email, password_hash: passwordHash, role: role || 'user', phone }
      ])
      .select()
      .single()

    if (insertError) throw insertError

    // 4. Create token
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing fields' })
    }

    // 1. Find user in Supabase
    const { data: user, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password_hash)
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    // 3. Create token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router