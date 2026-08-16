import validator from 'validator';

/**
 * Validate email
 */
export const isValidEmail = (email) => {
  return validator.isEmail(email);
};

/**
 * Validate password strength
 * Requirements:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export const isStrongPassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

/**
 * Validate password complexity
 */
export const getPasswordStrength = (password) => {
  let strength = 0;
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&]/.test(password),
  };

  Object.values(checks).forEach((check) => {
    if (check) strength++;
  });

  return {
    score: strength,
    feedback: getPasswordFeedback(checks),
  };
};

/**
 * Get password feedback
 */
const getPasswordFeedback = (checks) => {
  const feedback = [];

  if (!checks.length) feedback.push('Password must be at least 8 characters long');
  if (!checks.uppercase) feedback.push('Add uppercase letters');
  if (!checks.lowercase) feedback.push('Add lowercase letters');
  if (!checks.number) feedback.push('Add numbers');
  if (!checks.special) feedback.push('Add special characters (@$!%*?&)');

  return feedback;
};
