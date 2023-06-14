# Task Tracker API

This is my first API with NestJS.
This app is designed for Company X, which sells a software application with a maintenance service. The purpose of this app is to keep track of the maintenance tasks performed, specifically for internal use by Company X.

The users who work for Company X receive calls from clients and register tasks related to the performed maintenance. Each task contains information about the maintenance service provided, including details about the user who performed it and the client for whom it was done.

This application implements the following security measures:

1. **Authentication with JWT**: The app utilizes JSON Web Tokens (JWT) for secure authentication, ensuring that only authorized users can access the system.
2. **Authorization**: The app incorporates an authorization mechanism that controls user access based on their assigned roles. This ensures that users can only perform actions appropriate to their role within the application.
3. **Secure Password Storage**: User passwords are securely stored in an encrypted format. The app ensures that passwords are never exposed or accessible, even when retrieving user information.
4. **Restricted User Registration**: User registration is limited to the administrators of Company X. Regular users cannot register directly; instead, they are created by the designated administrators, ensuring a controlled and managed user base.

These security systems highlight the measures in place to protect user information and control access to the application.

---

## Index

- [Task Tracker API](#task-tracker-api)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [Table Schemas](#table-schemas)
  - [Routes](#routes)
    - [Authentication](#authentication)
    - [Users](#users)
    - [Clients](#clients)
    - [Tasks](#tasks)
  - [Error Responses (HTTP Status Codes)](#error-responses-http-status-codes)
    - [401 Unauthorized](#401-unauthorized)
    - [403 Forbidden](#403-forbidden)
    - [409 Conflict](#409-conflict)
    - [500 Internal Server Error](#500-internal-server-error)

---

## Prerequisites

Before getting started, make sure you have the following programs installed:

- [Docker](https://docs.docker.com/engine/)
- [Docker Compose](https://docs.docker.com/compose/install/)

Follow the instructions in the provided links to download and install Docker and Docker Compose on your system.

---

## Installation

1. Clone the repository and copy the environment file.

```bash
git clone https://github.com/gregodiaz/task-tracker-api.git
cd task-tracker-api
cp .env.example .env
```

2. Initialize the project.

```bash
docker-compose up --build
```

---

## Usage

When the app initializes, it automatically creates empty databases and sets up an admin user.

### Table Schemas

Written using interface syntax

- users:

```typescript
{
  id: number; // serial
  username: string; // unique
  password: string;
  roles: 'admin' | 'user'; // default 'user'
}
```

- clients:

```typescript
{
  id: number; // serial
  name: string; // unique
}
```

- tasks:

```typescript
{
  id: number; // serial
  description: string;
  done: boolean; // default false
  userId: number; // foreign key
  clientId: number; // foreign key
}
```

An user with 'admin' role can read, create, update, and delete users, clients, and tasks.
An user with 'user' role can only read, create, update, and delete tasks. They can also read users and clients.

> [_go to index_](#index)

### Routes

#### Authentication

All routes require authentication, so we need to authenticate first.
Luckily, the app already has an admin user.

```http
POST http://localhost:3000/auth/login
Content-Type: application/json

{
	"username": "admin",
	"password": "admin"
}

#+RESPONSE
{
	"access_token": "eyJhbGciOiJIU..."
}
```

This token will store the user information.
Authentication can be verified with the following route:

```http
GET http://localhost:3000/auth/profile
Authorization: Bearer eyJhbGciOiJIU...

#+RESPONSE
{
	"sub": 1,
	"username": "admin",
	"iat": 1686844195,
	"exp": 1686930595
}
```

From now on, you will need to send the token with each request.

> [_go to index_](#index)

#### Users

```http
# Find all users
GET http://localhost:3000/users
Authorization: Bearer {{access_token}}

# Find a user
GET http://localhost:3000/users/1
Authorization: Bearer {{access_token}}

# Find all users and associate their tasks (can be an empty array)
GET http://localhost:3000/users/tasks
Authorization: Bearer {{access_token}}

# Find a user and associate their tasks (can be an empty array)
GET http://localhost:3000/users/1/tasks
Authorization: Bearer {{access_token}}

# Find a user by username
GET http://localhost:3000/users/username/admin
Authorization: Bearer {{access_token}}

# Create a user (admin only)
# If the 'roles' key is not defined, then it defaults to 'user'. Specify 'admin' explicitly to set the user as admin.
POST http://localhost:3000/users
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
	"username": "user",
	"password": "user"
}

# Edit a user (admin only)
PATCH http://localhost:3000/users/2
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
    "username": "user updated",
    "password": "user"
}

# Delete a user (admin only)
DELETE http://localhost:3000/users/2
Authorization: Bearer {{access_token}}
```

> [_go to index_](#index)

#### Clients

```http
# Find all clients
GET http://localhost:3000/clients
Authorization: Bearer {{access_token}}

# Find a client
GET http://localhost:3000/clients/1
Authorization: Bearer {{access_token}}

# Find all clients and associate their tasks (can be an empty array)
GET http://localhost:3000/clients/tasks
Authorization: Bearer {{access_token}}

# Find a client and associate their tasks (can be an empty array)
GET http://localhost:3000/clients/1/tasks
Authorization: Bearer {{access_token}}

# Create a client (admin only)
POST http://localhost:3000/clients
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
	"name": "client"
}

# Edit a client (admin only)
PATCH http://localhost:3000/clients/1
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
	"name": "client updated"
}

# Delete a client (admin only)
DELETE http://localhost:3000/clients/2
Authorization: Bearer {{access_token}}
```

> [_go to index_](#index)

#### Tasks

All tasks come with an associated user and client by default.
To create tasks, the user and client must already exist.

```http
# Find all tasks
GET http://localhost:3000/tasks
Authorization: Bearer {{access_token}}

# Find a task
GET http://localhost:3000/tasks/1
Authorization: Bearer {{access_token}}

# Create a task
POST http://localhost:3000/tasks
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
	"description": "task",
	"userId": 2,
	"clientId": 1
}

# Edit a task
PATCH http://localhost:3000/tasks/1
Authorization: Bearer {{access_token}}
Content-Type: application/json

{
	"description": "task updated",
	"userId": 2,
	"clientId": 2
}

# Delete a task
DELETE http://localhost:3000/tasks/2
Authorization: Bearer {{access_token}}
```

> [_go to index_](#index)

---

### Error Responses (HTTP Status Codes)

#### 401 Unauthorized

- If you are not authenticated or the password is incorrect.

#### 403 Forbidden

- If the user does not have permission to perform the action.

#### 409 Conflict

- If a username or client name is already taken.

#### 500 Internal Server Error

- If you try to delete a user or client that has associated tasks.
- If the ID already exists for a user, client, or task.
- If the user does not exist.
