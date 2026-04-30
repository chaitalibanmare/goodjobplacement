# GoodJobPlacement Server

Run locally:

```bash
cd server
npm install
cp .env.example .env
# edit .env if needed
npm run dev
```

APIs:
- POST /api/auth/register {name,email,password,phone,role}
- POST /api/auth/login {email,password}
- GET /api/user/me (Authorization: Bearer <token>)
- POST /api/user/me (multipart form-data: fullName,qualifications,experience, photo)

Uploads are served from `/uploads`.
