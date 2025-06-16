export function getPermissions() {
  try {
    const perms = localStorage.getItem('permissions');
    return perms ? JSON.parse(perms) : [];
  } catch (e) {
    return [];
  }
}

export function hasPermission(name) {
  const permissions = getPermissions();
  return Array.isArray(permissions) && permissions.some((perm) => perm.name === name);
}
