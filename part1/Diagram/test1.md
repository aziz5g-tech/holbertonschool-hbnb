title MVP System Architecture

direction right

Frontend [icon: react] {
  React App [icon: react]
  State Management [icon: redux]
}

Backend [icon: server] {
  Node Express API [icon: nodejs, label: "Express API"]
  Auth Service [icon: lock]
  Business Logic [icon: cpu]
}

Data Layer [icon: database] {
  PostgreSQL [icon: postgresql]
  Redis Cache [icon: redis]
}

External Services [icon: cloud] {
  OpenWeatherMap [icon: cloud-rain]
  Email Service [icon: mail]
}

// Frontend to Backend
React App > Node Express API: HTTP requests
Node Express API < React App: JSON responses

// Auth flow
React App > Auth Service: login/signup
Auth Service <> Redis Cache: session tokens

// Backend to Data
Node Express API <> PostgreSQL: CRUD operations
Node Express API <> Redis Cache: caching

// External integrations
Business Logic > OpenWeatherMap: fetch weather
Business Logic > Email Service: notifications
