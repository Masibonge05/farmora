export async function apiRequest(path, { token, method = 'GET', baseUrl = import.meta.env.VITE_API_URL || '', headers = {}, body } = {}) {
  const base = baseUrl.replace(/\/$/, '')
  const url = path.startsWith('http') ? path : `${base}/${path.replace(/^\//, '')}`

  const h = { 'Content-Type': 'application/json', ...headers }
  if (token) h['Authorization'] = `Bearer ${token}`

  const res = await fetch(url, {
    method,
    headers: h,
    body: body ? JSON.stringify(body) : undefined,
  })

  const text = await res.text()
  try {
    const json = text ? JSON.parse(text) : null
    if (!res.ok) throw new Error(json && json.error ? JSON.stringify(json) : res.statusText)
    return json
  } catch (err) {
    if (!res.ok) throw new Error(text || res.statusText)
    return text
  }
}

