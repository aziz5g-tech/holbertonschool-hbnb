"""
Test script for User endpoints
Run this after starting the Flask server with: python run.py
"""

import requests
import json

BASE_URL = "http://localhost:5000/api/v1/users"


def test_create_user():
    """Test creating a new user"""
    print("\n=== Testing POST /api/v1/users/ ===")
    user_data = {
        "first_name": "أحمد",
        "last_name": "محمد",
        "email": "ahmed.mohamed@example.com",
        "is_admin": False
    }

    response = requests.post(BASE_URL + "/", json=user_data)
    print(f"Status: {response.status_code}")
    print(
        f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")

    if response.status_code == 201:
        return response.json()['id']
    return None


def test_get_all_users():
    """Test getting all users"""
    print("\n=== Testing GET /api/v1/users/ ===")
    response = requests.get(BASE_URL + "/")
    print(f"Status: {response.status_code}")
    print(
        f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")


def test_get_user(user_id):
    """Test getting a specific user"""
    print(f"\n=== Testing GET /api/v1/users/{user_id} ===")
    response = requests.get(f"{BASE_URL}/{user_id}")
    print(f"Status: {response.status_code}")
    print(
        f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")


def test_update_user(user_id):
    """Test updating a user"""
    print(f"\n=== Testing PUT /api/v1/users/{user_id} ===")
    update_data = {
        "first_name": "أحمد المحدث",
        "last_name": "محمد المحدث",
        "email": "ahmed.updated@example.com",
        "is_admin": False
    }

    response = requests.put(f"{BASE_URL}/{user_id}", json=update_data)
    print(f"Status: {response.status_code}")
    print(
        f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")


def test_duplicate_email():
    """Test creating user with duplicate email"""
    print("\n=== Testing duplicate email (should fail) ===")
    user_data = {
        "first_name": "علي",
        "last_name": "حسن",
        "email": "ahmed.mohamed@example.com",  # Same as first user
        "is_admin": False
    }

    response = requests.post(BASE_URL + "/", json=user_data)
    print(f"Status: {response.status_code}")
    print(
        f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")


def test_invalid_email():
    """Test creating user with invalid email"""
    print("\n=== Testing invalid email (should fail) ===")
    user_data = {
        "first_name": "سارة",
        "last_name": "أحمد",
        "email": "invalid-email",  # Invalid format
        "is_admin": False
    }

    response = requests.post(BASE_URL + "/", json=user_data)
    print(f"Status: {response.status_code}")
    print(
        f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")


def run_all_tests():
    """Run all tests"""
    print("=" * 60)
    print("بدء اختبار User Endpoints")
    print("=" * 60)

    try:
        # Create a user
        user_id = test_create_user()

        if user_id:
            # Get all users
            test_get_all_users()

            # Get specific user
            test_get_user(user_id)

            # Update user
            test_update_user(user_id)

            # Get updated user
            test_get_user(user_id)

        # Test error cases
        test_duplicate_email()
        test_invalid_email()

        print("\n" + "=" * 60)
        print("✅ اكتملت جميع الاختبارات")
        print("=" * 60)

    except requests.exceptions.ConnectionError:
        print("\n❌ خطأ: لا يمكن الاتصال بالخادم")
        print("تأكد من تشغيل الخادم باستخدام: python run.py")


if __name__ == "__main__":
    run_all_tests()
