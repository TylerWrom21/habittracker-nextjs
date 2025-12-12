export async function POST() {
  const response = new Response(JSON.stringify({ message: "Logged out" }), {
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': 'authToken=; Path=/; Max-Age=0; HttpOnly=true; SameSite=lax'
    }
  });
  return response;
}
