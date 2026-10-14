# Task 3: Authentication System

## Project Description

This project is a user authentication system built using Node.js, Express.js, MySQL, bcrypt, and JSON Web Tokens (JWT).

## Features

* User registration with username, email, and password
* Password hashing using bcrypt
* User login with credential validation
* JWT-based authentication
* Protected dashboard API
* Logout functionality
* Error messages for invalid credentials

## Technologies Used

* HTML
* CSS
* JavaScript
* Node.js
* Express.js
* MySQL
* bcrypt
* JSON Web Token (JWT)

## Installation and Setup

1. Install Node.js and MySQL.

2. Open the project folder in VS Code.

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a MySQL database named `task3_auth`.

5. Create the `users` table as configured in the project.

6. Configure the `.env` file with your MySQL credentials and a secure JWT secret.

7. Start the application:

   ```bash
   npm start
   ```

8. Open `http://localhost:5000` in your browser.

## Security Notes

* Passwords are hashed using bcrypt before being stored in the database.
* Parameterized SQL queries are used to help prevent SQL injection.
* JWT tokens are used to authenticate requests to the protected dashboard API.
* Invalid login credentials return an error message.
* Environment variables store database credentials and the JWT secret.
* The `.env` file should not be shared or committed to GitHub.

## API Endpoints

| Method | Endpoint         | Purpose                           |
| ------ | ---------------- | --------------------------------- |
| POST   | `/api/register`  | Register a new user               |
| POST   | `/api/login`     | Login and receive a JWT           |
| GET    | `/api/dashboard` | Access protected user information |
| GET    | `/api`           | Check API status                  |

## Author

Authentication System — Task 3
