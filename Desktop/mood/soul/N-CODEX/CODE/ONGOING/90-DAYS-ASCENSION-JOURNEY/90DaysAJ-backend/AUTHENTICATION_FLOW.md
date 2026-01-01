# 🔐 Authentication Flow with Supabase

## How Authentication Works Now

### ✅ Users Register Through Your Backend API

Users **don't need to create accounts in Supabase directly**. They register through your backend API endpoints, and your backend automatically creates the user in Supabase Auth.

## 📋 Authentication Flow

### 1. **User Registration** (Frontend → Backend → Supabase)
```
User fills form → Frontend calls POST /v1/auth/register
→ Backend validates → Backend calls Supabase Auth API
→ Supabase creates user → Backend returns tokens to Frontend
```

### 2. **User Login** (Frontend → Backend → Supabase)
```
User enters credentials → Frontend calls POST /v1/auth/login
→ Backend calls Supabase Auth API
→ Supabase validates → Backend returns tokens to Frontend
```

### 3. **Protected Routes** (Frontend → Backend → Supabase)
```
Frontend sends token → Backend verifies with Supabase
→ Supabase validates token → Backend allows access
```

## 🎯 What This Means

### ✅ **You DON'T Need To:**
- ❌ Manually create user accounts in Supabase dashboard
- ❌ Set up authentication in Supabase dashboard (it's automatic)
- ❌ Configure auth providers (handled by backend)

### ✅ **Users DO:**
- ✅ Register through your frontend (which calls your backend API)
- ✅ Login through your frontend (which calls your backend API)
- ✅ Get authenticated automatically via Supabase

## 🧪 Testing Authentication

### Test Registration:
```powershell
curl -X POST http://localhost:4000/v1/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"Test1234!\"}'
```

This will:
1. Create the user in Supabase Auth (automatically)
2. Return access and refresh tokens
3. User is now registered and can login

### Test Login:
```powershell
curl -X POST http://localhost:4000/v1/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"test@example.com\",\"password\":\"Test1234!\"}'
```

## 📍 Where Users Are Stored

- **Supabase Auth**: Users are stored in Supabase's `auth.users` table
- **Your Database**: You can optionally store additional user data in your own tables
- **Access**: Users are managed through your backend API, not directly in Supabase

## 🔍 Viewing Users in Supabase

If you want to see registered users:
1. Go to Supabase Dashboard
2. Click **Authentication** in the left sidebar
3. Click **Users** tab
4. You'll see all users registered through your backend API

## 🎉 Summary

**No manual account creation needed!** 

- Users register through your backend API (`/v1/auth/register`)
- Your backend automatically creates them in Supabase Auth
- Everything is handled automatically
- Users appear in Supabase Dashboard → Authentication → Users automatically

Your authentication is fully integrated and working! 🚀

