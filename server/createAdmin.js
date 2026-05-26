require("dotenv").config()
const bcrypt = require("bcryptjs")
const supabase = require("./supabaseClient") // ✅ Use Supabase

async function createAdmin() {
  try {
    // 1. Check if admin already exists
    const { data: existingAdmin } = await supabase
      .from('users')
      .select('email')
      .eq('email', "admin@gjp.com")
      .single()

    if (existingAdmin) {
      console.log("Admin already exists")
      process.exit()
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash("admin123", 10)

    // 3. Insert into Supabase
    const { data, error } = await supabase
      .from('users')
      .insert([{
        name: "Admin",
        email: "admin@gjp.com",
        password_hash: hashedPassword,
        role: "admin"
      }])
      .select()

    if (error) throw error

    console.log("✅ Admin created successfully in Supabase")
    process.exit()

  } catch (err) {
    console.error("❌ Error creating admin:", err.message)
    process.exit(1)
  }
}

createAdmin()