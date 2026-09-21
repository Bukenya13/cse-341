# CSE 341 Project 2 - REST API with CRUD Operations

A Node.js REST API that performs full CRUD (Create, Read, Update, Delete) operations against a MongoDB **project2** database with two collections: `contacts` and `users`.

## Features

- Full CRUD for two MongoDB collections (`contacts`, `users`)
- Data validation on all POST and PUT routes (returns 400 on invalid payloads)
- Error handling with try/catch on every route (returns 500 on failures)
- Interactive API documentation served with Swagger UI
- Each user gets a unique profile picture of a Black African (auto-assigned from the `avatars.tzador.com` API)
- MongoDB credentials stored in a local `.env` file that is git-ignored

## Requirements

- Node.js 18+
- MongoDB Atlas account with the `project2` database created (the app creates it automatically on first write)
- A `.env` file (see `.env.example`)

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Create your .env file from the example and fill in your credentials
cp .env.example .env

# 3. (Optional) Seed the database with sample data
npm run seed

# 4. Start the server
npm start
```

The server runs at `http://localhost:3000`.

## Environment variables

| Variable       | Description                                                                 |
| -------------- | --------------------------------------------------------------------------- |
| `MONGODB_URL`  | MongoDB connection string. Point the database portion at `project2`.        |
| `DNS_SERVERS`  | Comma-separated DNS servers to help resolve the cluster (Render workaround).|
| `PORT`         | Port the server listens on (defaults to 3000 locally; Render sets its own). |

> Important: the `MONGODB_URL` contains credentials and must **never** be committed. It stays in `.env` locally and is set as a Config Var in Render. `.env` is already listed in `.gitignore`.

## API endpoints

### Contacts

| Method | Route              | Description               | Success status |
| ------ | ------------------ | ------------------------- | -------------- |
| GET    | `/contacts`        | List all contacts         | 200            |
| GET    | `/contacts/:id`    | Get one contact           | 200            |
| POST   | `/contacts`        | Create a contact          | 201            |
| PUT    | `/contacts/:id`    | Update a contact          | 204            |
| DELETE | `/contacts/:id`    | Delete a contact          | 204            |

Required fields: `firstName`, `lastName`, `email`, `favoriteColor`, `birthday` (`birthday` in `YYYY-MM-DD` format). `email` must be valid.

### Users

| Method | Route              | Description               | Success status |
| ------ | ------------------ | ------------------------- | -------------- |
| GET    | `/users`           | List all users            | 200            |
| GET    | `/users/:id`       | Get one user              | 200            |
| POST   | `/users`           | Create a user             | 201            |
| PUT    | `/users/:id`       | Update a user             | 204            |
| DELETE | `/users/:id`       | Delete a user             | 204            |

Required fields: `firstName`, `lastName`, `username`, `email`, `phone`, `city`, `ipaddress`. `email` must be valid.

Optional field: `profilePicture` — a URL to the user's profile picture. If omitted on `POST`, the API auto-assigns a generated portrait of a Black African via `avatars.tzador.com`; existing records without one get the same treatment in `GET` responses.

### Error responses

- `400` — invalid id or data validation failed
- `404` — document not found
- `500` — unexpected server error

## API documentation

Interactive documentation is available while the app is running at:

```
/api-docs
```

The OpenAPI spec lives in `swagger.json`.

## Testing the API

A `routes.rest` file is included with ready-to-run requests (works with the REST Client VS Code extension). You can also test the endpoints directly in Swagger UI.

## Deploying to Render

1. Push this repository to GitHub.
2. In the Render dashboard, create a **New > Web Service** and connect the repo.
3. Build command: `npm install` — Start command: `npm start` (or use the included `Procfile`).
4. Add a Config Var named `MONGODB_URL` pointing at your `project2` database, plus `DNS_SERVERS=1.1.1.1,8.8.8.8`.
5. After the deploy finishes, open the live URL and confirm `/contacts` and `/users` respond.