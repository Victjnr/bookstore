# 🚀 Quick Start - Getting Your App Running

## Prerequisites
- PHP 8.1+ installed
- Node.js 18+ installed
- MySQL running
- Laravel project configured

## One-Command Quick Start

### On Windows PowerShell (Recommended)

Copy and paste this entire block:

```powershell
# Open PowerShell and run:

# 1. Start backend in background
Start-Process powershell -ArgumentList {
    cd "C:\Users\victor gomwe\onlineBookStore\backend\onlinebookstore"
    php artisan serve --port=8000
}

# 2. Wait 3 seconds for backend to start
Start-Sleep -Seconds 3

# 3. Start frontend in new window
Start-Process powershell -ArgumentList {
    cd "C:\Users\victor gomwe\onlineBookStore\frontend\cozy-bookstore-main"
    npm run dev
}

# 4. Open browser
Start-Sleep -Seconds 3
Start-Process "http://localhost:8080/login"
```

---

## Step-by-Step Manual Start

### Terminal 1: Start Backend API

```bash
cd C:\Users\victor gomwe\onlineBookStore\backend\onlinebookstore
php artisan serve --port=8000
```

**Expected Output:**
```
Laravel development server started: http://127.0.0.1:8000
[timestamp] Listening for connections at: http://127.0.0.1:8000
```

✅ **Backend is running** - keep this terminal open

---

### Terminal 2: Start Frontend

Open a NEW terminal window and run:

```bash
cd C:\Users\victor gomwe\onlineBookStore\frontend\cozy-bookstore-main
npm run dev
```

**Expected Output:**
```
VITE v5.0.0 ready in 1234 ms

➜  Local:   http://localhost:8080/
➜  Press h to show help
```

✅ **Frontend is running** - keep this terminal open

---

### Terminal 3: Open Browser

```bash
# Windows PowerShell
Start-Process "http://localhost:8080/login"

# Or just manually open browser and go to:
http://localhost:8080/login
```

✅ **Browser should open to login page**

---

## ✅ Verification Checklist

### 1. Backend Running?
```bash
# In Terminal 1, should see:
Laravel development server started: http://127.0.0.1:8000
```

### 2. Frontend Running?
```bash
# In Terminal 2, should see:
VITE v5.0.0 ready...
➜  Local:   http://localhost:8080/
```

### 3. Can Access Page?
Open browser → http://localhost:8080/login
- Page should load
- See login form
- No errors in console (F12)

### 4. Check CORS Headers
Open DevTools (F12) → Network tab
- Try to login
- Look for OPTIONS request to `/auth/login`
- Click it and check "Response Headers"
- Should see: `Access-Control-Allow-Origin: http://localhost:8080`

### 5. Test Login
- Email: `test@example.com`
- Password: `password`
- Click "Login"
- Should redirect to dashboard
- No CORS errors in console

---

## 🧪 Testing Scenarios

### Scenario 1: New User Registration

```
1. Go to http://localhost:8080/signup
2. Fill in:
   - Email: newuser@example.com
   - Password: password123
   - Confirm: password123
3. Click "Sign Up"
4. Should redirect to login (or auto-login)
5. Check console for errors (F12)
```

**Expected:** No CORS errors, successfully registered

---

### Scenario 2: Add Items to Cart

```
1. Login successfully
2. Go to http://localhost:8080/books (or browse section)
3. Find a book
4. Click "Add to Cart"
5. Check DevTools Network tab
6. Look for POST request to /api/cart
7. Should succeed immediately (optimistic update)
```

**Expected:** Item appears in cart instantly

---

### Scenario 3: Verify Per-User Carts

```
1. User A: Login with user1@example.com
2. User A: Add book 1 and book 2 to cart
3. User A: Logout
4. User B: Login with user2@example.com
5. User B: Check cart
```

**Expected:** User B's cart is empty (different from User A)

---

## 🐛 Troubleshooting

### Problem: CORS Error in Console

```
Access to fetch at 'http://localhost:8000/auth/login' from origin 
'http://localhost:8080' has been blocked by CORS policy
```

**Solution:**
```bash
# 1. Check .env has CORS config
cd backend/onlinebookstore
grep CORS_ALLOWED_ORIGINS .env

# 2. Should output:
CORS_ALLOWED_ORIGINS=http://localhost:8080,http://localhost:8081,...

# 3. If not found, check bootstrap/app.php
grep HandleCors bootstrap/app.php

# 4. Should output:
$middleware->append(\App\Http\Middleware\HandleCors::class);

# 5. If not there, add it manually (see CORS_SECURITY_FIX.md)
```

---

### Problem: Backend Won't Start

```
Port 8000 already in use
```

**Solution:**
```bash
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Try again
php artisan serve --port=8000

# Or use different port
php artisan serve --port=8001
# Update .env: VITE_API_URL=http://localhost:8001
```

---

### Problem: Frontend Won't Start

```
Port 8080 already in use
```

**Solution:**
```bash
# Use different port
npm run dev -- --port 8081

# Or find and kill process
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

---

### Problem: 500 Error from Backend

```
GET http://localhost:8000/api/cart 500 (Internal Server Error)
```

**Solution:**
```bash
# Check Laravel logs
cd backend/onlinebookstore
tail -f storage/logs/laravel.log

# Or view last errors
Get-Content storage/logs/laravel.log -Tail 50

# Common fixes:
php artisan config:clear
php artisan cache:clear
php artisan migrate
```

---

## 📊 Working System Diagram

```
┌─────────────────────────────────────────────────────────┐
│           Your Local Development Setup                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Browser: http://localhost:8080                         │
│  ├─ React App (npm run dev)                             │
│  │  └─ Uses VITE_API_URL=http://localhost:8000          │
│  │                                                       │
│  ├─ Login Form                                          │
│  │  └─ POST http://localhost:8000/auth/login            │
│  │                                                       │
│  ├─ Cart Context                                        │
│  │  └─ GET http://localhost:8000/api/cart               │
│  │  └─ POST http://localhost:8000/api/cart              │
│  │                                                       │
│  └─ DevTools (F12) for debugging                        │
│                                                          │
│  ↕ (CORS Headers validated here)                        │
│                                                          │
│  Laravel API: http://localhost:8000                     │
│  ├─ CORS Middleware (HandleCors.php)                    │
│  │  └─ Checks: Is localhost:8080 allowed? YES ✅        │
│  │                                                       │
│  ├─ Routes                                              │
│  │  ├─ POST /auth/register                              │
│  │  ├─ POST /auth/login                                 │
│  │  ├─ GET /api/cart (protected)                        │
│  │  └─ POST /api/cart (protected)                       │
│  │                                                       │
│  ├─ Authentication (Sanctum)                            │
│  │  └─ Validates tokens from frontend                   │
│  │                                                       │
│  └─ MySQL Database                                      │
│     ├─ Users                                            │
│     ├─ Carts (per-user)                                 │
│     ├─ CartItems                                        │
│     └─ Books                                            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Success Indicators

✅ You're done when you see:

1. **Backend Started:**
   ```
   Laravel development server started: http://127.0.0.1:8000
   ```

2. **Frontend Started:**
   ```
   ➜  Local:   http://localhost:8080/
   ```

3. **Login Page Loads:**
   - http://localhost:8080/login works
   - Shows email/password form
   - No errors in console

4. **Login Works:**
   - Can enter credentials
   - Click login
   - No CORS errors
   - Redirects to dashboard or cart

5. **Cart Works:**
   - Can see cart
   - Can add items
   - Items appear instantly (optimistic update)

---

## 📚 Documentation Files

For detailed information, see:

| File | Purpose |
|------|---------|
| `CORS_SECURITY_FIX.md` | CORS setup and testing |
| `COMPLETE_CORS_FIX_GUIDE.md` | Comprehensive security guide |
| `CHANGES_SUMMARY.md` | What was fixed and why |
| `QUICK_REFERENCE.md` | useCart() hook examples |
| `COMPLETION_CHECKLIST.md` | Full verification checklist |

---

## 🔄 Development Workflow

### Daily Development

1. **Terminal 1: Backend**
   ```bash
   cd backend/onlinebookstore
   php artisan serve --port=8000
   ```

2. **Terminal 2: Frontend**
   ```bash
   cd frontend/cozy-bookstore-main
   npm run dev
   ```

3. **Browser:** http://localhost:8080

4. **Modify Code:** 
   - Frontend: Changes auto-reload (HMR)
   - Backend: Changes require restart (or use watch)

5. **Debug:** F12 → Console/Network tabs

---

## 🚀 Next Steps

1. ✅ Start both servers
2. ✅ Test login
3. ✅ Test cart operations
4. ✅ Check console for errors
5. ✅ Review documentation
6. ✅ Deploy to production

---

## 📞 If Something Goes Wrong

1. **Check console (F12):** What error is shown?
2. **Check backend logs:** `storage/logs/laravel.log`
3. **Check network tab:** What requests failed?
4. **See troubleshooting section** above
5. **Read CORS_SECURITY_FIX.md** for detailed solutions

---

**You're all set! Happy coding! 🎉**
