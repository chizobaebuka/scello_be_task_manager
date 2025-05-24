# Task Management System API

A simple RESTful API for managing tasks, built with Node.js, Express.js, PostgreSQL, and Sequelize ORM. This project demonstrates clean code practices, authentication, error handling, and layered architecture (MVC).

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)

---

## Features

1. **Authentication**:

   - User registration and login with JWT-based authentication.
   - User CRUD implementations
   - Password hashing using Argon2.

2. **Task Management**:

   - Create, read, update, and delete tasks.
   - Pagination and filtering for task listing.
   - Time tracking and reporting.

3. **Error Handling**:

   - Centralized error handling middleware.
   - Input validation using Zod.

4. **Documentation**:
   - Swagger API documentation.

---

## Tech Stack

- **Backend**: Node.js, Express.js, Typescript
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT
- **Validation**: Zod
- **Password Hashing**: Argon2
- **Documentation**: Swagger

## Setup Instructions

### Prerequisites

1. Install [Node.js](https://nodejs.org/) (v16 or later).
2. Install [PostgreSQL](https://www.postgresql.org/).
3. Install [npm](https://www.npmjs.com/) (comes with Node.js).

---

### Steps to Start the Project

1. **Clone the Repository**:
   git clone git@github.com:chizobaebuka/scello_be_task_manager.git
   cd scello_be_task_manager

2. **Install Dependencies**:
   npm install

3. **Set Up Environment Variables**:

   - Create a `.env` file in the root directory.
   - Use the sample from the reference at .env.sample following as a reference for your `.env` file:

4. **Run Migrations**:
   npm run migrate

5. **Start the Development Server**:
   npm run dev
   PORT defined in your env
   The server will start at `http://localhost:${PORT}`.

6. **Build for Production**:
   npm run build

7. **Start the Production Server**:
   npm start

---

## API Endpoints

### Authentication

#### POST `/api/v1/users/register`

**Description**: Register a new user.
**Request Body**:

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securepassword"
}
```

---

#### POST `/api/v1/users/login`

**Description**: Log in a user and receive a JWT token.
**Request Body**:

```json
{
  "email": "john.doe@example.com",
  "password": "securepassword"
}
```

---

### Task Management

#### POST `/api/v1/tasks`

**Description**: Create a new task (authenticated).
**Request Body**:

```json
{
  "title": "Complete project documentation",
  "description": "Write detailed documentation for the project",
  "status": "pending"
}
```

---

#### GET `/api/v1/tasks`

**Description**: List all tasks for the authenticated user with pagination.
**Query Parameters**:

```json
{
  "page": 1,
  "size": 10,
  "offset": 0,
  "limit": 10,
  "sortBy": "createdAt",
  "sortOrder": "ASC"
}
```

---

#### PUT `/api/v1/tasks/:id`

**Description**: Update a task by ID.
**Request Body**:

```json
{
  "title": "Complete project documentation (updated)",
  "status": "in-progress"
}
```

---

#### DELETE `/api/v1/tasks/:id`

**Description**: Delete a task by ID.
**Response**:

```json
{
  "message": "Task deleted successfully"
}
```

---

#### GET `/api/v1/tasks/report-time`

**Description**: Track time spent on tasks.
**Query Parameters**:

```json
{
  "startDate": "2025-05-01",
  "endDate": "2025-05-23"
}
```

---

#### GET `/api/v1/tasks/report`

**Description**: Generate reports on task completion rates.
**Response**:

```json
{
  "totalTasks": 10,
  "completedTasks": 7,
  "completionRate": "70%"
}
```
