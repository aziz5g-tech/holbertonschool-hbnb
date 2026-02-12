# Task 1: Login Functionality - Implementation Guide

## ✅ Task 1 Completed

### Overview
Login functionality has been successfully implemented with full API integration, JWT token management, and comprehensive error handling.

---

## 📋 What Was Implemented

### 1. Complete Login Functionality (`scripts/login.js`)

#### Core Features:
- ✅ Form submission handling with `preventDefault`
- ✅ AJAX request using Fetch API
- ✅ JWT token storage in cookies
- ✅ Automatic redirect to index.html on success
- ✅ Error message display on failure
- ✅ Client-side validation
- ✅ Loading states with spinner
- ✅ Already logged-in check

### 2. Cookie Management Functions

```javascript
✅ setCookie(name, value, days) - Store JWT token
✅ getCookie(name) - Retrieve token
✅ deleteCookie(name) - Remove token
```

### 3. Authentication Functions

```javascript
✅ checkIfLoggedIn() - Check and redirect if already authenticated
✅ validateEmail(email) - Email format validation
✅ handleLogin(event) - Main login handler
```

### 4. UI Helper Functions

```javascript
✅ showError(element, message) - Display error messages
✅ showSuccess(message) - Display success messages
✅ setLoadingState(..., isLoading) - Toggle loading spinner
```

---

## 🔧 Configuration

### API Endpoint
```javascript
const API_BASE_URL = 'http://localhost:5001/api/v1';
const LOGIN_ENDPOINT = `${API_BASE_URL}/users/login`;
```

### Request Format
```json
POST /api/v1/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Response Format (Success)
```json
HTTP 200 OK
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "is_admin": false
  }
}
```

---

## 🎯 Requirements Met

### Task Requirements Checklist

- ✅ **Event Listener Setup**: Form submission handler with `preventDefault()`
- ✅ **AJAX Request**: Fetch API POST request to login endpoint
- ✅ **Content-Type Header**: Set to `application/json`
- ✅ **Request Body**: Email and password sent as JSON object
- ✅ **Token Storage**: JWT token stored in cookie on success
- ✅ **Redirect**: User redirected to `index.html` after successful login
- ✅ **Error Handling**: Error messages displayed on login failure

---

## 🔒 Security Features

### Token Storage
- JWT token stored in HTTP cookie
- Cookie expires in 1 day (configurable)
- SameSite=Lax flag for CSRF protection
- Path set to `/` for site-wide access

### Validation
- Email format validation (regex)
- Password minimum length check (6 characters)
- Client-side validation before API call
- Server response validation

### Error Handling
- Network error handling
- HTTP status code handling
- Specific error messages for different scenarios
- Connection error detection

---

## 🧪 Testing Guide

### Prerequisites
1. **Backend API must be running**:
   ```bash
   cd part3
   python run.py
   ```
   Should be running on `http://localhost:5001`

2. **Frontend server running**:
   ```bash
   cd part4
   python -m http.server 8000
   ```
   Access at `http://localhost:8000`

### Test Cases

#### Test 1: Valid Login ✅
**Steps**:
1. Open `http://localhost:8000/login.html`
2. Enter valid credentials:
   - Email: `user@example.com`
   - Password: `password123`
3. Click "Login"

**Expected Result**:
- Loading spinner appears
- Success message shown
- Redirected to `index.html`
- JWT token stored in cookie
- User info stored in localStorage

**Verification**:
```javascript
// Open browser console (F12)
console.log(document.cookie); // Should show token
console.log(localStorage.getItem('user_info')); // Should show user data
```

---

#### Test 2: Invalid Credentials ❌
**Steps**:
1. Open `http://localhost:8000/login.html`
2. Enter invalid credentials:
   - Email: `wrong@example.com`
   - Password: `wrongpass`
3. Click "Login"

**Expected Result**:
- Error message displayed: "Invalid email or password. Please try again."
- User remains on login page
- No token stored

---

#### Test 3: Empty Fields ⚠️
**Steps**:
1. Open `http://localhost:8000/login.html`
2. Leave email or password empty
3. Click "Login"

**Expected Result**:
- Error message: "Please enter both email and password."
- No API request made

---

#### Test 4: Invalid Email Format 📧
**Steps**:
1. Open `http://localhost:8000/login.html`
2. Enter invalid email: `notanemail`
3. Enter any password
4. Click "Login"

**Expected Result**:
- Error message: "Please enter a valid email address."
- No API request made

---

#### Test 5: Short Password 🔑
**Steps**:
1. Open `http://localhost:8000/login.html`
2. Enter valid email
3. Enter password with less than 6 characters: `pass`
4. Click "Login"

**Expected Result**:
- Error message: "Password must be at least 6 characters long."
- No API request made

---

#### Test 6: Backend Not Running 🔌
**Steps**:
1. Stop the backend API server
2. Try to login with any credentials

**Expected Result**:
- Error message: "Cannot connect to the API server. Please ensure the backend is running on http://localhost:5001/api/v1"

---

#### Test 7: Already Logged In 🔄
**Steps**:
1. Login successfully
2. Try to access `login.html` again

**Expected Result**:
- Automatically redirected to `index.html`
- Cannot access login page while logged in

---

### Browser Console Testing

Open browser console (F12) and test cookie functions:

```javascript
// Check if token exists
console.log(document.cookie);

// Check user info
console.log(localStorage.getItem('user_info'));

// Manually test cookie functions
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

console.log('Token:', getCookie('token'));
```

---

## 🔍 Debugging

### Common Issues

#### Issue 1: CORS Error
**Error**: `Access to fetch at 'http://localhost:5001/api/v1/users/login' has been blocked by CORS policy`

**Solution**:
Add Flask-CORS to backend (part3):
```bash
cd part3
pip install flask-cors
```

Update `part3/hbnb/app/__init__.py`:
```python
from flask_cors import CORS

def create_app(config_class="config.DevelopmentConfig"):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Enable CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:8000", "http://127.0.0.1:8000"],
            "methods": ["GET", "POST", "PUT", "DELETE"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # ... rest of code
```

---

#### Issue 2: Token Not Stored
**Symptoms**: Login seems successful but token not in cookies

**Solution**:
1. Check browser console for errors
2. Verify cookie is set:
   ```javascript
   console.log(document.cookie);
   ```
3. Check browser cookie settings (ensure cookies are enabled)
4. Try clearing all cookies and retry

---

#### Issue 3: API Not Responding
**Symptoms**: "Cannot connect to the API server"

**Checklist**:
1. ✅ Backend running on `http://localhost:5001`
   ```bash
   cd part3
   python run.py
   ```
2. ✅ No firewall blocking port 5001
3. ✅ Check backend logs for errors
4. ✅ Test API directly:
   ```bash
   curl -X POST http://localhost:5001/api/v1/users/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password"}'
   ```

---

#### Issue 4: Redirect Not Working
**Symptoms**: Login successful but stays on login page

**Solution**:
1. Check browser console for JavaScript errors
2. Verify `window.location.href = 'index.html'` is executing
3. Check if there are popup blockers preventing navigation
4. Ensure `index.html` exists in same directory

---

## 📊 Implementation Details

### File Modified
- **`scripts/login.js`** (300+ lines)

### Functions Implemented
| Function | Lines | Purpose |
|----------|-------|---------|
| `setCookie()` | ~10 | Store JWT token in cookie |
| `getCookie()` | ~8 | Retrieve token from cookie |
| `deleteCookie()` | ~5 | Remove token |
| `checkIfLoggedIn()` | ~8 | Check authentication status |
| `validateEmail()` | ~5 | Email format validation |
| `handleLogin()` | ~100 | Main login handler |
| `showError()` | ~10 | Display error messages |
| `showSuccess()` | ~12 | Display success messages |
| `setLoadingState()` | ~12 | Toggle loading UI |
| Event Listeners | ~40 | Form submission, Enter key, input clearing |

### Total Lines of Code
- **~300 lines** of production-ready JavaScript
- Full error handling
- Comprehensive validation
- User-friendly UI feedback

---

## 🎨 UI Features

### Loading States
- Button text changes to spinner during API call
- Button disabled during loading
- Visual feedback for user

### Error Messages
- Red background with error icon
- Specific messages for different error types
- Auto-scrolls to error message

### Success Messages
- Green background with success icon
- Smooth transition to redirect

### Input Validation
- Real-time error clearing on input
- Enter key support for submission
- Focus management

---

## 🔐 Cookie Configuration

```javascript
Cookie Name: token
Cookie Value: JWT token string
Expires: 1 day from login
Path: /
SameSite: Lax
```

**Why these settings?**
- **1 day expiration**: Balance between convenience and security
- **Path=/**: Token available site-wide
- **SameSite=Lax**: CSRF protection while allowing normal navigation

---

## 📝 User Info Storage

In addition to JWT token, user information is stored in localStorage:

```javascript
{
  "id": "user-uuid",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "is_admin": false
}
```

**Purpose**: Quick access to user info without decoding JWT

---

## 🚀 Next Steps

After successful login:
1. User is redirected to `index.html`
2. Token is available in cookie for API requests
3. User info available in localStorage
4. Ready for Tasks 3-5 (using authenticated endpoints)

---

## 📚 Resources Used

- [Fetch API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Cookie API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie)
- [HTML5 Form Validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation)
- [JWT Introduction](https://jwt.io/introduction)

---

## ✅ Task 1 Status: COMPLETE

**All requirements met**:
- ✅ Event listener for form submission
- ✅ AJAX request to API
- ✅ JWT token storage in cookie
- ✅ Redirect on success
- ✅ Error message on failure
- ✅ Client-side validation
- ✅ Loading states
- ✅ Security best practices

**Ready for testing and Task 2 implementation!**

---

*Implementation Date: February 12, 2026*  
*Task: Task 1 - Login Functionality*  
*File: scripts/login.js*
