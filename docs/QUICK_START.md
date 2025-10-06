# ⚡ Quick Start Guide

Get the Online Quiz Platform running in under 2 minutes!

---

## 🚀 Start the Application

```bash
# Start all services (Docker required)
docker-compose up -d

# Check status
docker-compose ps
```

**Access Points:**
- Frontend: http://localhost:3000
- Backend: http://localhost:4000

---

## 🔑 Demo Credentials

**Admin:** admin@demo.com / demo123  
**Students:** alice@demo.com / demo123, bob@demo.com / demo123

---

## 📝 Quick Test

1. Login as alice@demo.com
2. Start a quiz
3. Grant camera/microphone permissions
4. Try triggering violations:
   - Look away for 3+ seconds
   - Turn head significantly
   - Move closer/away from camera

---

## 🛠️ Common Commands

```bash
# View logs
docker-compose logs -f backend

# Restart service
docker-compose restart backend

# Stop all
docker-compose down

# Rebuild
docker-compose up -d --build
```

---

## 🐛 Quick Fixes

**Camera not working?** Allow permissions in browser settings  
**Backend error?** Run: `docker-compose logs backend`  
**Port conflict?** Check: `netstat -ano | findstr :3000`

---

**Full docs:** See `README.md` and `TESTING_GUIDE.md`
