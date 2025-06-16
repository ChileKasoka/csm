export function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('permissions');
  localStorage.removeItem('access_token');
  window.location.href = '/login';
}