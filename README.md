# Apollo GraphQL API with Authentication, CRUD API + Search and filter

## Work environment Versions

| key  | version  |
| ---- | -------- |
| node | v18.12.1 |
| npm  | v8.19.2  |

## Description

CRUD API + Search and filter APIs with Apollo graphql and PostgreSQL database.

## Run it locally by following steps below

1. Clone the repository

```
git clone https://github.com/YashJM/movie-graphql-api.git
or download repo (unzip project after downloading)
```

2. Make sure you have `node` and `npm` installed globally on your machine.

```
Switch to the root directory (same directory as package.json) and follow next steps

```

3. To install dependencies, first run:

```
npm install
```

4. setup .env file and environment variables:

```
rename .env.example to .env and update DATABASE_URL and TOKEN variables
```

5. Run db-migrate to migrate the database and schema:

```
npm run db-migrate (new migration will be created)
```

6. Start server:

```
user npm run dev-server to start a dev server or npm start
```

7. To visit the graphQL playground

```
http://localhost:4000/
```

### API description:

#### This API allows users to:

- SignUp as a User
- Login
- Change Password
- Query a list of all the movies.
- Query a movie with it’s id
- Create a new movie
- Update an existing movie
- Delete a movie
- Query a list of reviews for a movie
- Create a new review
- Update an exiting review of a movie
- Delete a review

#### Authorization and Authentication handled in this API

- Users are able to register for and account with email and password. Passwords
  are hashed.
- Users are able login in to the API with their email and password and receive a JWT
  token.
- API will accept JWT tokens in headers to authenticate requests.
- Only authenticated users are able to perform Create, Update or Delete operations
  on movies or reviews.
- Users can only modify their movie or review.
