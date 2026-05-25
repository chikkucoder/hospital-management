# Hospital Management System Backend

MERN Stack Hospital Management System Backend - Team 1 Dev 2 (Auth APIs + RBAC)

## Status

**Your Dev2 Deliverable (Auth APIs + RBAC):** ✅ 100% Complete  
**Full Backend Project:** ❌ ~15% Complete (Only Auth Module)

## What's Complete (Dev2 Scope)

### Authentication & Authorization
- ✅ User Registration (public + admin-only)
- ✅ User Login with JWT
- ✅ User Logout
- ✅ Get/Update Profile
- ✅ Change Password
- ✅ Forgot Password (token-based reset)
- ✅ Reset Password
- ✅ Account Lockout (5 failed attempts = 30 min lock)
- ✅ Role-Based Access Control (5 roles)
- ✅ Permission-based Access Control
- ✅ Resource-based Access Control

### Admin User Management
- ✅ List all users (pagination, filtering)
- ✅ Activate user account
- ✅ Deactivate user account
- ✅ Change user role

### Security
- ✅ Password hashing (bcrypt, 12 salt rounds)
- ✅ JWT token generation/verification
- ✅ Token expiration handling
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ Helmet security headers
- ✅ Input validation (express-validator)

### Testing & Documentation
- ✅ Auth tests (Jest + Supertest)
- ✅ Seed admin script
- ✅ .env.example template

## What's NOT Complete (Other Teams)

- ❌ Patient Management (Team 2 Dev1)
- ❌ Doctor Management (Team 2 Dev2)
- ❌ Appointment System (Team 2 Dev3)
- ❌ EMR (Team 2 Dev4)
- ❌ Billing (Team 3 Dev1)
- ❌ Pharmacy (Team 3 Dev2)
- ❌ Lab (Team 3 Dev3)
- ❌ Analytics + AI (Team 3 Dev4)
- ❌ Dashboard (Team 1 Dev3)
- ❌ Landing Page (Team 1 Dev1)
- ❌ Admin Panel (Team 1 Dev4)

## Installation

```bash
npm install
```

## Environment Setup

1. Copy `.env.example` to `.env`
2. Fill in your environment variables:
   - `MONGODB_URI` - MongoDB connection string
   - `JWT_SECRET` - JWT secret key
   - `FRONTEND_URL` - Frontend URL
   - Admin credentials (optional, for seeding)

## Database Setup

```bash
# Start MongoDB (if using local)
mongod

# Seed default admin user
npm run seed:admin
```

## Running the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## API Endpoints

### Public Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `PUT /api/auth/reset-password/:token` - Reset password

### Protected Routes (Requires JWT)
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - Logout user
- `PUT /api/auth/change-password` - Change password

### Admin Routes (Requires Admin Role)
- `POST /api/auth/register/admin` - Register admin user
- `GET /api/auth/users` - List all users
- `PATCH /api/auth/users/:id/activate` - Activate user
- `PATCH /api/auth/users/:id/deactivate` - Deactivate user
- `PATCH /api/auth/users/:id/role` - Change user role

### Health Check
- `GET /api/health` - Server health check

## Roles

- `admin` - Full system access
- `doctor` - Patient care, prescriptions
- `receptionist` - Patient registration, appointments
- `lab_staff` - Lab reports, tests
- `pharmacist` - Medicine inventory, dispensing

## Integration with Other Modules

Your auth module is ready for integration. Other teams can:

1. **Use the `protect` middleware** to protect their routes:
   ```javascript
   const protect = require('../middleware/authMiddleware');
   router.get('/patients', protect, patientController.getAllPatients);
   ```

2. **Use the `authorize` middleware** for role-based access:
   ```javascript
   const { authorize } = require('../middleware/roleMiddleware');
   router.post('/prescriptions', protect, authorize('doctor'), createPrescription);
   ```

3. **Use the `checkPermission` middleware** for fine-grained permissions:
   ```javascript
   const { checkPermission } = require('../middleware/roleMiddleware');
   router.delete('/patients/:id', protect, checkPermission('manage_patients'), deletePatient);
   ```

4. **Access the authenticated user** via `req.user`:
   ```javascript
   const userId = req.user.id;
   const userRole = req.user.role;
   ```

## Project Structure

```
backend/
├── config/
│   ├── db.js              # Database connection
│   └── cloudinary.js      # Cloudinary config
├── controllers/
│   └── authController.js  # Auth logic
├── middleware/
│   ├── authMiddleware.js  # JWT authentication
│   ├── roleMiddleware.js  # RBAC
│   └── errorMiddleware.js # Error handling
├── models/
│   └── User.js            # User schema
├── routes/
│   └── authRoutes.js      # Auth routes
├── services/
│   └── (to be added by other teams)
├── utils/
│   ├── generateToken.js   # JWT token generation
│   ├── logger.js          # Winston logger
│   └── seedAdmin.js       # Admin seed script
├── tests/
│   └── auth.test.js       # Auth tests
├── logs/                  # Log files
├── .env.example
├── .gitignore
├── app.js
├── server.js
└── package.json
```

## Notes for Other Teams

- The `User` model is in `models/User.js`
- Use `req.user.id` to get the authenticated user's ID
- Use `req.user.role` to check the user's role
- All protected routes must include the `Authorization: Bearer <token>` header
- Default admin credentials are set in `.env` or use the seed script

## License

ISC
