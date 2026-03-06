/**
 * Returns error response with message
 * Always returns the error message for proper client-side handling
 */
export function getErrorResponse(message: string) {
  return { error: message };
}
