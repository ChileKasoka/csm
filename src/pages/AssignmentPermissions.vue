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


    <div class="table-wrapper">
      <table class="permissions-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Permission</th>
            <th>Method</th>
            <th>Path</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(perm, index) in permissions" :key="perm.id">
            <td>{{ index + 1 }}</td>
            <td>{{ perm.name }}</td>
            <td><span class="method">{{ perm.method }}</span></td>
            <td class="path">{{ perm.path }}</td>
            <td>
              <button @click="openModal(perm)" class="assign-btn">Assign</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="permissions.length === 0" class="empty">
        No permissions found.
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h2>Assign Permission</h2>
        <p>Permission: <strong>{{ selectedPermission.name }}</strong></p>

        <label for="role">Choose Role:</label>
        <select v-model="selectedRoleId" id="role">
          <option v-for="role in roles" :value="role.id" :key="role.id">
            {{ role.name }}
          </option>
        </select>

        <div class="modal-actions">
          <button @click="assignPermission" class="assign-confirm">Assign</button>
          <button @click="closeModal" class="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AssignmentPermissions',
  data() {
    return {
      permissions: [],
      roles: [],
      selectedPermission: null,
      selectedRoleId: null,
      showModal: false,
      token: null,
      currentUser: null,
    };
  },
mounted() {
  const rawToken = localStorage.getItem('access_token');

  try {
    const parsed = JSON.parse(rawToken);
    this.token = parsed.access_token; // extract only the actual JWT
  } catch (e) {
    this.token = rawToken; // fallback if it's already just the token string
  }

  const userData = localStorage.getItem('user');
  if (userData) {
    this.currentUser = JSON.parse(userData);
  }

  this.fetchPermissions();
  this.fetchRoles();
}
,
  methods: {
    async fetchPermissions() {
      try {
        const res = await fetch('http://localhost:8080/permissions', {
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
        const res = await fetch('http://localhost:8080/roles', {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
        this.roles = await res.json();
      } catch (err) {
        console.error('Failed to fetch roles:', err);
      }
    },
    openModal(permission) {
      this.selectedPermission = permission;
      this.showModal = true;
    },
    closeModal() {
      this.selectedPermission = null;
      this.selectedRoleId = null;
      this.showModal = false;
    },
    async assignPermission() {
      if (!this.selectedRoleId) return alert('Please select a role');

      try {
        const response = await fetch(
          `http://localhost:8080/role-permissions/${this.selectedRoleId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.token}`,
            },
            body: JSON.stringify({
              permission_ids: [this.selectedPermission.id],
            }),
          }
        );

        if (!response.ok) throw new Error('Assignment failed');
        alert('Permission assigned to role successfully');
        this.closeModal();
      } catch (err) {
        console.error('Error assigning permission:', err);
        alert('Failed to assign permission');
      }
    },
  },
};
</script>


<style scoped>
.container {
  padding: 2rem;
}
.title {
  display: flex;
  font-weight: bold;
  margin-bottom: 1rem;
  justify-content: space-between;
}
.table-wrapper {
  background: #fff;
  border-radius: 0.75rem;
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
.assign-btn {
  background-color: #3b82f6;
  color: white;
  padding: 0.4rem 0.75rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
}
.assign-btn:hover {
  background-color: #2563eb;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  width: 90%;
  max-width: 400px;
}
.modal h2 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}
.modal label {
  display: block;
  margin-bottom: 0.5rem;
}
.modal select {
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
.assign-confirm {
  background: #10b981;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
}
.cancel-btn {
  background: #ef4444;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
}

.actions {
  margin-bottom: 1rem;
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
  align-items: end;
}
.create-btn:hover {
  background-color: white;
}

</style>
