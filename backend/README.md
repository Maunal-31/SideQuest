# SideQuest Python Backend (FastAPI + Campus Email Verification)

This directory contains the Python FastAPI backend service for **SideQuest**, featuring campus email verification, JWT authentication, and quest bounty management.

## 🚀 Features

- **FastAPI Framework**: High-performance, asynchronous Python REST API with auto-generated Swagger UI (`/docs`).
- **Campus Email Verification**: 
  1. Student registers with campus email.
  2. Backend generates a 6-digit verification OTP valid for 15 minutes.
  3. Sends verification email via SMTP or logs OTP clearly to the terminal for local testing.
  4. Student submits OTP code to `/api/v1/auth/verify-email`.
  5. Account is marked `is_verified=True` and issues JWT token.
- **JWT Authentication**: OAuth2 Bearer token authentication for protected endpoints.
- **Quest Bounty Lifecycle**: API endpoints to list, post, claim/accept, and update quest statuses.

---

## 🛠️ How to Run locally

### 1. Navigate to backend directory
```bash
cd backend
```

### 2. Create and activate a Virtual Environment (Optional but recommended)
```bash
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Start the FastAPI Server
```bash
python -m uvicorn app.main:app --reload --port 8000
```

The API will be available at:
- **Root URL**: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Interactive Swagger Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc API Documentation**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## 🔑 Email Verification API Flow

```
+------------------+         +--------------------------+         +-----------------------+
|  POST /register  | ------> |  6-Digit OTP Generated   | ------> | POST /verify-email    |
| (Campus Email)   |         | (Terminal / SMTP Email)  |         | (Returns JWT Token)   |
+------------------+         +--------------------------+         +-----------------------+
                                                                             |
                                                                             v
                                                                  +---------------------+
                                                                  |  POST /login        |
                                                                  | (Authorized Access) |
                                                                  +---------------------+
```

### 1. Register Account
`POST /api/v1/auth/register`
```json
{
  "name": "Alex Hunter",
  "email": "alex@campus.edu",
  "password": "SecretPassword123!"
}
```

### 2. Verify Email OTP Code
`POST /api/v1/auth/verify-email`
```json
{
  "email": "alex@campus.edu",
  "otp_code": "849201"
}
```

### 3. Login
`POST /api/v1/auth/login`
```json
{
  "email": "alex@campus.edu",
  "password": "SecretPassword123!"
}
```
