"""
Test script for Place endpoints
Run this after starting the Flask server with: python run.py
"""

import requests
import json

BASE_URL = "http://localhost:5000/api/v1"

# Global variables to store created IDs
user_id = None
amenity_ids = []
place_id = None


def test_create_user():
    """Create a test user to be the owner"""
    print("\n=== Creating test user (owner) ===")
    user_data = {
        "first_name": "أحمد",
        "last_name": "محمد",
        "email": "ahmed.owner@example.com",
        "is_admin": False
    }

    response = requests.post(f"{BASE_URL}/users/", json=user_data)
    print(f"Status: {response.status_code}")
    if response.status_code == 201:
        global user_id
        user_id = response.json()['id']
        print(f"User created with ID: {user_id}")
        return user_id
    else:
        print(f"Error: {response.json()}")
    return None


def test_create_amenities():
    """Create test amenities"""
    print("\n=== Creating test amenities ===")
    amenities = ["WiFi", "مسبح", "موقف سيارات"]
    global amenity_ids

    for amenity_name in amenities:
        amenity_data = {"name": amenity_name}
        response = requests.post(f"{BASE_URL}/amenities/", json=amenity_data)
        if response.status_code == 201:
            amenity_id = response.json()['id']
            amenity_ids.append(amenity_id)
            print(f"Amenity '{amenity_name}' created with ID: {amenity_id}")

    return amenity_ids


def test_create_place():
    """Test creating a new place"""
    print("\n=== Testing POST /api/v1/places/ ===")
    place_data = {
        "title": "Luxury Apartment in City Center",
        "description": "Beautiful apartment with amazing views",
        "price": 150.50,
        "latitude": 33.5731,
        "longitude": -7.5898,
        "owner_id": user_id,
        "amenities": amenity_ids[:2]  # First 2 amenities
    }

    response = requests.post(f"{BASE_URL}/places/", json=place_data)
    print(f"Status: {response.status_code}")
    print(
        f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")

    if response.status_code == 201:
        global place_id
        place_id = response.json()['id']
        return place_id
    return None


def test_get_all_places():
    """Test getting all places"""
    print("\n=== Testing GET /api/v1/places/ ===")
    response = requests.get(f"{BASE_URL}/places/")
    print(f"Status: {response.status_code}")
    print(
        f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    print(f"Total places: {len(response.json())}")


def test_get_place(place_id):
    """Test getting a specific place"""
    print(f"\n=== Testing GET /api/v1/places/{place_id} ===")
    response = requests.get(f"{BASE_URL}/places/{place_id}")
    print(f"Status: {response.status_code}")
    print(
        f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")


def test_update_place(place_id):
    """Test updating a place"""
    print(f"\n=== Testing PUT /api/v1/places/{place_id} ===")
    update_data = {
        "title": "Updated Luxury Apartment",
        "description": "Updated description for the apartment",
        "price": 200.00,
        "latitude": 33.5731,
        "longitude": -7.5898,
        "owner_id": user_id,
        "amenities": amenity_ids  # All amenities now
    }

    response = requests.put(f"{BASE_URL}/places/{place_id}", json=update_data)
    print(f"Status: {response.status_code}")
    print(
        f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")


def test_invalid_owner():
    """Test creating place with non-existent owner"""
    print("\n=== Testing invalid owner (should fail) ===")
    place_data = {
        "title": "Test Place",
        "description": "Test",
        "price": 100.0,
        "latitude": 33.5731,
        "longitude": -7.5898,
        "owner_id": "non-existent-id",
        "amenities": []
    }

    response = requests.post(f"{BASE_URL}/places/", json=place_data)
    print(f"Status: {response.status_code}")
    print(
        f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")


def test_invalid_price():
    """Test creating place with negative price"""
    print("\n=== Testing negative price (should fail) ===")
    place_data = {
        "title": "Test Place",
        "description": "Test",
        "price": -50.0,
        "latitude": 33.5731,
        "longitude": -7.5898,
        "owner_id": user_id,
        "amenities": []
    }

    response = requests.post(f"{BASE_URL}/places/", json=place_data)
    print(f"Status: {response.status_code}")
    print(
        f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")


def test_invalid_latitude():
    """Test creating place with invalid latitude"""
    print("\n=== Testing invalid latitude (should fail) ===")
    place_data = {
        "title": "Test Place",
        "description": "Test",
        "price": 100.0,
        "latitude": 95.0,  # Out of range (-90 to 90)
        "longitude": -7.5898,
        "owner_id": user_id,
        "amenities": []
    }

    response = requests.post(f"{BASE_URL}/places/", json=place_data)
    print(f"Status: {response.status_code}")
    print(
        f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")


def test_invalid_longitude():
    """Test creating place with invalid longitude"""
    print("\n=== Testing invalid longitude (should fail) ===")
    place_data = {
        "title": "Test Place",
        "description": "Test",
        "price": 100.0,
        "latitude": 33.5731,
        "longitude": 200.0,  # Out of range (-180 to 180)
        "owner_id": user_id,
        "amenities": []
    }

    response = requests.post(f"{BASE_URL}/places/", json=place_data)
    print(f"Status: {response.status_code}")
    print(
        f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")


def test_invalid_amenity():
    """Test creating place with non-existent amenity"""
    print("\n=== Testing invalid amenity (should fail) ===")
    place_data = {
        "title": "Test Place",
        "description": "Test",
        "price": 100.0,
        "latitude": 33.5731,
        "longitude": -7.5898,
        "owner_id": user_id,
        "amenities": ["non-existent-amenity-id"]
    }

    response = requests.post(f"{BASE_URL}/places/", json=place_data)
    print(f"Status: {response.status_code}")
    print(
        f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")


def test_create_multiple_places():
    """Test creating multiple places"""
    print("\n=== Creating multiple places ===")
    places = [
        {
            "title": "Beachfront Villa",
            "description": "Luxury villa by the sea",
            "price": 500.0,
            "latitude": 33.5731,
            "longitude": -7.5898
        },
        {
            "title": "Mountain Chalet",
            "description": "Peaceful chalet in the mountains",
            "price": 250.0,
            "latitude": 31.6295,
            "longitude": -7.9811
        }
    ]

    for place in places:
        place['owner_id'] = user_id
        place['amenities'] = [amenity_ids[0]] if amenity_ids else []
        response = requests.post(f"{BASE_URL}/places/", json=place)
        print(f"Creating '{place['title']}': Status {response.status_code}")


def run_all_tests():
    """Run all tests"""
    print("=" * 60)
    print("بدء اختبار Place Endpoints")
    print("=" * 60)

    try:
        # Setup: Create user and amenities
        if not test_create_user():
            print("\n❌ Failed to create test user. Stopping tests.")
            return

        test_create_amenities()

        # Test place creation
        created_place_id = test_create_place()

        if created_place_id:
            # Get specific place
            test_get_place(created_place_id)

            # Update place
            test_update_place(created_place_id)

            # Get updated place
            test_get_place(created_place_id)

        # Create more places
        test_create_multiple_places()

        # Get all places
        test_get_all_places()

        # Test error cases
        test_invalid_owner()
        test_invalid_price()
        test_invalid_latitude()
        test_invalid_longitude()
        test_invalid_amenity()

        print("\n" + "=" * 60)
        print("✅ اكتملت جميع الاختبارات")
        print("=" * 60)

    except requests.exceptions.ConnectionError:
        print("\n❌ خطأ: لا يمكن الاتصال بالخادم")
        print("تأكد من تشغيل الخادم باستخدام: cd part2 && python run.py")
    except Exception as e:
        print(f"\n❌ خطأ غير متوقع: {e}")


if __name__ == "__main__":
    run_all_tests()
