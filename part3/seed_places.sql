-- HBnB Sample Places Data
-- This script adds sample places to test the frontend

-- Note: First you need a regular user (not admin) to own these places
-- Insert a test user if not exists
INSERT OR IGNORE INTO users (id, first_name, last_name, email, password, is_admin, created_at, updated_at)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'Test',
    'User',
    'test@example.com',
    '$2b$12$JUOegFmtEQiT09qKG7WPIu8woU5x1Fa7G0VDWKy.2Isc5trvv6v9C', -- password: password123
    FALSE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insert Sample Places

-- Place 1: Cozy Downtown Apartment
INSERT INTO places (id, name, description, address, city, latitude, longitude, host_id, number_of_rooms, number_of_bathrooms, price_per_night, max_guests, created_at, updated_at)
VALUES (
    'place-001',
    'Cozy Downtown Apartment',
    'Beautiful apartment in the heart of the city. Perfect for couples or solo travelers. Walking distance to major attractions and restaurants.',
    '123 Main Street',
    'New York',
    40.7128,
    -74.0060,
    '11111111-1111-1111-1111-111111111111',
    2,
    1,
    45.00,
    2,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Place 2: Luxury Villa with Pool
INSERT INTO places (id, name, description, address, city, latitude, longitude, host_id, number_of_rooms, number_of_bathrooms, price_per_night, max_guests, created_at, updated_at)
VALUES (
    'place-002',
    'Luxury Villa with Pool',
    'Stunning villa with private pool and garden. Spacious rooms with modern amenities. Perfect for families or groups seeking luxury and comfort.',
    '456 Beach Road',
    'Barcelona',
    41.3851,
    2.1734,
    '11111111-1111-1111-1111-111111111111',
    5,
    3,
    150.00,
    8,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Place 3: Beachfront Bungalow
INSERT INTO places (id, name, description, address, city, latitude, longitude, host_id, number_of_rooms, number_of_bathrooms, price_per_night, max_guests, created_at, updated_at)
VALUES (
    'place-003',
    'Beachfront Bungalow',
    'Wake up to ocean views! This charming bungalow offers direct beach access. Relax and enjoy the sound of waves from your private deck.',
    '789 Coastal Drive',
    'Rome',
    41.9028,
    12.4964,
    '11111111-1111-1111-1111-111111111111',
    3,
    2,
    95.00,
    4,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Place 4: Mountain Cabin Retreat
INSERT INTO places (id, name, description, address, city, latitude, longitude, host_id, number_of_rooms, number_of_bathrooms, price_per_night, max_guests, created_at, updated_at)
VALUES (
    'place-004',
    'Mountain Cabin Retreat',
    'Escape to the mountains in this cozy cabin. Enjoy hiking trails, fresh air, and stunning views. Perfect for nature lovers and adventure seekers.',
    '321 Alpine Way',
    'Munich',
    48.1351,
    11.5820,
    '11111111-1111-1111-1111-111111111111',
    2,
    1,
    75.00,
    3,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Place 5: Historic City Loft
INSERT INTO places (id, name, description, address, city, latitude, longitude, host_id, number_of_rooms, number_of_bathrooms, price_per_night, max_guests, created_at, updated_at)
VALUES (
    'place-005',
    'Historic City Loft',
    'Experience history in this beautifully restored loft. High ceilings, original features, and modern comfort. Located in the old town district.',
    '654 Heritage Lane',
    'Paris',
    48.8566,
    2.3522,
    '11111111-1111-1111-1111-111111111111',
    3,
    2,
    120.00,
    4,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Place 6: Budget Studio
INSERT INTO places (id, name, description, address, city, latitude, longitude, host_id, number_of_rooms, number_of_bathrooms, price_per_night, max_guests, created_at, updated_at)
VALUES (
    'place-006',
    'Budget Studio',
    'Affordable and clean studio apartment. Great for budget travelers. Close to public transportation.',
    '111 Economy Street',
    'London',
    51.5074,
    -0.1278,
    '11111111-1111-1111-1111-111111111111',
    1,
    1,
    8.00,
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Place 7: Mid-Range Apartment
INSERT INTO places (id, name, description, address, city, latitude, longitude, host_id, number_of_rooms, number_of_bathrooms, price_per_night, max_guests, created_at, updated_at)
VALUES (
    'place-007',
    'Mid-Range Apartment',
    'Comfortable apartment with all amenities. Good location and reasonable price.',
    '222 Middle Road',
    'Berlin',
    52.5200,
    13.4050,
    '11111111-1111-1111-1111-111111111111',
    2,
    1,
    35.00,
    3,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Place 8: Penthouse Suite
INSERT INTO places (id, name, description, address, city, latitude, longitude, host_id, number_of_rooms, number_of_bathrooms, price_per_night, max_guests, created_at, updated_at)
VALUES (
    'place-008',
    'Penthouse Suite',
    'Luxury penthouse with panoramic city views. Top floor location with private elevator access.',
    '999 Sky Tower',
    'Dubai',
    25.2048,
    55.2708,
    '11111111-1111-1111-1111-111111111111',
    4,
    3,
    500.00,
    6,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
