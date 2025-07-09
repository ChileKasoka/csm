<template>
  <div class="container">
    <div class="title">
      <div class="header">
        <h1>Assignment Permissions</h1>
      </div>

      <div class="actions">
        <router-link to="/create-permission" class="create-btn">Create New Permission</router-link>
      </div>
    </div>

    <div class="bulk-actions" style="margin-bottom: 1.5rem;">
      <label for="role">Choose Role:</label>
      <select v-model="selectedRoleId" id="role">
        <option disabled value="">-- Select Role --</option>
        <option v-for="role in roles" :value="role.id" :key="role.id">
          {{ role.name }}
        </option>
      </select>

      <button @click="assignPermissions" class="assign-confirm" :disabled="selectedPermissionIds.length === 0 || !selectedRoleId">
        Assign Selected Permissions
      </button>
    </div>

    <div class="table-wrapper">
      <table class="permissions-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Permission</th>
            <th>Method</th>
            <th>Path</th>
            <th>Assign</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(perm, index) in permissions" :key="perm.id">
            <td>{{ index + 1 }}</td>
            <td>{{ perm.name }}</td>
            <td><span class="method">{{ perm.method }}</span></td>
            <td class="path">{{ perm.path }}</td>
            <td>
              <input
                type="checkbox"
                v-model="selectedPermissionIds"
                :value="perm.id"
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="permissions.length === 0" class="empty">
        No permissions found.
      </div>
    </div>
  </div>
</template>

<script>
const API_BASE_URL = process.env.VUE_APP_BASE_URL || 'http://localhost:8080';


export default {
  name: 'AssignmentPermissions',
  data() {
    return {
      permissions: [],
      roles: [],
      selectedRoleId: null,
      selectedPermissionIds: [],
      token: null,
      currentUser: null,
    };
  },
  mounted() {
    const rawToken = localStorage.getItem('access_token');
    try {
      const parsed = JSON.parse(rawToken);
      this.token = parsed.access_token;
    } catch (e) {
      this.token = rawToken;
    }

    const userData = localStorage.getItem('user');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }

    this.fetchPermissions();
    this.fetchRoles();
  },
  methods: {
    async fetchPermissions() {
      try {
        const res = await fetch(`${API_BASE_URL}/permissions`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
        this.permissions = await res.json();
      } catch (err) {
        console.error('Failed to fetch permissions:', err);
      }
    },
    async fetchRoles() {
      try {
        const res = await fetch(`${API_BASE_URL}/roles`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
        this.roles = await res.json();
      } catch (err) {
        console.error('Failed to fetch roles:', err);
      }
    },
    async assignPermissions() {
      if (!this.selectedRoleId) {
        alert('Please select a role');
        return;
      }
      if (this.selectedPermissionIds.length === 0) {
        alert('Please select at least one permission');
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/role-permissions/${this.selectedRoleId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.token}`,
            },
            body: JSON.stringify({
              permission_ids: this.selectedPermissionIds,
            }),
          }
        );

        if (!response.ok) throw new Error('Assignment failed');
        alert('Permissions assigned to role successfully');

        this.selectedPermissionIds = [];
        this.selectedRoleId = null;
      } catch (err) {
        console.error('Error assigning permissions:', err);
        alert('Failed to assign permissions');
      }
    },
  },
};
</script>

<style scoped>
.container {
  padding-top: 2rem;
}
.title {
  display: flex;
  font-weight: bold;
  margin-bottom: 2rem;
  justify-content: space-between;
}
.table-wrapper {
  background: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
}
.permissions-table {
  width: 100%;
  border-collapse: collapse;
}
.permissions-table th,
.permissions-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f3f4f6;
}
.permissions-table tr:hover {
  background-color: #f9fafb;
}
.method {
  background-color: #e0f2fe;
  color: #0369a1;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
}
.path {
  font-family: monospace;
  color: #374151;
}
.bulk-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.assign-confirm {
  background-color: #10b981;
  color: white;
  font-weight: 600;
  padding: 0.6rem 1.25rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
}
.assign-confirm:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}
.assign-confirm:hover {
  background-color: #059669;
}
.create-btn {
  background-color: yellow;
  color: black;
  padding: 0.5rem 1rem;
  font-weight: bold;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  text-decoration: none;
}
.create-btn:hover {
  background-color: white;
}
</style>
