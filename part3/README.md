# HBnB Evolution - Part 3

## Enhanced Backend with Authentication and Database Integration

### Overview
This part introduces JWT authentication, role-based access control, and database integration using SQLAlchemy.

### Setup

#### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

#### 2. Run the Application
```bash
python3 run.py
```

The application will run on `http://localhost:5000`

### Configuration
The application uses a configuration system defined in `config.py`:
- **DevelopmentConfig**: Development environment with DEBUG enabled
- Configuration can be changed via `FLASK_ENV` environment variable

### Project Structure
```
part3/
├── config.py              # Configuration classes
├── run.py                 # Application entry point
├── requirements.txt       # Dependencies
└── hbnb/
    └── app/
        ├── __init__.py   # Application factory
        ├── api/          # REST API endpoints
        ├── models/       # Data models
        ├── persistence/  # Data layer
        └── services/     # Business logic
```

### Tasks Completed
- [x] Task 0: Application Factory Configuration

### Next Tasks
- [ ] Task 1: Modify User Model (Password hashing)
- [ ] Task 2: JWT Authentication
- [ ] Task 3: Authorization & Role-based Access Control
- [ ] Task 4: Database Integration (SQLite/MySQL)
