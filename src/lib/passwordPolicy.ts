const COMMON_PASSWORDS = new Set([
  "password", "password1", "12345678", "123456789", "qwertyui",
  "admin123", "letmein1", "welcome1", "iloveyou", "abc12345",
]);

/** Returns an error message if the password is too weak, or null if it's fine. */
export function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return "Password must contain at least one letter and one number.";
  }
  if (COMMON_PASSWORDS.has(password.toLowerCase())) {
    return "That password is too common. Please choose a different one.";
  }
  return null;
}
