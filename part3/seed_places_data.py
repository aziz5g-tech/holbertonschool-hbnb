#!/usr/bin/env python3
"""
Seed sample places data for testing frontend
"""
import sqlite3
import sys
from datetime import datetime

def seed_places():
    """Add sample places to development database"""
    
    # Connect to database
    conn = sqlite3.connect('development.db')
    cursor = conn.cursor()
    
    print("🌱 Seeding sample places data...")
    
    # Insert test user
    try:
        cursor.execute("""
            INSERT OR IGNORE INTO users (id, first_name, last_name, email, password, is_admin, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            '11111111-1111-1111-1111-111111111111',
            'Test',
            'User',
            'test@example.com',
            '$2b$12$JUOegFmtEQiT09qKG7WPIu8woU5x1Fa7G0VDWKy.2Isc5trvv6v9C',  # password123
            0,
            datetime.now().isoformat(),
            datetime.now().isoformat()
        ))
        print("✓ Test user created")
    except Exception as e:
        print(f"⚠ Test user: {e}")
    
    # Sample places data
    places = [
        {
            'id': 'place-001',
            'title': 'Cozy Downtown Apartment',
            'description': 'Beautiful apartment in the heart of the city. Perfect for couples or solo travelers. Walking distance to major attractions and restaurants.',
            'price': 45.00,
            'latitude': 40.7128,
            'longitude': -74.0060
        },
        {
            'id': 'place-002',
            'title': 'Luxury Villa with Pool',
            'description': 'Stunning villa with private pool and garden. Spacious rooms with modern amenities. Perfect for families or groups seeking luxury and comfort.',
            'price': 150.00,
            'latitude': 41.3851,
            'longitude': 2.1734
        },
        {
            'id': 'place-003',
            'title': 'Beachfront Bungalow',
            'description': 'Wake up to ocean views! This charming bungalow offers direct beach access. Relax and enjoy the sound of waves from your private deck.',
            'price': 95.00,
            'latitude': 41.9028,
            'longitude': 12.4964
        },
        {
            'id': 'place-004',
            'title': 'Mountain Cabin Retreat',
            'description': 'Escape to the mountains in this cozy cabin. Enjoy hiking trails, fresh air, and stunning views. Perfect for nature lovers and adventure seekers.',
            'price': 75.00,
            'latitude': 48.1351,
            'longitude': 11.5820
        },
        {
            'id': 'place-005',
            'title': 'Historic City Loft',
            'description': 'Experience history in this beautifully restored loft. High ceilings, original features, and modern comfort. Located in the old town district.',
            'price': 120.00,
            'latitude': 48.8566,
            'longitude': 2.3522
        },
        {
            'id': 'place-006',
            'title': 'Budget Studio',
            'description': 'Affordable and clean studio apartment. Great for budget travelers. Close to public transportation.',
            'price': 8.00,
            'latitude': 51.5074,
            'longitude': -0.1278
        },
        {
            'id': 'place-007',
            'title': 'Mid-Range Apartment',
            'description': 'Comfortable apartment with all amenities. Good location and reasonable price.',
            'price': 35.00,
            'latitude': 52.5200,
            'longitude': 13.4050
        },
        {
            'id': 'place-008',
            'title': 'Penthouse Suite',
            'description': 'Luxury penthouse with panoramic city views. Top floor location with private elevator access.',
            'price': 500.00,
            'latitude': 25.2048,
            'longitude': 55.2708
        }
    ]
    
    # Insert places
    inserted = 0
    for place in places:
        try:
            cursor.execute("""
                INSERT OR IGNORE INTO places 
                (id, title, description, price, latitude, longitude, owner_id, 
                 created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                place['id'],
                place['title'],
                place['description'],
                place['price'],
                place['latitude'],
                place['longitude'],
                '11111111-1111-1111-1111-111111111111',  # owner_id
                datetime.now().isoformat(),
                datetime.now().isoformat()
            ))
            inserted += 1
            print(f"✓ {place['title']} - ${place['price']}/night")
        except Exception as e:
            print(f"✗ {place['title']}: {e}")
    
    # Commit changes
    conn.commit()
    conn.close()
    
    print(f"\n✅ Successfully seeded {inserted} places!")
    print(f"📊 Total places in database: {inserted}")
    print("\n🚀 You can now test the frontend at: http://localhost:8000/index.html")

if __name__ == '__main__':
    try:
        seed_places()
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
