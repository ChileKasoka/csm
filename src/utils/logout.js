import router from '../router'

export function logout() {
  localStorage.removeItem('user');
  localStorage.removeItem('permissions');
  localStorage.removeItem('access_token');
  
  router.push('/login');
}
