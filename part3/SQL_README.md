# Task 9: SQL Scripts for Database Setup

This directory contains SQL scripts and Python utilities to create and populate the HBnB database.

## 📁 Files Overview

### SQL Files
- **`schema.sql`** - Database schema with all tables, relationships, and constraints
- **`seed.sql`** - Template for initial data (admin user and amenities)
- **`seed_updated.sql`** - Generated file with hashed admin password (auto-generated)

### Python Scripts
- **`setup_database.py`** - Generates bcrypt hash for admin password and updates seed.sql
- **`run_sql_scripts.py`** - Executes SQL scripts to create and populate the database
- **`test_crud.py`** - Comprehensive CRUD operations testing suite

## 🗄️ Database Schema

### Tables

1. **users**
   - `id` (CHAR(36), PRIMARY KEY)
   - `first_name` (VARCHAR(255))
   - `last_name` (VARCHAR(255))
   - `email` (VARCHAR(255), UNIQUE)
   - `password` (VARCHAR(255))
   - `is_admin` (BOOLEAN)
   - `created_at`, `updated_at` (TIMESTAMP)

2. **places**
   - `id` (CHAR(36), PRIMARY KEY)
   - `title` (VARCHAR(255))
   - `description` (TEXT)
   - `price` (DECIMAL(10,2))
   - `latitude`, `longitude` (FLOAT)
   - `owner_id` (CHAR(36), FK → users.id)
   - `created_at`, `updated_at` (TIMESTAMP)

3. **reviews**
   - `id` (CHAR(36), PRIMARY KEY)
   - `text` (TEXT)
   - `rating` (INTEGER, CHECK 1-5)
   - `user_id` (CHAR(36), FK → users.id)
   - `place_id` (CHAR(36), FK → places.id)
   - `created_at`, `updated_at` (TIMESTAMP)
   - UNIQUE constraint on (user_id, place_id)

4. **amenities**
   - `id` (CHAR(36), PRIMARY KEY)
   - `name` (VARCHAR(255), UNIQUE)
   - `created_at`, `updated_at` (TIMESTAMP)

5. **place_amenity** (Many-to-Many)
   - `place_id` (CHAR(36), FK → places.id)
   - `amenity_id` (CHAR(36), FK → amenities.id)
   - PRIMARY KEY (place_id, amenity_id)

### Relationships
- User → Places (One-to-Many) with CASCADE DELETE
- User → Reviews (One-to-Many) with CASCADE DELETE
- Place → Reviews (One-to-Many) with CASCADE DELETE
- Place ↔ Amenities (Many-to-Many) with CASCADE DELETE

### Indexes
- `idx_places_owner_id` on places(owner_id)
- `idx_reviews_user_id` on reviews(user_id)
- `idx_reviews_place_id` on reviews(place_id)
- `idx_users_email` on users(email)

## 🚀 Usage

### Step 1: Generate Password Hash
```bash
python setup_database.py
```
This will:
- Generate bcrypt hash for admin password `admin1234`
- Create `seed_updated.sql` with the hashed password

### Step 2: Create Database
```bash
python run_sql_scripts.py
```
This will:
- Remove old database if exists
- Execute `schema.sql` to create tables
- Execute `seed_updated.sql` to insert initial data
- Verify the database structure

### Step 3: Test CRUD Operations
```bash
python test_crud.py
```
This will test:
- CREATE operations (users, places, reviews, amenities)
- READ operations (simple and complex queries with JOINs)
- UPDATE operations
- DELETE operations with cascade
- Constraint validations (foreign keys, unique, check)

## 📊 Initial Data

### Admin User
- **ID**: `36c9050e-ddd3-4c3b-9731-9f487208bbc1` (fixed)
- **Email**: `admin@hbnb.io`
- **Password**: `admin1234`
- **Name**: Admin HBnB
- **Is Admin**: True

### Amenities
1. **WiFi** - ID: `a1b2c3d4-e5f6-4a5b-9c8d-1e2f3a4b5c6d`
2. **Swimming Pool** - ID: `b2c3d4e5-f6a7-5b6c-ad9e-2f3a4b5c6d7e`
3. **Air Conditioning** - ID: `c3d4e5f6-a7b8-6c7d-be0f-3a4b5c6d7e8f`

## ✅ Validation Tests

The `test_crud.py` script validates:

1. ✅ Admin user creation with correct attributes
2. ✅ All 3 amenities inserted
3. ✅ Foreign key constraints enforcement
4. ✅ Unique constraint on (user_id, place_id) in reviews
5. ✅ Check constraint on rating (1-5)
6. ✅ Cascade delete operations
7. ✅ Complex queries with JOINs
8. ✅ Index creation for performance

## 🔧 Database File

The database is created as: **`hbnb_database.db`**

To view the database:
```bash
sqlite3 hbnb_database.db
```

Useful SQLite commands:
```sql
.tables                          -- List all tables
.schema users                    -- Show table structure
SELECT * FROM users;            -- Query data
.indexes                         -- List all indexes
PRAGMA foreign_keys;            -- Check FK status
```

## 📝 Notes

- Foreign keys are enabled with `PRAGMA foreign_keys = ON`
- All timestamps use `CURRENT_TIMESTAMP` by default
- UUIDs are stored as CHAR(36) strings
- Password is hashed using bcrypt with cost factor 12
- One user can only review a place once (unique constraint)
- Deleting a user cascades to their places and reviews
- Deleting a place cascades to its reviews and amenity links

## 🎯 Task 9 Requirements

✅ SQL scripts for all tables with proper relationships  
✅ Foreign key constraints defined  
✅ Unique constraints where needed  
✅ Check constraints for data validation  
✅ Administrator user with fixed UUID  
✅ Initial amenities with UUIDs  
✅ Password properly hashed with bcrypt  
✅ CRUD operations tested and verified  

## 🔗 Related Tasks

- **Task 8**: SQLAlchemy relationship mappings
- **Task 7**: Entity mapping for Place, Review, Amenity
- **Task 6**: User entity mapping
- **Task 5**: SQLAlchemy repository implementation
