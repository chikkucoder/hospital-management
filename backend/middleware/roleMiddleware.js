const logger = require('../utils/logger');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      logger.warn(`Access denied for user ${req.user.email} with role ${req.user.role}. Required roles: ${roles.join(', ')}`);
      
      return res.status(403).json({
        success: false,
        message: `Access denied. ${req.user.role} role is not authorized to access this resource.`,
        required: roles
      });
    }
    
    next();
  };
};

const checkPermission = (permission) => {
  const rolePermissions = {
    admin: [
      'manage_users', 'manage_patients', 'manage_doctors', 'manage_appointments',
      'manage_billing', 'manage_pharmacy', 'manage_lab', 'view_analytics', 'system_settings'
    ],
    doctor: [
      'view_assigned_patients', 'create_prescriptions', 'view_medical_records',
      'upload_reports', 'manage_appointments'
    ],
    receptionist: [
      'register_patients', 'book_appointments', 'manage_appointments',
      'view_patient_info', 'generate_bills'
    ],
    lab_staff: [
      'upload_lab_reports', 'manage_tests', 'view_patient_tests', 'update_test_status'
    ],
    pharmacist: [
      'manage_medicine_inventory', 'dispense_medicine', 'view_prescriptions',
      'manage_stock', 'generate_bills'
    ]
  };

  return (req, res, next) => {
    const userRole = req.user.role;
    const permissions = rolePermissions[userRole] || [];

    if (!permissions.includes(permission)) {
      logger.warn(`Permission denied for user ${req.user.email} with role ${userRole}. Required permission: ${permission}`);
      
      return res.status(403).json({
        success: false,
        message: `Permission denied. ${userRole} role does not have '${permission}' permission.`,
        required: permission
      });
    }

    next();
  };
};

const checkResourceAccess = (resourceType) => {
  return (req, res, next) => {
    const user = req.user;
    let hasAccess = false;

    switch (resourceType) {
      case 'own_profile':
        hasAccess = req.params.id === user._id.toString();
        break;
      
      case 'assigned_patients':
        hasAccess = user.role === 'doctor' || user.role === 'admin';
        break;
      
      case 'all_patients':
        hasAccess = ['admin', 'receptionist'].includes(user.role);
        break;
      
      default:
        hasAccess = false;
    }

    if (!hasAccess) {
      logger.warn(`Resource access denied for user ${user.email} with role ${user.role} for resource: ${resourceType}`);
      
      return res.status(403).json({
        success: false,
        message: `Access denied. You don't have permission to access this ${resourceType}.`
      });
    }

    next();
  };
};

module.exports = {
  authorize,
  checkPermission,
  checkResourceAccess
};