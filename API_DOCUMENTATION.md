# API Documentation — Authentication System

## 1. Project Overview

This project provides user registration, login, and protected dashboard functionality using Node.js, Express.js, MySQL, bcrypt, and JSON Web Tokens (JWT).

## 2. Base URL

text
http://localhost:5000


## 3. API Endpoints

### A. Check API Status

**Endpoint:** `/api`
**Method:** GET

**Purpose:** Checks whether the authentication API is running.

**Successful Response — 200 OK**

json
{
  "message": "Authentication API is running!"
}


### B. User Registration

**Endpoint:** `/api/register`
**Method:** POST
**Content-Type:** `application/json`

**Purpose:** Creates a new user account.

**Request Body**

json
{
  "username": "priyanka123",
  "email": "priyanka@example.com",
  "password": "ExamplePass123"
}


**Successful Response — 201 Created**

json
{
  "message": "Registration successful! Please login."
}


**Possible Error Responses**

* `400 Bad Request` — Required fields are missing or invalid.
* `409 Conflict` — Username or email already exists.
* `500 Internal Server Error` — Registration failed.

### C. User Login

**Endpoint:** `/api/login`
**Method:** POST
**Content-Type:** `application/json`

**Purpose:** Validates user credentials and generates a JWT.

**Request Body**

json
{
  "email": "priyanka@example.com",
  "password": "ExamplePass123"
}

**Successful Response — 200 OK**

json
{
  "message": "Login successful!",
  "token": "<JWT_TOKEN>",
  "user": {
    "id": 1,
    "username": "priyanka123",
    "email": "priyanka@example.com"
  }
}


The token and user ID shown above are examples. The actual response contains the generated token and database user details.

**Possible Error Responses**

* `400 Bad Request` — Email or password is missing.
* `401 Unauthorized` — Email or password is incorrect.
* `500 Internal Server Error` — Login failed.

### D. Protected Dashboard
