# FilmFlex - Architecture Documentation

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Client Architecture](#client-architecture)
- [Server Architecture](#server-architecture)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Authentication & Authorization](#authentication--authorization)
- [Data Flow](#data-flow)

---

## 🎯 Project Overview

**FilmFlex** is a comprehensive movie ticket booking platform that enables users to browse movies, select theaters and showtimes, book seats, and process payments. The application supports three user roles: customers, theater admins, and super admins.

### Key Features
- 🎬 Movie browsing and search
- 🎭 Theater and show management
- 💺 Interactive seat selection
- 💳 Multi-payment gateway support (Card, UPI, Wallet)
- 👤 User authentication (Email/Password + Google OAuth)
- 📊 Admin dashboard for theater management
- 📱 Responsive design with modern UI

---

## 🛠 Technology Stack

### Frontend
- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.5
- **Routing**: React Router DOM 7.9.1
- **Styling**: 
  - Tailwind CSS v4 with `@tailwindcss/vite` plugin
  - DaisyUI 5.1.10 (component library)
- **HTTP Client**: Fetch API
- **Authentication**: `@react-oauth/google` 0.12.2
- **Development**: ESLint for code quality

### Backend
- **Runtime**: Node.js v22.16.0
- **Framework**: Express.js 4.19.2
- **Module System**: ES Modules (`type: "module"`)
- **Database**: PostgreSQL with `pg` connection pooling
- **Authentication**: 
  - JWT (jsonwebtoken)
  - bcrypt 6.0.0 for password hashing
  - Google OAuth via `google-auth-library`
- **Middleware**:
  - CORS for cross-origin requests
  - cookie-parser for cookie handling
  - express-async-handler for error handling
- **Development**: nodemon for auto-restart

### Database
- **DBMS**: PostgreSQL
- **Schema**: SQL-based schema with ENUM types
- **Connection**: pg connection pool

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React App (Port 5174)                                │  │
│  │  - Pages (Components)                                 │  │
│  │  - React Router (Client-side routing)                │  │
│  │  - Tailwind CSS + DaisyUI (Styling)                  │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP/HTTPS (REST API)
                        │ JSON Data Exchange
┌───────────────────────▼─────────────────────────────────────┐
│                       SERVER LAYER                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Express.js Server (Port 3000)                        │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Routes → Controllers → Models                  │  │  │
│  │  │  Middleware (Auth, CORS, Error Handling)        │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │ SQL Queries (pg pool)
┌───────────────────────▼─────────────────────────────────────┐
│                      DATABASE LAYER                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  PostgreSQL Database                                  │  │
│  │  - Users, Movies, Theaters, Halls                    │  │
│  │  - Shows, Seats, Bookings, Payments                  │  │
│  │  - Pricing Rules                                      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Client Architecture

### Directory Structure
```
client/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/           # Static assets (images, icons)
│   │   └── react.svg
│   ├── components/       # Reusable UI components
│   │   ├── AddSeatsToHall.jsx
│   │   ├── AdminMain.jsx
│   │   ├── AdminNavbar.jsx
│   │   ├── AdminSidebar.jsx
│   │   ├── CallToActionSection.jsx
│   │   ├── CustomerSidebar.jsx
│   │   ├── Footer.jsx
│   │   ├── HeroSection.jsx
│   │   ├── HomeMoviesGrid.jsx
│   │   ├── MovieCard.jsx
│   │   ├── MoviesSection.jsx
│   │   ├── Navbar.jsx
│   │   ├── NewlyReleasedMovies.jsx
│   │   ├── ReviewCard.jsx
│   │   ├── ReviewsSection.jsx
│   │   └── SeatSelector.jsx
│   ├── pages/            # Page components (routes)
│   │   ├── HomePage.jsx
│   │   ├── LoginPageUser.jsx
│   │   ├── LoginPageAdmin.jsx
│   │   ├── RegisterPageUser.jsx
│   │   ├── RegisterPageAdmin.jsx
│   │   ├── MoviesPage.jsx
│   │   ├── MovieDetail.jsx
│   │   ├── ShowPage.jsx
│   │   ├── SeatsPage.jsx
│   │   ├── PaymentPage.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── TheatersPage.jsx
│   │   ├── ShowSchedulerPage.jsx
│   │   ├── BookingsPage.jsx
│   │   ├── PricingPage.jsx
│   │   ├── CustomerPage.jsx
│   │   ├── CustomerProfilePage.jsx
│   │   ├── CustomerBookingsPage.jsx
│   │   ├── CustomerBookingHistoryPage.jsx
│   │   └── UserPage.jsx
│   ├── App.jsx           # Main app component with routing
│   ├── main.jsx          # React entry point
│   └── index.css         # Global styles (Tailwind imports)
├── eslint.config.js
├── vite.config.js        # Vite configuration
├── package.json
└── index.html
```

### Component Architecture

#### 1. **Pages (Route Components)**
Each page represents a distinct route in the application:

- **Public Pages**
  - `HomePage.jsx` - Landing page with movies, reviews, CTA
  - `MoviesPage.jsx` - Browse all available movies
  - `MovieDetail.jsx` - Detailed movie information and show times
  - `ShowPage.jsx` - Show details and seat availability
  - `SeatsPage.jsx` - Interactive seat selection interface
  - `PaymentPage.jsx` - Payment processing (Card/UPI/Wallet)

- **Authentication Pages**
  - `LoginPageUser.jsx` - Customer login (email/password + Google OAuth)
  - `LoginPageAdmin.jsx` - Admin/Super Admin login
  - `RegisterPageUser.jsx` - Customer registration
  - `RegisterPageAdmin.jsx` - Admin registration (requires ADMIN_SECRET)

- **Customer Pages** (Protected routes)
  - `CustomerPage.jsx` - Customer dashboard wrapper
  - `CustomerProfilePage.jsx` - View/edit profile
  - `CustomerBookingsPage.jsx` - Active bookings
  - `CustomerBookingHistoryPage.jsx` - Past bookings

- **Admin Pages** (Protected routes)
  - `AdminDashboard.jsx` - Admin dashboard wrapper
  - `TheatersPage.jsx` - Manage theaters and halls
  - `ShowSchedulerPage.jsx` - Schedule movie shows
  - `BookingsPage.jsx` - View/manage bookings
  - `PricingPage.jsx` - Configure ticket pricing

#### 2. **Components (Reusable UI Elements)**

- **Layout Components**
  - `Navbar.jsx` - Public navigation bar
  - `AdminNavbar.jsx` - Admin navigation bar
  - `AdminSidebar.jsx` - Admin sidebar menu
  - `CustomerSidebar.jsx` - Customer sidebar menu
  - `Footer.jsx` - Site footer with links

- **Feature Components**
  - `SeatSelector.jsx` - Interactive seat selection grid
  - `MovieCard.jsx` - Movie display card with poster
  - `HomeMoviesGrid.jsx` - Grid layout for movies on homepage
  - `NewlyReleasedMovies.jsx` - Recently released movies section

- **Section Components** (HomePage)
  - `HeroSection.jsx` - Hero banner with CTA
  - `MoviesSection.jsx` - Featured movies section
  - `ReviewsSection.jsx` - Customer reviews carousel
  - `ReviewCard.jsx` - Individual review display
  - `CallToActionSection.jsx` - CTA for bookings

- **Admin Components**
  - `AdminMain.jsx` - Admin main content wrapper
  - `AddSeatsToHall.jsx` - Add seats to theater hall

### Routing Structure

```jsx
/                           → HomePage
/loginUser                  → LoginPageUser
/loginAdmin                 → LoginPageAdmin
/registerUser               → RegisterPageUser
/registerAdmin              → RegisterPageAdmin
/movies                     → MoviesPage
/movies/:movieId            → MovieDetail
/shows/:showId              → ShowPage
/seats/:showId              → SeatsPage
/payment                    → PaymentPage
/bookings                   → BookingsPage

/customer                   → CustomerPage (wrapper)
  ├── /customer/profile     → CustomerProfilePage
  ├── /customer/bookings    → CustomerBookingsPage
  └── /customer/history     → CustomerBookingHistoryPage

/admin/*                    → AdminDashboard (wrapper)
  ├── /admin/theaters       → TheatersPage
  ├── /admin/shows          → ShowSchedulerPage
  ├── /admin/bookings       → BookingsPage
  └── /admin/pricing        → PricingPage
```

### State Management
- **Local State**: React `useState` for component-level state
- **Route State**: `useLocation` and `navigate` for passing data between routes
- **Auth State**: JWT token stored in localStorage/cookies
- **Form State**: Controlled components with validation

### Styling Approach
- **Tailwind CSS v4**: Utility-first CSS framework
- **DaisyUI**: Pre-built component library
- **Theme**: Dark mode (slate-900/800 backgrounds, blue accents)
- **Responsive**: Mobile-first design with breakpoints
- **Custom CSS**: Minimal custom styles in `index.css`

---

## ⚙️ Server Architecture

### Directory Structure
```
server/
├── config/
│   └── db.js                    # PostgreSQL connection pool
├── controllers/                 # Business logic
│   ├── authControllers.js       # Authentication (register, login, OAuth)
│   ├── movieController.js       # Movie CRUD operations
│   ├── theaterController.js     # Theater & hall management
│   ├── ticketBookingControllers.js  # Booking & show management
│   ├── bookingsControllers.js   # Booking queries
│   ├── customerController.js    # Customer profile operations
│   ├── userControllers.js       # User management
│   └── priceController.js       # Pricing rules
├── middlewares/                 # Express middlewares
│   ├── authMiddleware.js        # JWT authentication & authorization
│   └── roleMiddleware.js        # Role-based access control
├── models/
│   └── schema.sql               # PostgreSQL database schema
├── routes/                      # API route definitions
│   ├── authRoutes.js            # /auth/* endpoints
│   ├── movieRoutes.js           # /movies/* endpoints
│   ├── theaterRoutes.js         # /theater/* endpoints
│   ├── ticketBookingRoutes.js   # /api/bookings/* endpoints
│   ├── bookingsRoutes.js        # /api/bookings/* endpoints
│   ├── customerRoutes.js        # /api/customers/* endpoints
│   ├── userRoutes.js            # /user/* endpoints
│   └── priceRoutes.js           # /prices/* endpoints
├── src/
│   └── index.js                 # Legacy entry point (not used)
├── index.js                     # Main server entry point
├── setup-db.js                  # Database initialization script
├── seed-data.js                 # Seed sample data
├── check-db.js                  # Database connection test
├── package.json
├── .env                         # Environment variables
└── node_modules/
```

### Layer Architecture

```
┌─────────────────────────────────────────────┐
│            Routes Layer                     │
│  (API Endpoint Definitions)                 │
│  - Define HTTP methods & paths              │
│  - Apply middleware (auth, validation)      │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│          Middleware Layer                   │
│  (Request Processing)                       │
│  - authenticate: Verify JWT token           │
│  - authorize: Check user role               │
│  - admin: Ensure admin access               │
│  - CORS, JSON parsing, error handling       │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│         Controllers Layer                   │
│  (Business Logic)                           │
│  - Process request data                     │
│  - Execute business rules                   │
│  - Interact with database                   │
│  - Format responses                         │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│          Database Layer                     │
│  (Data Persistence)                         │
│  - PostgreSQL connection pool               │
│  - Execute SQL queries                      │
│  - Transaction management                   │
└─────────────────────────────────────────────┘
```

### Core Modules

#### 1. **Server Entry Point** (`index.js`)
```javascript
- Initialize Express app
- Configure middleware (CORS, JSON parsing)
- Load environment variables (.env)
- Mount routes:
  * /auth → authRoutes
  * /theater → theaterRoutes
  * /movies → movieRoutes
  * /user → userRoutes
  * /api/bookings → bookingsRoutes, ticketBookingRoutes
  * /api/customers → customerRoutes
- Start server on PORT 3000
```

#### 2. **Controllers** (Business Logic)

**authControllers.js**
- `generateToken(user)` - Create JWT with {id, role, name}
- `registerCustomerController` - Register new customer
- `registerAdminController` - Register admin (requires ADMIN_SECRET)
- `loginController` - Email/password authentication
- `googleAuth` - Google OAuth authentication

**theaterController.js**
- `createTheater` - Create new theater
- `getTheaters` - Get all theaters
- `updateTheater` - Update theater details
- `deleteTheater` - Remove theater
- `createHall` - Add hall to theater
- `getHallsByTheater` - Get halls for theater
- `addSeatsToHall` - Add seats to hall

**movieController.js**
- `createMovie` - Add new movie
- `getMovies` - List all movies
- `getMovieById` - Get movie details
- `updateMovie` - Update movie info
- `deleteMovie` - Remove movie

**ticketBookingControllers.js**
- `createBooking` - Book tickets
- `getBookingsForCustomer` - Customer bookings
- `getBookingById` - Booking details
- `cancelBooking` - Cancel booking
- `createShow` - Schedule show
- `getShowsForMovie` - Get shows for movie
- `getAllShowsByDate` - Get all shows by date
- `getShowsByHall` - Get shows for hall

**priceController.js**
- `createPricingRule` - Set pricing
- `getPricingRules` - Get all pricing
- `updatePricingRule` - Update pricing
- `deletePricingRule` - Remove pricing

#### 3. **Middleware**

**authMiddleware.js**
- `authenticate` - Verify JWT, fetch user from DB, attach to `req.user`
- `authorize(...allowedRoles)` - Check if user has required role
- `admin` - Ensure user is admin or super_admin
- `protect` - Alternative authentication function

**Error Handling**
- `express-async-handler` - Catch async errors
- Global error handler for 500 errors

#### 4. **Routes** (API Endpoint Mapping)

```javascript
Routes → Middleware → Controller

Example:
router.get('/getTheaters', authenticate, getTheaters)
         ↓                ↓              ↓
      Endpoint       Auth Check    Business Logic
```

### Database Connection
```javascript
// config/db.js
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
```

### Environment Variables (.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=filmflex
JWT_SECRET=your_jwt_secret
ADMIN_SECRET=your_admin_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

## 🗄️ Database Schema

### ENUM Types
```sql
user_role: customer, admin, super_admin
seat_type: basic, recliner, vip
payment_status: pending, paid, failed, refunded, cancelled
```

### Tables

#### 1. **users**
```sql
id (SERIAL PK)
name (VARCHAR 100)
email (VARCHAR 150 UNIQUE)
password (VARCHAR 255) - hashed with bcrypt
google_id (VARCHAR 255 UNIQUE) - for OAuth
role (ENUM user_role) - customer/admin/super_admin
created_at (TIMESTAMPTZ)
```

#### 2. **movies**
```sql
id (SERIAL PK)
title (VARCHAR 200)
description (TEXT)
languages (TEXT[]) - array of languages
genre (VARCHAR 50)
release_date (DATE)
poster_url (TEXT)
created_at (TIMESTAMPTZ)
```

#### 3. **theaters**
```sql
id (SERIAL PK)
name (VARCHAR 200)
city (VARCHAR 100)
address (TEXT)
admin_id (INT FK → users.id) - theater owner
created_at (TIMESTAMPTZ)
```

#### 4. **halls**
```sql
id (SERIAL PK)
theater_id (INT FK → theaters.id)
name (VARCHAR 80) - e.g., "Screen 1"
capacity (INT)
created_at (TIMESTAMPTZ)
UNIQUE(theater_id, name)
```

#### 5. **shows**
```sql
id (SERIAL PK)
movie_id (INT FK → movies.id)
hall_id (INT FK → halls.id)
show_time (TIMESTAMPTZ)
language (VARCHAR 50)
created_at (TIMESTAMPTZ)
UNIQUE(hall_id, movie_id, show_time)
```

#### 6. **seats**
```sql
id (SERIAL PK)
hall_id (INT FK → halls.id)
row_label (VARCHAR 5) - e.g., 'A', 'B'
seat_number (INT) - e.g., 1, 2, 3
seat_type (ENUM seat_type)
created_at (TIMESTAMPTZ)
UNIQUE(hall_id, row_label, seat_number)
```

#### 7. **bookings**
```sql
id (SERIAL PK)
user_id (INT FK → users.id)
show_id (INT FK → shows.id)
seat_ids (INT[]) - array of seat IDs
total_price (DECIMAL 10,2)
status (VARCHAR 20) - confirmed/cancelled
created_at (TIMESTAMPTZ)
```

#### 8. **payments**
```sql
id (SERIAL PK)
booking_id (INT FK → bookings.id)
amount (DECIMAL 10,2)
payment_method (VARCHAR 50) - card/upi/wallet
payment_status (ENUM payment_status)
transaction_id (VARCHAR 255)
created_at (TIMESTAMPTZ)
```

#### 9. **pricing_rules**
```sql
id (SERIAL PK)
theater_id (INT FK → theaters.id)
hall_id (INT FK → halls.id)
seat_type (ENUM seat_type)
price (DECIMAL 10,2)
created_at (TIMESTAMPTZ)
```

### Entity Relationships
```
users 1──────* theaters (admin_id)
theaters 1───* halls
halls 1──────* seats
halls 1──────* shows
movies 1─────* shows
shows 1──────* bookings
users 1──────* bookings
bookings 1───1 payments
theaters 1───* pricing_rules
halls 1──────* pricing_rules
```

---

## 🔌 API Endpoints

### Authentication Routes (`/auth`)
```
POST   /auth/register/customer      - Register new customer
POST   /auth/register/admin         - Register new admin (requires ADMIN_SECRET)
POST   /auth/login                  - Email/password login
POST   /auth/google                 - Google OAuth login
GET    /auth/me                     - Get current user info (protected)
```

### Theater Routes (`/theater`)
```
POST   /theater/createTheater       - Create theater (admin only)
GET    /theater/getTheaters         - Get all theaters (authenticated)
PUT    /theater/updateTheater/:id   - Update theater (admin only)
DELETE /theater/deleteTheater/:id   - Delete theater (admin only)
POST   /theater/:theaterId/halls    - Create hall (admin only)
GET    /theater/:theaterId/halls    - Get halls for theater (authenticated)
PUT    /theater/halls/:hallId       - Update hall (admin only)
DELETE /theater/halls/:hallId       - Delete hall (admin only)
POST   /theater/halls/:hallId/seats - Add seats to hall (admin only)
GET    /theater/cities              - Get all cities (public)
```

### Movie Routes (`/movies`)
```
POST   /movies/create               - Create movie (admin only)
GET    /movies/all                  - Get all movies (public)
GET    /movies/:id                  - Get movie by ID (public)
PUT    /movies/:id                  - Update movie (admin only)
DELETE /movies/:id                  - Delete movie (admin only)
```

### Booking Routes (`/api/bookings`)
```
POST   /api/bookings/book           - Create booking (authenticated)
GET    /api/bookings/my-bookings    - Get customer bookings (authenticated)
GET    /api/bookings/:id            - Get booking by ID (authenticated)
PUT    /api/bookings/:id/cancel     - Cancel booking (authenticated)
GET    /api/bookings/my-theater     - Get bookings for admin's theater (admin)
PUT    /api/bookings/:id/status     - Update booking status (admin)
```

### Show Routes (`/api/bookings`)
```
POST   /api/bookings/shows          - Create show (admin only)
GET    /api/bookings/shows          - Get shows for movie (public)
GET    /api/bookings/shows/all      - Get all shows by date (public)
GET    /api/bookings/hall/:hallId/shows - Get shows for hall (public)
```

### Customer Routes (`/api/customers`)
```
GET    /api/customers/profile       - Get customer profile (authenticated)
PUT    /api/customers/profile       - Update customer profile (authenticated)
PUT    /api/customers/password      - Change password (authenticated)
```

### User Routes (`/user`)
```
GET    /user/all                    - Get all users (admin only)
GET    /user/:id                    - Get user by ID (admin only)
DELETE /user/:id                    - Delete user (super_admin only)
```

### Pricing Routes (`/prices`)
```
POST   /prices/create               - Create pricing rule (admin only)
GET    /prices/list                 - Get pricing rules (admin only)
PUT    /prices/:id                  - Update pricing rule (admin only)
DELETE /prices/:id                  - Delete pricing rule (admin only)
```

---

## 🔐 Authentication & Authorization

### JWT Token Structure
```javascript
{
  id: user.id,           // User ID
  role: user.role,       // customer/admin/super_admin
  name: user.name,       // User's full name
  exp: <timestamp>       // Expiration (7 days)
}
```

### Authentication Flow

#### 1. **Email/Password Registration**
```
Client                    Server                  Database
  │                         │                         │
  ├──POST /auth/register──→│                         │
  │  {email, password}      │                         │
  │                         ├──Hash password (bcrypt)─┤
  │                         │                         │
  │                         ├──INSERT user──────────→│
  │                         │                         │
  │                         │←──Return user.id───────┤
  │                         │                         │
  │                         ├──Generate JWT token────│
  │                         │                         │
  │←──{token, user}────────┤                         │
  │                         │                         │
  └─Store token (localStorage)                       │
```

#### 2. **Login**
```
Client                    Server                  Database
  │                         │                         │
  ├──POST /auth/login─────→│                         │
  │  {email, password}      │                         │
  │                         ├──Query user by email──→│
  │                         │                         │
  │                         │←──Return user data─────┤
  │                         │                         │
  │                         ├──Compare passwords─────│
  │                         │  (bcrypt.compare)       │
  │                         │                         │
  │                         ├──Generate JWT token────│
  │                         │                         │
  │←──{token, user}────────┤                         │
  │                         │                         │
  └─Store token (localStorage)                       │
```

#### 3. **Google OAuth**
```
Client                    Server                  Google
  │                         │                         │
  ├──POST /auth/google────→│                         │
  │  {credential: token}    │                         │
  │                         ├──Verify token─────────→│
  │                         │                         │
  │                         │←──User info────────────┤
  │                         │  {email, name, sub}     │
  │                         │                         │
  │                         ├──Check if user exists──│
  │                         │  or create new user     │
  │                         │                         │
  │                         ├──Generate JWT token────│
  │                         │                         │
  │←──{token, user}────────┤                         │
```

#### 4. **Protected Route Access**
```
Client                    Server                  Database
  │                         │                         │
  ├──GET /api/bookings────→│                         │
  │  Authorization: Bearer <token>                   │
  │                         │                         │
  │                         ├──Verify JWT────────────│
  │                         │  jwt.verify()           │
  │                         │                         │
  │                         ├──Decode token──────────│
  │                         │  {id, role, name}       │
  │                         │                         │
  │                         ├──Query user by id─────→│
  │                         │                         │
  │                         │←──Return user data─────┤
  │                         │                         │
  │                         ├──Attach to req.user────│
  │                         │                         │
  │                         ├──Check authorization───│
  │                         │  (role check)           │
  │                         │                         │
  │                         ├──Execute controller────│
  │                         │                         │
  │←──Response data────────┤                         │
```

### Authorization Middleware

**authenticate()**
- Verifies JWT token from Authorization header
- Decodes token to get user ID
- Fetches user from database
- Attaches user to `req.user`
- Returns 401 if token invalid

**authorize(...allowedRoles)**
- Checks if `req.user.role` is in allowed roles
- Returns 403 if unauthorized
- Example: `authorize('admin', 'super_admin')`

**admin()**
- Ensures user is admin or super_admin
- Shorthand for `authorize('admin', 'super_admin')`

### Role-Based Access Control

```javascript
customer:
  - Book tickets
  - View own bookings
  - Update profile
  - Cancel bookings

admin:
  - All customer permissions
  - Create/manage theaters
  - Schedule shows
  - View theater bookings
  - Configure pricing

super_admin:
  - All admin permissions
  - Delete users
  - Access all theaters
  - System-level operations
```

---

## 🔄 Data Flow

### Example: Movie Ticket Booking Flow

```
┌─────────────────────────────────────────────────────────────┐
│  1. Browse Movies                                           │
│  Client: GET /movies/all                                     │
│  Server: Return all movies from database                     │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│  2. Select Movie                                            │
│  Client: GET /movies/:movieId                                │
│  Server: Return movie details + available shows              │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│  3. Select Show                                             │
│  Client: Navigate to /shows/:showId                          │
│  Server: GET /api/bookings/shows?movieId=X                   │
│  Return: Show details, hall info, available seats            │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│  4. Select Seats                                            │
│  Client: Interactive seat selection (SeatSelector component) │
│  State: Track selected seats in React state                  │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│  5. Payment                                                 │
│  Client: Navigate to /payment with booking details           │
│  User fills: Payment method (Card/UPI/Wallet)               │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│  6. Create Booking                                          │
│  Client: POST /api/bookings/book                             │
│  Body: {showId, seatIds, paymentMethod, amount}             │
│  Server:                                                     │
│    - Verify seats available                                  │
│    - Create booking record                                   │
│    - Create payment record                                   │
│    - Mark seats as booked                                    │
│    - Return booking confirmation                             │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│  7. Confirmation                                            │
│  Client: Display booking confirmation                        │
│  Store: Booking ID in localStorage/state                     │
│  Navigate: To /customer/bookings                             │
└─────────────────────────────────────────────────────────────┘
```

### State Management Flow

```
User Action → Event Handler → API Call → Server Processing
                                              ↓
    UI Update ← State Update ← Response ← Database Query
```

---

## 📝 Development Guidelines

### Client-Side Best Practices
1. **Component Structure**: Keep components focused and reusable
2. **State Management**: Use local state for UI, API calls for data
3. **Error Handling**: Display user-friendly error messages
4. **Loading States**: Show loading indicators during API calls
5. **Responsive Design**: Mobile-first approach with Tailwind
6. **Code Splitting**: Use React.lazy() for route-based splitting

### Server-Side Best Practices
1. **Error Handling**: Use try-catch and express-async-handler
2. **Validation**: Validate all input data before processing
3. **Security**: Never expose sensitive data in responses
4. **Database**: Use parameterized queries to prevent SQL injection
5. **Authentication**: Always verify JWT tokens for protected routes
6. **Logging**: Log errors and important operations

### Database Best Practices
1. **Indexes**: Add indexes on frequently queried columns
2. **Constraints**: Use UNIQUE, NOT NULL, CHECK constraints
3. **Foreign Keys**: Maintain referential integrity
4. **Transactions**: Use transactions for multi-step operations
5. **Connection Pooling**: Reuse database connections

---

## 🚀 Deployment Considerations

### Environment Setup
- **Development**: localhost:5174 (client), localhost:3000 (server)
- **Production**: Deploy client (Vercel/Netlify) and server (Heroku/AWS) separately
- **Database**: PostgreSQL on cloud (AWS RDS, Heroku Postgres)

### Security Checklist
- ✅ Use HTTPS in production
- ✅ Set secure JWT_SECRET (long, random)
- ✅ Enable CORS only for trusted origins
- ✅ Hash passwords with bcrypt
- ✅ Validate and sanitize all inputs
- ✅ Use environment variables for secrets
- ✅ Implement rate limiting
- ✅ Set secure HTTP headers (helmet.js)

### Performance Optimization
- **Client**: Code splitting, lazy loading, image optimization
- **Server**: Caching, connection pooling, query optimization
- **Database**: Indexes, query optimization, connection limits

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [JWT Authentication Guide](https://jwt.io/introduction)

---

**Document Version**: 1.0  
**Last Updated**: November 13, 2025  
**Maintained By**: FilmFlex Development Team
