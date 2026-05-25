const express = require('express');
const { body } = require('express-validator');
const { asyncHandler } = require('../middleware/errorMiddleware');
const protect = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  logoutUser,
  changePassword,
  forgotPassword,
  resetPassword,
  getAllUsers,
  activateUser,
  deactivateUser,
  changeUserRole
} = require('../controllers/authController');

const router = express.Router();

// Debug route to test if routes are loading
router.get('/test', (req, res) => {
  res.status(200).json({ success: true, message: 'Auth routes are loaded' });
});

// Validation middleware for user registration
const validateRegister = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage('Email cannot exceed 100 characters'),
  
  body('password')
    .isLength({ min: 6, max: 128 })
    .withMessage('Password must be between 6 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('phone')
    .matches(/^[0-9]{10}$/)
    .withMessage('Phone number must be exactly 10 digits'),
  
  body('role')
    .optional()
    .isIn(['admin', 'doctor', 'receptionist', 'lab_staff', 'pharmacist'])
    .withMessage('Role must be one of: admin, doctor, receptionist, lab_staff, pharmacist'),
  
  // Role-specific validations
  body('specialization')
    .if(body('role').equals('doctor'))
    .notEmpty()
    .withMessage('Specialization is required for doctors')
    .isLength({ min: 2, max: 100 })
    .withMessage('Specialization must be between 2 and 100 characters'),
  
  body('licenseNumber')
    .if(body('role').equals('doctor'))
    .notEmpty()
    .withMessage('License number is required for doctors')
    .matches(/^[A-Z0-9]{6,20}$/)
    .withMessage('License number must be 6-20 alphanumeric characters'),
  
  body('employeeId')
    .if(body('role').custom(value => ['receptionist', 'lab_staff', 'pharmacist'].includes(value)))
    .notEmpty()
    .withMessage('Employee ID is required for staff roles')
    .matches(/^[A-Z]{2,4}\d{3,6}$/)
    .withMessage('Employee ID must be 2-4 letters followed by 3-6 digits'),
  
  body('department')
    .if(body('role').custom(value => ['receptionist', 'lab_staff', 'pharmacist'].includes(value)))
    .notEmpty()
    .withMessage('Department is required for staff roles')
    .isLength({ min: 2, max: 50 })
    .withMessage('Department must be between 2 and 50 characters')
];

// Validation middleware for user login
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Validation middleware for profile update
const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('phone')
    .optional()
    .matches(/^[0-9]{10}$/)
    .withMessage('Phone number must be exactly 10 digits'),
  
  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL')
];

// Validation middleware for change password
const validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 6, max: 128 })
    .withMessage('New password must be between 6 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// Validation middleware for forgot password
const validateForgotPassword = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
];

// Validation middleware for reset password
const validateResetPassword = [
  body('password')
    .isLength({ min: 6, max: 128 })
    .withMessage('Password must be between 6 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// Validation middleware for role change
const validateRoleChange = [
  body('role')
    .isIn(['admin', 'doctor', 'receptionist', 'lab_staff', 'pharmacist'])
    .withMessage('Role must be one of: admin, doctor, receptionist, lab_staff, pharmacist')
];

// Validation middleware for admin registration
const validateAdminRegister = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage('Email cannot exceed 100 characters'),
  
  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('Admin password must be between 8 and 128 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Admin password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  body('phone')
    .matches(/^[0-9]{10}$/)
    .withMessage('Phone number must be exactly 10 digits'),
  
  body('role')
    .isIn(['admin', 'doctor', 'receptionist', 'lab_staff', 'pharmacist'])
    .withMessage('Role must be one of: admin, doctor, receptionist, lab_staff, pharmacist'),
  
  // Role-specific validations for admin registration
  body('specialization')
    .if(body('role').equals('doctor'))
    .notEmpty()
    .withMessage('Specialization is required for doctors')
    .isLength({ min: 2, max: 100 })
    .withMessage('Specialization must be between 2 and 100 characters'),
  
  body('licenseNumber')
    .if(body('role').equals('doctor'))
    .notEmpty()
    .withMessage('License number is required for doctors')
    .matches(/^[A-Z0-9]{6,20}$/)
    .withMessage('License number must be 6-20 alphanumeric characters'),
  
  body('employeeId')
    .if(body('role').custom(value => ['receptionist', 'lab_staff', 'pharmacist'].includes(value)))
    .notEmpty()
    .withMessage('Employee ID is required for staff roles')
    .matches(/^[A-Z]{2,4}\d{3,6}$/)
    .withMessage('Employee ID must be 2-4 letters followed by 3-6 digits'),
  
  body('department')
    .if(body('role').custom(value => ['receptionist', 'lab_staff', 'pharmacist'].includes(value)))
    .notEmpty()
    .withMessage('Department is required for staff roles')
    .isLength({ min: 2, max: 50 })
    .withMessage('Department must be between 2 and 50 characters')
];

// Public routes
router.post('/register', validateRegister, asyncHandler(registerUser));
router.post('/login', validateLogin, asyncHandler(loginUser));

// Protected routes
router.get('/profile', protect, asyncHandler(getProfile));
router.put('/profile', protect, validateProfileUpdate, asyncHandler(updateProfile));
router.post('/logout', protect, asyncHandler(logoutUser));
router.put('/change-password', protect, validateChangePassword, asyncHandler(changePassword));

// Public routes for password reset
router.post('/forgot-password', validateForgotPassword, asyncHandler(forgotPassword));
router.put('/reset-password/:token', validateResetPassword, asyncHandler(resetPassword));

// Admin-only routes
router.post('/register/admin',
  protect,
  authorize('admin'),
  validateAdminRegister,
  asyncHandler(registerUser)
);

router.get('/users',
  protect,
  authorize('admin'),
  asyncHandler(getAllUsers)
);

router.patch('/users/:id/activate',
  protect,
  authorize('admin'),
  asyncHandler(activateUser)
);

router.patch('/users/:id/deactivate',
  protect,
  authorize('admin'),
  asyncHandler(deactivateUser)
);

router.patch('/users/:id/role',
  protect,
  authorize('admin'),
  validateRoleChange,
  asyncHandler(changeUserRole)
);

module.exports = router;