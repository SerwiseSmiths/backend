export function generateReferenceCode() {
  // Example: 6-digit alphanumeric code
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}