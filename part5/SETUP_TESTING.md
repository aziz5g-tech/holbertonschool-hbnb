# 🚀 Quick Setup Guide for Testing Task 1 (Login)

## Prerequisites

Before testing the login functionality, ensure both backend and frontend servers are running.

---

## Step 1: Start Backend API (Part 3)

### Option A: Using PowerShell (Windows)

```powershell
# Navigate to part3 directory
cd C:\Users\96650\Downloads\holbertonschool-hbnb\part3

# Run the backend server
python run.py
```

### Option B: Using separate terminal

1. Open a new terminal/PowerShell window
2. Run:
   ```powershell
   cd C:\Users\96650\Downloads\holbertonschool-hbnb\part3
   python run.py
   ```

**Expected Output**:
```
 * Serving Flask app 'hbnb.app'
 * Debug mode: on
WARNING: This is a development server. Do not use it in a production deployment.
 * Running on http://0.0.0.0:5001
Press CTRL+C to quit
```

**Verification**: Open browser and visit `http://localhost:5001/api/v1/`

---

## Step 2: Enable CORS (If Not Already Done)

If you get CORS errors, add Flask-CORS to your backend:

### Install Flask-CORS:
```powershell
cd C:\Users\96650\Downloads\holbertonschool-hbnb\part3
pip install flask-cors
```

### Update part3/hbnb/app/__init__.py:

Add this import at the top:
```python
from flask_cors import CORS
```

Add CORS configuration after creating the app:
```python
def create_app(config_class="config.DevelopmentConfig"):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Enable CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:8000", "http://127.0.0.1:8000"],
            "methods": ["GET", "POST", "PUT", "DELETE"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })
    
    # ... rest of initialization
```

### Restart the backend server after changes

---

## Step 3: Ensure Frontend Server is Running

The frontend server should already be running from Task 0.

**Check if running**: Open `http://localhost:8000`

**If not running**:
```powershell
cd C:\Users\96650\Downloads\holbertonschool-hbnb\part4
python -m http.server 8000
```

---

## Step 4: Create Test User (If Needed)

If you don't have a test user, create one using the API:

### Using PowerShell:
```powershell
$body = @{
    email = "test@example.com"
    password = "password123"
    first_name = "Test"
    last_name = "User"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5001/api/v1/users/" -Method POST -Body $body -ContentType "application/json"
```

### Using curl (if available):
```bash
curl -X POST http://localhost:5001/api/v1/users/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","first_name":"Test","last_name":"User"}'
```

---

## Step 5: Test Login Functionality

### Test 1: Valid Login
1. Open browser: `http://localhost:8000/login.html`
2. Enter credentials:
   - Email: `test@example.com`
   - Password: `password123`
3. Click "Login"

**Expected**: Redirect to index.html with success message

### Test 2: Check Cookie
After successful login, open browser console (F12) and run:
```javascript
console.log(document.cookie);
// Should show: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Test 3: Check LocalStorage
```javascript
console.log(localStorage.getItem('user_info'));
// Should show user info JSON
```

### Test 4: Invalid Login
1. Open: `http://localhost:8000/login.html`
2. Enter wrong credentials:
   - Email: `wrong@example.com`
   - Password: `wrongpass`
3. Click "Login"

**Expected**: Error message displayed

---

## Troubleshooting

### Issue: "Cannot connect to the API server"

**Solution**:
1. Ensure backend is running: `http://localhost:5001/api/v1/`
2. Check if port 5001 is not blocked
3. Restart backend server

### Issue: CORS Error in Console

**Solution**:
1. Install Flask-CORS: `pip install flask-cors`
2. Update `part3/hbnb/app/__init__.py` as shown above
3. Restart backend

### Issue: "Invalid credentials"

**Solution**:
1. Verify user exists in database
2. Create new user with the commands above
3. Check password is at least 6 characters

### Issue: Cookie Not Set

**Solution**:
1. Check browser allows cookies
2. Clear browser cache and cookies
3. Try in incognito/private mode

---

## Quick Command Reference

### Start Backend:
```powershell
cd C:\Users\96650\Downloads\holbertonschool-hbnb\part3
python run.py
```

### Start Frontend:
```powershell
cd C:\Users\96650\Downloads\holbertonschool-hbnb\part4
python -m http.server 8000
```

### Check Backend Status:
```
Browser: http://localhost:5001/api/v1/
```

### Access Login Page:
```
Browser: http://localhost:8000/login.html
```

---

## Testing Checklist

- [ ] Backend API is running on port 5001
- [ ] Frontend server is running on port 8000
- [ ] CORS is enabled in backend
- [ ] Test user exists in database
- [ ] Login with valid credentials works
- [ ] Token stored in cookie after login
- [ ] Redirect to index.html after login
- [ ] Error message shown for invalid credentials
- [ ] Client-side validation works (empty fields, invalid email, short password)

---

## Next Steps After Testing

Once login is working:
1. Test logout functionality (if implemented)
2. Proceed to Task 2: List of Places
3. Use the JWT token for authenticated API requests

---

**Happy Testing!** 🎉
