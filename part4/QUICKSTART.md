# Quick Start Guide - HBnB Part 4

## 🚀 How to View Your Web Client

### Method 1: Python HTTP Server (Recommended)

1. **Open Terminal/PowerShell** in the `part4` directory:
   ```powershell
   cd C:\Users\96650\Downloads\holbertonschool-hbnb\part4
   ```

2. **Start the server**:
   ```powershell
   python -m http.server 8000
   ```

3. **Open in browser**:
   ```
   http://localhost:8000
   ```

4. **To stop the server**: Press `Ctrl+C` in terminal

### Method 2: Open HTML Files Directly

Simply double-click any HTML file to open in your default browser:
- `index.html` - Main page
- `login.html` - Login page
- `place.html` - Place details
- `add_review.html` - Add review form

**Note**: Some features may not work correctly when opening files directly (file:// protocol).

## 📱 Pages to View

1. **Main Page** → `index.html`
   - Browse all places
   - Filter by country
   - Click any card to view details

2. **Login Page** → `login.html`
   - Email and password form
   - Try submitting to see validation

3. **Place Details** → `place.html`
   - View detailed place information
   - See host info and amenities
   - Read reviews

4. **Add Review** → `add_review.html`
   - Rating selector
   - Review text with character counter
   - Form validation demo

## ✅ What to Check

- [ ] All pages load without errors
- [ ] CSS styling is applied
- [ ] Responsive design works (resize browser)
- [ ] Navigation links work
- [ ] Forms show validation messages

## 🔍 Validate Your HTML

Visit https://validator.w3.org/ and upload each HTML file:
- index.html
- login.html
- place.html
- add_review.html

**Expected Result**: ✅ No errors or warnings

## 📚 Next Steps

After verifying Task 0 (Design) is complete:

- **Task 2**: Implement login functionality (login.js)
- **Task 3**: Implement places listing (index.js)
- **Task 4**: Implement place details (place.js)
- **Task 5**: Implement add review (add_review.js)

## 🆘 Troubleshooting

**CSS not loading?**
- Ensure `styles.css` is in the same directory as HTML files
- Check browser console for errors (F12)

**Links not working?**
- Make sure you're using a web server (Method 1)
- File paths may not work with file:// protocol

**JavaScript errors?**
- This is normal! JavaScript functionality will be added in Tasks 2-5
- Current JS files are placeholders

## 📖 Documentation

- See [README.md](README.md) for full documentation
- See [TESTING.md](TESTING.md) for testing checklist
- See [images/README.md](images/README.md) for image guidelines

---

**Enjoy exploring your HBnB web client!** 🏠✨
