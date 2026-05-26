# Quick Testing & Deployment Guide

## PRE-DEPLOYMENT CHECKLIST

### 1. Database Setup
```bash
# Open phpMyAdmin or MySQL CLI
mysql -u root -p dairy_farm_saas < database/schema.sql
```

Verify tables exist:
```sql
SHOW TABLES;
SELECT * FROM product_enquiries LIMIT 1;
SELECT * FROM contact_messages LIMIT 1;
```

### 2. Frontend Dependencies
```bash
cd frontend
npm install
```

### 3. Start Development Server
```bash
npm start
```

The application will run on: **http://localhost:3000**

---

## TESTING WORKFLOWS

### ✅ TEST 1: Marketing Website Navigation

**URL**: http://localhost:3000/

**Steps**:
1. [ ] Visit homepage - should see Hero section with animations
2. [ ] Click "Home" in navbar - should stay on homepage  
3. [ ] Click "Products" in navbar - should navigate to /products
4. [ ] Click "About Us" in navbar - should navigate to /about
5. [ ] Click "Contact Us" in navbar - should navigate to /contact
6. [ ] Check mobile menu (hamburger on mobile) - should expand/collapse
7. [ ] Verify all navbar links highlight correctly
8. [ ] Check sticky navbar behavior on scroll

**Expected**: 
- ✅ All routes work correctly
- ✅ Navbar is sticky on scroll
- ✅ Active link is highlighted
- ✅ Mobile menu responsive

---

### ✅ TEST 2: Homepage

**URL**: http://localhost:3000/

**Steps**:
1. [ ] Hero section displays with animations
2. [ ] All sections visible: Hero, About, Products, Features, Services, Gallery, Testimonials, Stats, Process, Contact
3. [ ] Scroll animations work smoothly
4. [ ] "Explore Products" CTA button works
5. [ ] "Visit Farm" button works
6. [ ] Back to top button appears on scroll

**Expected**:
- ✅ Original hero section preserved
- ✅ All animations work smoothly
- ✅ Page is fully responsive

---

### ✅ TEST 3: Products Page

**URL**: http://localhost:3000/products

**Steps**:
1. [ ] Visit products page
2. [ ] See 4 product cards: Milk, Curd, Paneer, Cheese
3. [ ] Each card shows: Image, Name, Description, Badge, Enquiry button
4. [ ] Hover effects work on cards
5. [ ] Click "Enquiry" on Milk product - modal opens
6. [ ] Product name is auto-filled in modal
7. [ ] Modal form shows all fields
8. [ ] Mobile layout is responsive

**Expected**:
- ✅ All 4 products displayed
- ✅ Enquiry modal opens correctly
- ✅ Product name auto-filled

---

### ✅ TEST 4: Product Enquiry Modal

**Product Page**: http://localhost:3000/products

**Steps**:
1. [ ] Click "Enquiry" on any product
2. [ ] Modal opens with smooth animation
3. [ ] Product name field is pre-filled and read-only
4. [ ] Fill in form fields:
   - Name: "John Doe"
   - Mobile: "9876543210"
   - Address: "123 Main Street, City"
   - Message: "Interested in daily delivery"
5. [ ] Click Submit button
6. [ ] See loading spinner while submitting
7. [ ] Success message appears after submission
8. [ ] Modal closes automatically
9. [ ] Check database: SELECT * FROM product_enquiries;

**Validation Tests**:
1. [ ] Submit with empty Name - shows error
2. [ ] Submit with invalid mobile (less than 10 digits) - shows error
3. [ ] Submit with empty Address - shows error

**Expected**:
- ✅ Form submits successfully
- ✅ Data appears in database
- ✅ Success message shows
- ✅ Validation works correctly

---

### ✅ TEST 5: About Us Page

**URL**: http://localhost:3000/about

**Steps**:
1. [ ] Hero banner displays with gradient
2. [ ] All sections visible:
   - Our Story (with image)
   - Mission & Vision cards
   - Organic Farming Process (4 steps)
   - Healthy Cows section
   - Hygienic Packaging section
   - Daily Fresh Delivery section (3 features)
   - Certifications section (6 cards)
3. [ ] Animations work on scroll
4. [ ] Images load correctly
5. [ ] Card hover effects work
6. [ ] Statistics display properly
7. [ ] Mobile layout responsive

**Expected**:
- ✅ All sections display correctly
- ✅ Professional design maintained
- ✅ Responsive on all devices

---

### ✅ TEST 6: Contact Us Page

**URL**: http://localhost:3000/contact

**Steps**:
1. [ ] Hero banner displays
2. [ ] 4 info cards visible: Address, Phone, Email, Hours
3. [ ] Phone and email links are clickable
4. [ ] Google Map placeholder displays (iframe)
5. [ ] Contact form visible with fields:
   - Name
   - Email
   - Mobile Number
   - Address
   - Message
6. [ ] Fill form:
   - Name: "Jane Smith"
   - Email: "jane@example.com"
   - Mobile: "9876543210"
   - Address: "456 Oak Ave, City"
   - Message: "Need large order pricing"
7. [ ] Click Send Message button
8. [ ] See loading state
9. [ ] Success message appears
10. [ ] Check database: SELECT * FROM contact_messages;

**Validation Tests**:
1. [ ] Submit with invalid email - shows error
2. [ ] Submit with short mobile number - shows error
3. [ ] Submit with empty fields - shows error

**Expected**:
- ✅ Form submits successfully
- ✅ Data saved to database
- ✅ Success message displays

---

### ✅ TEST 7: Admin Panel - Product Enquiries

**URL**: http://localhost:3000/muktifarm/admin/login

**Steps**:
1. [ ] Login with admin credentials (admin@dairyfarm.com / password)
2. [ ] Navigate to dashboard
3. [ ] Click "Product Enquiries" in sidebar (or /muktifarm/admin/enquiries)
4. [ ] See table with columns: Product, Customer, Phone, Date, Status, Actions
5. [ ] Table shows enquiries from TEST 4
6. [ ] Search field works - search for product name
7. [ ] Click Eye icon - modal opens with full details
8. [ ] Modal shows: Customer Name, Mobile, Address, Message, Product Name
9. [ ] Click Trash icon - shows confirmation
10. [ ] Click Delete - record removed from table
11. [ ] Unread enquiries show "New" badge
12. [ ] View enquiry marks it as "Read"

**Expected**:
- ✅ Enquiries list displays
- ✅ Search works
- ✅ View details modal works
- ✅ Delete functionality works
- ✅ Read/Unread status works

---

### ✅ TEST 8: Admin Panel - Contact Messages

**URL**: http://localhost:3000/muktifarm/admin/contact-messages

**Steps**:
1. [ ] Navigate to Contact Messages
2. [ ] See table with columns: Name, Email, Phone, Date, Status, Actions
3. [ ] Table shows messages from TEST 6
4. [ ] Search field works - search for email
5. [ ] Click Eye icon - modal opens
6. [ ] Modal shows: Name, Email, Mobile, Address, Message, Date received
7. [ ] Email and phone are clickable links
8. [ ] Click Delete - record removed
9. [ ] New messages show "New" badge
10. [ ] View message marks it as "Read"

**Expected**:
- ✅ Messages list displays
- ✅ Search works
- ✅ Details modal works
- ✅ Delete works
- ✅ Contact links functional

---

## FULL INTEGRATION TEST

Run these tests in sequence to verify the entire flow:

```bash
1. Start MySQL server
2. Import schema.sql into database
3. Start frontend: npm start
4. Clear browser cache (Ctrl+Shift+Delete)
5. Open http://localhost:3000
```

### Test Sequence:
1. Navigate all marketing pages (/, /products, /about, /contact)
2. Submit product enquiry from /products
3. Submit contact form from /contact
4. Login to admin panel
5. View both enquiries and messages in admin
6. Verify data in database

---

## RESPONSIVE TESTING

### Mobile View (320px):
- [ ] Navbar hamburger menu works
- [ ] All cards stack vertically
- [ ] Forms are readable
- [ ] Buttons are clickable (size > 44px)
- [ ] Images load correctly

### Tablet View (768px):
- [ ] 2-column layouts work
- [ ] Forms are properly aligned
- [ ] Navigation transitions smoothly

### Desktop View (1200px+):
- [ ] Multi-column grids display
- [ ] Hover effects work
- [ ] Navbar is horizontal

---

## BROWSER COMPATIBILITY

Test in these browsers:
- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## CONSOLE CHECKS

After each test, check browser console (F12):
- [ ] No JavaScript errors
- [ ] No 404 errors
- [ ] All API calls succeed (200/201 status)
- [ ] No CORS errors

---

## DATABASE VERIFICATION

After testing, verify data:

```sql
-- Check enquiries
SELECT COUNT(*) as enquiry_count FROM product_enquiries;
SELECT * FROM product_enquiries ORDER BY created_at DESC LIMIT 5;

-- Check messages
SELECT COUNT(*) as message_count FROM contact_messages;
SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 5;

-- Check stats
SELECT 
  product_name, 
  COUNT(*) as count 
FROM product_enquiries 
GROUP BY product_name;
```

---

## PERFORMANCE CHECKS

- [ ] Pages load in < 3 seconds
- [ ] Animations are smooth (60fps)
- [ ] No layout shifts
- [ ] Images are optimized
- [ ] API responses < 500ms

---

## SECURITY CHECKS

- [ ] Form inputs are sanitized on server
- [ ] No sensitive data in URL
- [ ] CORS headers present
- [ ] No SQL injection (test with special characters)
- [ ] Authorization working on admin pages

---

## DEPLOYMENT CHECKLIST

Before going live:
- [ ] Database backup created
- [ ] All tests passed
- [ ] No console errors
- [ ] Responsive design verified
- [ ] Performance optimized
- [ ] Security reviewed
- [ ] Email notifications configured (optional)
- [ ] Analytics configured (optional)
- [ ] SSL/HTTPS enabled
- [ ] Admin credentials changed from default

---

## QUICK START COMMANDS

```bash
# Setup Database
mysql -u root -p dairy_farm_saas < database/schema.sql

# Install Dependencies
cd frontend && npm install

# Start Development
npm start

# Run Tests
npm test

# Build for Production
npm run build
```

---

## SUPPORT & TROUBLESHOOTING

### Issue: Forms not submitting
**Solution**: 
1. Check if PHP server is running
2. Verify database connection in backend/config/database.php
3. Check browser console for errors
4. Verify CORS headers in PHP files

### Issue: Styles not loading
**Solution**:
1. Clear browser cache
2. Check CSS file imports
3. Verify muktifarm styles are imported in main App.jsx

### Issue: Routes not working
**Solution**:
1. Verify React Router is initialized
2. Check route paths match exactly
3. Clear browser cache
4. Check console for routing errors

### Issue: Images not loading
**Solution**:
1. Use full URLs for external images
2. Check image URLs are valid
3. Verify CORS on image server

---

**✅ All systems ready for testing and deployment!**
