export async function get<TResult>(url: string) {
  return await request<TResult>("GET", url);
}

export async function post<TResult>(url: string, body: unknown) {
  return await request<TResult>("POST", url, body);
}

export async function put<TResult>(url: string, body: unknown) {
  return await request<TResult>("PUT", url, body);
}

export async function patch<TResult>(url: string, body: unknown) {
  return await request<TResult>("PATCH", url, body);
}

export async function del<TResult>(url: string) {
  return await request<TResult>("DELETE", url);
}

async function request<TResult>(method: string, url: string, body?: unknown) {
  const response = await fetch("http://localhost:5111/api/" + url, {
    method: method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      Origin: window.location.host,
      "Content-Type": "application/json; charset=utf-8",
    },
  });

  const json = await response.json();

  return json as TResult;
}
