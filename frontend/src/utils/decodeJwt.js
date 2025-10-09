export function decodeJwt(token) {
  if (!token) return null;
  try {
    const parts = token.split('.');
    const payload = parts[1];
    const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return json;
  } catch (e) {
    return null;
  }
}
