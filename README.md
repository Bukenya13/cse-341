# CSE 341 Project 2 - REST API with CRUD Operations

A Node.js REST API that performs full CRUD (Create, Read, Update, Delete) operations against a MongoDB **project2** database with five collections: `contacts`, `users`, `colleges`, `courses`, and `instructors`.

## Features

- Full CRUD for five MongoDB collections (`contacts`, `users`, `colleges`, `courses`, `instructors`)
- `courses` reference their `college` via a `collegeId`; `GET /colleges/:id` returns the college with its courses nested
- `instructors` reference the `course` they teach via a `courseId`
- Deleting a college cascades and removes its courses
- Data validation on all POST and PUT routes (returns 400 on invalid payloads)
- Error handling with try/catch on every route (returns 500 on failures)
- GitHub OAuth login and logout, with every write route protected (returns 401 when not signed in)
- Sessions persisted in MongoDB so logins survive restarts and multiple instances
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

# Seed only some collections (leaves the others untouched)
npm run seed -- contacts
npm run seed -- instructors

# Note: `colleges`, `courses`, and `instructors` are always seeded together,
# because each references the previous and re-seeding regenerates the ids.

# 4. Start the server
npm start
```

The server runs at `http://localhost:3000`.

## Environment variables

| Variable       | Description                                                                 |
| -------------- | --------------------------------------------------------------------------- |
| `MONGODB_URL`        | MongoDB connection string. Point the database portion at `project2`.              |
| `DNS_SERVERS`        | Comma-separated DNS servers to help resolve the cluster (Render workaround).      |
| `PORT`               | Port the server listens on (defaults to 3000 locally; Render sets its own).       |
| `GITHUB_CLIENT_ID`   | Client ID from your GitHub OAuth app.                                             |
| `GITHUB_CLIENT_SECRET` | Client secret from your GitHub OAuth app.                                       |
| `CALLBACK_URL`       | OAuth callback URL. Must exactly match the URL registered in the OAuth app.       |
| `SESSION_SECRET`     | Secret used to sign the session cookie. Any long random string.                   |

> Important: `MONGODB_URL`, `GITHUB_CLIENT_SECRET`, and `SESSION_SECRET` must **never** be committed. They stay in `.env` locally and are set as Config Vars in Render. `.env` is already listed in `.gitignore`.

## API endpoints

> `POST`, `PUT`, and `DELETE` require an authenticated GitHub session. Sign in first via `/login`, otherwise these routes return `401`.

### Contacts

| Method | Route              | Description               | Success status |
| ------ | ------------------ | ------------------------- | -------------- |
| GET    | `/contacts`        | List all contacts         | 200            |
| GET    | `/contacts/:id`    | Get one contact           | 200            |
| POST   | `/contacts`        | Create a contact (auth)   | 201            |
| PUT    | `/contacts/:id`    | Update a contact (auth)   | 204            |
| DELETE | `/contacts/:id`    | Delete a contact (auth)   | 204            |

Required fields: `firstName`, `lastName`, `email`, `favoriteColor`, `birthday` (`birthday` in `YYYY-MM-DD` format). `email` must be valid.

### Users

| Method | Route              | Description               | Success status |
| ------ | ------------------ | ------------------------- | -------------- |
| GET    | `/users`           | List all users            | 200            |
| GET    | `/users/:id`       | Get one user              | 200            |
| POST   | `/users`           | Create a user (auth)      | 201            |
| PUT    | `/users/:id`       | Update a user (auth)      | 204            |
| DELETE | `/users/:id`       | Delete a user (auth)      | 204            |

Required fields: `firstName`, `lastName`, `username`, `email`, `phone`, `city`, `ipaddress`. `email` must be valid.

Optional field: `profilePicture` — a URL to the user's profile picture. If omitted on `POST`, the API auto-assigns a generated portrait of a Black African via `avatars.tzador.com`; existing records without one get the same treatment in `GET` responses.

### Colleges

| Method | Route              | Description               | Success status |
| ------ | ------------------ | ------------------------- | -------------- |
| GET    | `/colleges`        | List all colleges         | 200            |
| GET    | `/colleges/:id`    | Get one college + courses | 200            |
| POST   | `/colleges`        | Create a college (auth)   | 201            |
| PUT    | `/colleges/:id`    | Update a college (auth)   | 204            |
| DELETE | `/colleges/:id`    | Delete a college (auth)   | 200            |

Required fields (9): `name`, `code`, `email`, `phone`, `city`, `country`, `establishedYear`, `type`, `website`. `type` must be one of `public`, `private`, `community`, `technical`. `establishedYear` is a 4-digit year, `code` is 2-12 letters/numbers/dashes, and `website` must be an http(s) URL.

`GET /colleges/:id` also returns a `courses` array containing every course whose `collegeId` matches. `DELETE /colleges/:id` cascades and deletes those courses too, reporting both counts.

### Courses

| Method | Route              | Description               | Success status |
| ------ | ------------------ | ------------------------- | -------------- |
| GET    | `/courses`         | List all courses          | 200            |
| GET    | `/courses/:id`     | Get one course            | 200            |
| POST   | `/courses`         | Create a course (auth)    | 201            |
| PUT    | `/courses/:id`     | Update a course (auth)    | 204            |
| DELETE | `/courses/:id`     | Delete a course (auth)    | 204            |

Required fields (8): `name`, `code`, `collegeId`, `credits`, `duration`, `level`, `faculty`, `description`. `collegeId` must be the `_id` of an existing college, otherwise `POST`/`PUT` return 400. `level` must be one of `certificate`, `diploma`, `bachelors`, `masters`, `phd`.

### Instructors

| Method | Route                | Description                 | Success status |
| ------ | -------------------- | --------------------------- | -------------- |
| GET    | `/instructors`       | List all instructors        | 200            |
| GET    | `/instructors/:id`   | Get one instructor          | 200            |
| POST   | `/instructors`       | Create an instructor (auth) | 201            |
| PUT    | `/instructors/:id`   | Update an instructor (auth) | 204            |
| DELETE | `/instructors/:id`   | Delete an instructor (auth) | 204            |

Required fields (9): `firstName`, `lastName`, `email`, `phone`, `title`, `courseId`, `faculty`, `office`, `hireDate`. `courseId` must be the `_id` of an existing course, otherwise `POST`/`PUT` return 400. `title` must be one of `professor`, `associate professor`, `senior lecturer`, `lecturer`, `assistant lecturer`, `teaching assistant`. `hireDate` is `YYYY-MM-DD` and `office` accepts letters, numbers, spaces, and dashes.

Get a course's id to post an instructor against it:

```bash
curl http://localhost:3000/courses | jq -r '.[0]._id'
```

### Error responses

- `400` — invalid id or data validation failed
- `401` — route requires authentication and no GitHub session is present
- `404` — document not found
- `500` — unexpected server error

## Checking login status

`GET /` (and `GET /whoami`) return plain text showing the current session:

```
Logged in as Lawrence Bukenya
```

or

```
Logged Out
```

`GET /api` returns a JSON index of every collection and endpoint.

## Authentication (GitHub OAuth)

| Method | Route                | Description                                       |
| ------ | -------------------- | ------------------------------------------------- |
| GET    | `/login`             | Redirects to GitHub to authorize the application. |
| GET    | `/github/callback`   | OAuth callback; establishes the session.          |
| GET    | `/logout`            | Ends the session and clears the passport state.   |

Sessions are stored in the `sessions` collection in MongoDB via `connect-mongo`, so a login survives a server restart and works across multiple instances.

To register the callback, create an OAuth app at <https://github.com/settings/developers> and set:

- **Homepage URL:** `http://localhost:3000` (or your Render URL)
- **Authorization callback URL:** exactly the value of `CALLBACK_URL` in your `.env`, e.g. `http://localhost:3000/github/callback` locally and `https://web-servises-cse-341.onrender.com/github/callback` in production.

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
4. Add these Config Vars: `MONGODB_URL` (pointing at your `project2` database), `DNS_SERVERS=1.1.1.1,8.8.8.8`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `SESSION_SECRET`, and `CALLBACK_URL`.
5. Set `CALLBACK_URL` to the production callback, e.g. `https://web-servises-cse-341.onrender.com/github/callback`, and add the same URL to the GitHub OAuth app. Leaving it as `http://localhost:3000/...` makes the redirect fail in production.
6. After the deploy finishes, open the live URL and confirm `/contacts` and `/users` respond, then visit `/login` to sign in.