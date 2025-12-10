export async function apiClient(url: string, options: RequestInit = {}) {
  const opts = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  };

  const res = await fetch(url, opts);

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "API error");
  }

  return res.json();
}
