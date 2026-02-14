# HBnB Part 4 - Testing Guide for Task 0 (Design)

## ✅ Testing Checklist for Task 0

This guide helps you verify that your implementation meets all Task 0 requirements.

## 1. File Structure Verification

Check that all required files exist:

```bash
part4/
├── ✅ index.html
├── ✅ login.html
├── ✅ place.html
├── ✅ add_review.html
├── ✅ styles.css
├── ✅ README.md
├── scripts/
│   ├── ✅ index.js
│   ├── ✅ login.js
│   ├── ✅ place.js
│   └── ✅ add_review.js
└── images/
    └── ✅ README.md
```

## 2. W3C HTML Validation

All HTML files MUST pass W3C validation with **0 errors**.

### Online Validation
1. Visit: https://validator.w3.org/
2. Select "Validate by File Upload" or "Validate by Direct Input"
3. Test each HTML file:
   - [ ] index.html
   - [ ] login.html
   - [ ] place.html
   - [ ] add_review.html

### Expected Result
```
✅ Document checking completed. No errors or warnings to show.
```

### Command Line Validation (Optional)
Install `html5validator`:
```bash
pip install html5validator
html5validator --root part4/ --also-check-css
```

## 3. CSS Validation

Validate styles.css:

1. Visit: https://jigsaw.w3.org/css-validator/
2. Upload or paste `styles.css`
3. Check for errors

**Note**: Warnings about CSS variables or modern features are acceptable.

## 4. Required CSS Classes Verification

Open your browser's DevTools and verify these classes exist and are styled:

### Header Classes
- [ ] `.logo` - Exists in all pages, styled with primary color
- [ ] `.login-button` - Exists in header navigation

### Place Card Classes (index.html)
- [ ] `.place-card` - Container for each place
- [ ] `.details-button` - Button on each card

### Place Details Classes (place.html)
- [ ] `.place-details` - Main container
- [ ] `.place-info` - Information section
- [ ] `.review-card` - Each review container

### Form Classes
- [ ] `.add-review` - Add review container
- [ ] `.form` - Form styling class

## 5. Fixed CSS Parameters Verification

Use browser DevTools to inspect `.place-card` and `.review-card`:

### Required Values:
```css
margin: 20px;           /* ✅ Check computed style */
padding: 10px;          /* ✅ Check computed style */
border: 1px solid #ddd; /* ✅ Check computed style */
border-radius: 10px;    /* ✅ Check computed style */
```

### How to Check:
1. Open any page in browser
2. Right-click on a place card or review card
3. Select "Inspect" or "Inspect Element"
4. Check the "Computed" tab in DevTools
5. Verify the values match exactly

## 6. Page Content Verification

### login.html
- [ ] Header with logo
- [ ] Email input field (type="email", required)
- [ ] Password input field (type="password", required)
- [ ] Submit button
- [ ] Link back to index.html
- [ ] Footer with copyright

### index.html
- [ ] Header with logo and login button
- [ ] Country filter dropdown
- [ ] At least 3-5 sample place cards
- [ ] Each card has: title, price, description, location, details button
- [ ] Footer with copyright

### place.html
- [ ] Header with logo and navigation
- [ ] Place title and price
- [ ] Description section
- [ ] Host information
- [ ] Location coordinates
- [ ] Amenities list
- [ ] Reviews section with sample reviews
- [ ] "Add Review" button (can be hidden)
- [ ] Footer with copyright

### add_review.html
- [ ] Header with logo
- [ ] Rating dropdown (1-5 stars)
- [ ] Review textarea (minlength=10, maxlength=1000)
- [ ] Character counter
- [ ] Cancel and Submit buttons
- [ ] Footer with copyright

## 7. Semantic HTML Verification

Check that pages use proper semantic elements:

- [ ] `<header>` for page header
- [ ] `<nav>` for navigation
- [ ] `<main>` for main content
- [ ] `<section>` for content sections
- [ ] `<footer>` for page footer
- [ ] `<form>` for forms
- [ ] Proper heading hierarchy (h1, h2, h3)

## 8. Responsive Design Testing

### Desktop (1200px+)
1. Open page in browser
2. Resize to full width
3. Verify:
   - [ ] Places grid shows multiple columns
   - [ ] Header navigation is horizontal
   - [ ] All content is readable

### Tablet (768px)
1. Open DevTools (F12)
2. Click "Toggle Device Toolbar" (Ctrl+Shift+M)
3. Select "iPad" or set width to 768px
4. Verify:
   - [ ] Places grid adjusts to fewer columns
   - [ ] Navigation stacks or adjusts
   - [ ] Content remains readable

### Mobile (375px)
1. In DevTools, select "iPhone SE" or set width to 375px
2. Verify:
   - [ ] Places show in single column
   - [ ] Buttons are full width
   - [ ] Text is readable without zooming
   - [ ] No horizontal scrolling

## 9. Visual Design Testing

### Color Scheme
Open `styles.css` and verify CSS variables:
```css
--primary-color: #FF5A5F;
--secondary-color: #00A699;
--dark-color: #484848;
```

### Typography
- [ ] Font family is applied (Segoe UI or fallback)
- [ ] Text is readable (good contrast)
- [ ] Headings stand out from body text

### Spacing & Layout
- [ ] Consistent spacing between elements
- [ ] Cards have proper margins
- [ ] Forms have adequate padding
- [ ] No elements overlap

## 10. Browser Testing

Test in multiple browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)

### What to Check:
- All pages load correctly
- CSS is applied properly
- Layout looks consistent
- No console errors

## 11. Navigation Testing

Verify all links work:

### From index.html:
- [ ] Logo links to index.html
- [ ] Login button links to login.html
- [ ] Each place card links to place.html (with ?id parameter)
- [ ] Details buttons link to place.html

### From login.html:
- [ ] "Back to Home" links to index.html

### From place.html:
- [ ] "Back to Places" links to index.html
- [ ] Logo links to index.html
- [ ] "Add Review" button links to add_review.html (with ?place_id parameter)

### From add_review.html:
- [ ] "Back to Places" links to index.html
- [ ] Logo links to index.html

## 12. Form Validation Testing

### login.html
1. Try to submit empty form
   - [ ] Browser shows validation errors
2. Enter invalid email
   - [ ] Browser validates email format
3. Enter short password (less than 6 chars)
   - [ ] Browser enforces minlength

### add_review.html
1. Try to submit without selecting rating
   - [ ] Browser requires rating selection
2. Enter less than 10 characters in review
   - [ ] Browser enforces minlength
3. Type in textarea
   - [ ] Character counter updates in real-time
4. Try to type more than 1000 characters
   - [ ] Form enforces maxlength

## 13. Accessibility Testing

### Keyboard Navigation
1. Use Tab key to navigate through page
   - [ ] All interactive elements are reachable
   - [ ] Focus indicators are visible
   - [ ] Tab order is logical

### Screen Reader (Optional)
1. Use a screen reader (NVDA, JAWS, or VoiceOver)
2. Navigate through pages
   - [ ] All content is announced
   - [ ] Form labels are associated with inputs
   - [ ] Images have alt text (if added)

## 14. Performance Check

### Page Load
1. Open browser DevTools Network tab
2. Reload each page
3. Verify:
   - [ ] Pages load quickly (< 1 second)
   - [ ] styles.css loads successfully
   - [ ] No 404 errors (except for optional images)

## 15. Console Errors Check

For each page:
1. Open DevTools Console (F12)
2. Check for errors
3. Expected:
   - [ ] No CSS errors
   - [ ] No HTML parsing errors
   - [ ] JavaScript console logs (from placeholder scripts) are OK

## Testing Commands

### Start Local Server
```bash
# Navigate to part4 directory
cd part4

# Start Python HTTP server
python -m http.server 8000

# Open in browser
# http://localhost:8000
```

### Automated HTML Validation
```bash
# Install validator
pip install html5validator

# Run validation
html5validator part4/index.html
html5validator part4/login.html
html5validator part4/place.html
html5validator part4/add_review.html
```

## Common Issues & Solutions

### Issue: CSS not loading
**Solution**: Check file path in HTML `<link>` tag, ensure `styles.css` is in same directory

### Issue: W3C validation fails
**Solution**: Check for:
- Unclosed tags
- Missing required attributes
- Invalid HTML structure

### Issue: Responsive design not working
**Solution**: Ensure viewport meta tag exists:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### Issue: Forms don't validate
**Solution**: Check `required` and `minlength` attributes are present

## Documentation Checklist

- [ ] README.md exists and is complete
- [ ] All CSS classes are documented
- [ ] Color scheme is documented
- [ ] File structure is clear
- [ ] Setup instructions are provided

## Final Verification

Before submitting, ensure:

- [ ] All 4 HTML pages pass W3C validation (0 errors)
- [ ] All required CSS classes exist and are styled
- [ ] Fixed CSS parameters are correctly applied
- [ ] Responsive design works on all screen sizes
- [ ] Navigation links work correctly
- [ ] Forms have proper validation
- [ ] Semantic HTML is used throughout
- [ ] README.md is complete and accurate

## Success Criteria

Your Task 0 implementation is complete when:

✅ All HTML files are W3C valid  
✅ All required CSS classes exist with correct styling  
✅ Fixed parameters (margin, padding, border, border-radius) are applied  
✅ Responsive design works on desktop, tablet, and mobile  
✅ All 4 pages are visually consistent  
✅ Navigation between pages works correctly  
✅ Forms have HTML5 validation  
✅ Code uses semantic HTML5 elements  

---

**Good luck with your testing!** 🚀
