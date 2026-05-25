const logger = require('../utils/logger');

const sendSMS = async (phoneNumber, message) => {
  try {
    logger.info(`SMS would be sent to ${phoneNumber}: ${message}`);
    
    return { success: true, message: 'SMS sent successfully' };
  } catch (error) {
    logger.error(`Failed to send SMS to ${phoneNumber}: ${error.message}`);
    return { success: false, error: error.message };
  }
};

const sendAppointmentConfirmation = async (phoneNumber, appointmentDetails) => {
  const message = `Your appointment is confirmed for ${appointmentDetails.date} at ${appointmentDetails.time} with Dr. ${appointmentDetails.doctorName}. Please arrive 10 minutes early. - Bireena Medico`;
  
  return await sendSMS(phoneNumber, message);
};

const sendAppointmentReminder = async (phoneNumber, appointmentDetails) => {
  const message = `Reminder: Your appointment is scheduled for tomorrow (${appointmentDetails.date}) at ${appointmentDetails.time} with Dr. ${appointmentDetails.doctorName}. - Bireena Medico`;
  
  return await sendSMS(phoneNumber, message);
};

const sendOTP = async (phoneNumber, otp) => {
  const message = `Your verification code is: ${otp}. This code will expire in 10 minutes. - Bireena Medico`;
  
  return await sendSMS(phoneNumber, message);
};

module.exports = {
  sendSMS,
  sendAppointmentConfirmation,
  sendAppointmentReminder,
  sendOTP
};