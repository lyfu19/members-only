# Members-Only Club

This is a simple full-stack Node.js application built with **Express**, **PostgreSQL**, and **EJS** that simulates a private club where registered users can post anonymous messages. Only club members can see the names of the message authors, and only admins can delete messages.

## Features

- User registration with form validation and password hashing using bcrypt
- User authentication using Passport.js with LocalStrategy
- Members-only feature unlocked via secret code
- Admin-only feature for deleting messages
- PostgreSQL database integration with a `users` and `messages` table
- Flash-style error messages and form re-population on validation failure
- Basic styling using CSS and responsive layout

## Tech Stack

- Node.js + Express
- PostgreSQL
- Passport.js (Local Strategy)
- bcrypt
- express-validator
- EJS templating
- dotenv
- nodemon (dev)

## Setup Instructions

1. **Clone this repository**

   ```bash
   git clone <your-repo-url>
   cd members-only
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create a `.env` file** in the root directory with the following:

   ```env
   DATABASE_URL=postgres://your_db_user:your_db_password@localhost:5432/your_db_name
   MEMBER_SECRET=your_member_passcode
   ADMIN_SECRET=your_admin_passcode
   ```

4. **Set up PostgreSQL tables**  
   You can use this schema:

   ```sql
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     first_name TEXT NOT NULL,
     last_name TEXT NOT NULL,
     username TEXT UNIQUE NOT NULL,
     password TEXT NOT NULL,
     is_member BOOLEAN DEFAULT false,
     is_admin BOOLEAN DEFAULT false
   );

   CREATE TABLE messages (
     id SERIAL PRIMARY KEY,
     title TEXT NOT NULL,
     text TEXT NOT NULL,
     timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     author_id INTEGER REFERENCES users(id)
   );
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Visit the app**  
   Open `http://localhost:3000` in your browser.

## Deployment

This project is deployed on **Render**.

Make sure to set the following environment variables in your Render Dashboard:

- `DATABASE_URL`
- `SESSION_SECRET`
- `MEMBER_SECRET`
- `ADMIN_SECRET`

To deploy:

1. Push your project to GitHub.
2. Create a new Web Service on Render and connect the repo.
3. Set your environment variables under the "Environment" tab.
4. Deploy 🚀

## License

This project is part of The Odin Project curriculum and is for learning purposes only.
