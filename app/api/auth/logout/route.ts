export async function POST() {
  const response = new Response(JSON.stringify({ message: "Logged out" }), {
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': 'session_token=; Path=/; Domain=localhost; Max-Age=0; HttpOnly=false; SameSite=lax'
    }
  });
  return response;
}
