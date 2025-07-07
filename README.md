## Overview

This is the GraphQL backend for the Employee App, built with Node.js, Express, Apollo Server, and MongoDB. It provides:

* User authentication (JWT)
* Employee data management (CRUD)
* Pagination, filtering, and sorting via GraphQL
* Role-based access control (admin vs employee)
* Performance considerations (caching, indexing)

## Tech Stack

* **Node.js** (v18+)
* **Express**
* **Apollo Server Express**
* **MongoDB** (via Mongoose)
* **bcrypt** for password hashing
* **jsonwebtoken** for JWT auth
* **dotenv** for configuration

## Prerequisites

* Node.js (v18 or later)
* npm or yarn
* A MongoDB Atlas cluster (or local MongoDB)

## Setup & Installation

1. **Clone the repo**

   ```bash
   git clone <repo-url> backend
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment variables**
   Create a `.env` file in the project root and add:

   ```env
   PORT=4000
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   ```

4. **Seed initial users** (optional)

   ```bash
   node scripts/seedUsers.js
   ```

5. **Start the server**

   ```bash
   npm start
   ```

   The GraphQL playground will be available at `http://localhost:4000/graphql`.

## GraphQL Schema

### Types

```graphql
type Employee {
  id: ID!
  name: String!
  age: Int!
  class: String!
  subjects: [String!]!
  attendance: Int!
}

type User {
  id: ID!
  username: String!
  role: String!
  token: String
}

type PageInfo {
  page: Int!
  limit: Int!
  totalItems: Int!
  totalPages: Int!
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
}

type EmployeeConnection {
  items: [Employee!]!
  pageInfo: PageInfo!
}
```

### Inputs

```graphql
input NewEmployeeInput {
  name: String!
  age: Int!
  class: String!
  subjects: [String!]!
  attendance: Int!
}

input UpdateEmployeeInput {
  id: ID!
  name: String
  age: Int
  class: String
  subjects: [String!]
  attendance: Int
}

enum SortOrder { ASC, DESC }
enum EmployeeSortField { NAME, AGE, CLASS, ATTENDANCE }
input EmployeeSortInput { field: EmployeeSortField!, order: SortOrder! = ASC }
```

### Queries

```graphql
employees(
  page: Int = 1,
  limit: Int = 20,
  sort: EmployeeSortInput,
  filter: String
): EmployeeConnection!
employee(id: ID!): Employee
me: User
```

### Mutations

```graphql
login(username: String!, password: String!): User\addEmployee(input: NewEmployeeInput!): Employee!
updateEmployee(id: ID!, input: UpdateEmployeeInput!): Employee!
deleteEmployee(id: ID!): Boolean!
```

## Authentication & Authorization

* **`login`** returns a JWT in the `token` field.
* All `employees` queries and mutations except `login` require the `Authorization: Bearer <token>` header.
* Role-based access: only users with `role: "admin"` may add, update, or delete employees.

## Pagination, Filtering & Sorting

* **Pagination**: `page` and `limit` args control the slice.
* **Filtering**: `filter: String` will substring-match against employee `name`.
* **Sorting**: use `sort: { field: NAME, order: ASC }` to sort.

## Performance

* MongoDB **indexes** on frequently filtered/sorted fields recommended.
* Consider **caching** in production (Redis) for repeated queries.

## Deployment

### Recommended: Railway / Heroku / Render

1. Push code to GitHub.
2. Create a new Node.js service and link your repo.
3. Add env vars (`MONGODB_URI`, `JWT_SECRET`).
4. Set `npm start` as the start command.
5. Deploy and verify `https://<service-url>/graphql`.

---

For any questions or issues, please open an issue or contact the maintainer.
