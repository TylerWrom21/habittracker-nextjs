/**
 * Returns error response based on environment
 * Production: returns empty object {}
 * Development: returns detailed error message
 */
export function getErrorResponse(message: string) {
  if (process.env.NODE_ENV === "production") {
    return {};
  }
  return { error: message };
}
