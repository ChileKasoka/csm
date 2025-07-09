<template>
  <div class="team-page">
    <header class="page-header">
      <div>
        <h1>👥 Team</h1>
        <p>Manage your team members</p>
      </div>
      <div>
        <router-link to="/add-user" class="add-btn">
          Add New User
        </router-link>
      </div>
    </header>

    <!-- Tabs -->
    <div class="tabs">
      <button :class="{ active: activeTab === 'assigned' }" @click="activeTab = 'assigned'">Assigned to Projects</button>
      <button :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'">All Team Members</button>
    </div>

    <!-- Assigned View (Unchanged) -->
    <section v-if="activeTab == 'assigned'" class="team-list">
      <div v-for="(member, index) in teamProjects" :key="index" class="team-card" @click="openEditModal(member)">
        <h3>{{ member.name }}</h3>
        <p>{{ member.email }}</p>
        <span class="role">{{ member.role }}</span>
        <div class="actions">
          <div class="icon-group">
            <font-awesome-icon icon="edit" class="icon edit" @click.stop="openEditModal(member)" />
            <font-awesome-icon icon="trash" class="icon delete" @click.stop="deleteMember(member.id)" />
          </div>
        </div>
      </div>
    </section>

    <!-- All Users Table -->
    <section v-if="activeTab === 'all'">
      <table class="team-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(member, index) in team" :key="index">
            <tr @click="toggleUserProjects(member.id)" style="cursor: pointer;">
              <td>{{ member.name }}</td>
              <td>{{ member.email }}</td>
              <td>{{ member.role }}</td>
              <td>
                <font-awesome-icon icon="edit" class="icon edit" @click.stop="openEditModal(member)" />
                <font-awesome-icon icon="trash" class="icon delete" @click.stop="deleteMember(member.id)" />
              </td>
            </tr>

            <!-- Expanded Row -->
            <tr v-if="expandedUserId === member.id">
              <td colspan="4" class="expanded-row">
                <div v-if="loadingUserId === member.id">🔄 Loading projects...</div>
                <ul v-else-if="userProjectMap[member.id]?.length">
                  <li v-for="(proj, i) in userProjectMap[member.id]" :key="i">📁 {{ proj.name }}</li>
                </ul>
                <p v-else>No Projects Assigned.</p>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </section>

    <!-- Edit Modal -->
    <div v-if="selectedUser" class="modal">
      <div class="modal-content">
        <h2>Edit User</h2>
        <input v-model="selectedUser.name" placeholder="Name" />
        <input v-model="selectedUser.email" placeholder="Email" />
        <select v-model="selectedUser.role_id">
          <option disabled value="">Select Role</option>
          <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name }}</option>
        </select>
        <div class="modal-actions">
          <button @click="updateUser" class="submit-btn">Save</button>
          <button @click="selectedUser = null" class="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const API_BASE_URL = process.env.VUE_APP_BASE_URL || 'http://localhost:8080';

export default {
  data() {
    return {
      team: [],
      teamProjects: [],
      roles: [],
      selectedUser: null,
      activeTab: 'assigned',
      expandedUserId: null,
      userProjectMap: {},
      loadingUserId: null,
    };
  },
  methods: {
    async fetchRoles() {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(`${API_BASE_URL}/roles`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch roles');
        this.roles = await res.json();
      } catch (err) {
        console.error('Error fetching roles:', err);
      }
    },
    async fetchTeam() {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(`${API_BASE_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch users');
        const data = await res.json();
        this.team = data.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role?.name || 'N/A',
          role_id: user.role?.id || null
        }));
      } catch (err) {
        console.error('Error loading team:', err);
      }
    },
    async fetchTeamProjects() {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(`${API_BASE_URL}/user-projects`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch user-projects');
        const data = await res.json();
        this.teamProjects = data.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role?.name || 'N/A',
          role_id: user.role?.id || null,
        }));
      } catch (err) {
        console.error('Error loading team projects:', err);
      }
    },
async toggleUserProjects(userId) {
  this.expandedUserId = this.expandedUserId === userId ? null : userId;

  // Always re-fetch in case data changed
  this.loadingUserId = userId;

  try {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_BASE_URL}/user-projects/${userId}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error('Failed to fetch user projects');

    const data = await res.json();
    console.log("Fetched projects for", userId, data);
    this.userProjectMap[userId] = Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Error fetching user projects:', err);
    this.userProjectMap[userId] = [];
  } finally {
    this.loadingUserId = null;
  }
}
,
    openEditModal(user) {
      this.selectedUser = { ...user };
    },
    async updateUser() {
      try {
        const res = await fetch(`${API_BASE_URL}/users/${this.selectedUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: this.selectedUser.name,
            email: this.selectedUser.email,
            role_id: this.selectedUser.role_id
          })
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || 'Failed to update user');
        }

        const updated = await res.json();
        const i = this.team.findIndex(u => u.id === updated.id);
        if (i !== -1) {
          this.team[i] = {
            ...updated,
            role: updated.role?.name || 'N/A',
            role_id: updated.role?.id || null,
          };
        }
        this.selectedUser = null;
      } catch (err) {
        alert('Error updating user: ' + err.message);
      }
    },
    async deleteMember(userId) {
      if (!confirm('Are you sure you want to delete this user?')) return;
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to delete user');
        this.team = this.team.filter(member => member.id !== userId);
      } catch (err) {
        alert('Error deleting user: ' + err.message);
      }
    }
  },
  mounted() {
    this.fetchTeam();
    this.fetchRoles();
    this.fetchTeamProjects();
  }
};
</script>


<style scoped>
.team-page {
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
}
.page-header {
  display: flex;
  justify-content: space-between;
}

.page-header h1 {
  font-size: 2rem;
  margin-bottom: 0.25rem;
}

.page-header p {
  color: #6b7280;
  margin-bottom: 2rem;
}

.add-btn {
  background-color: #676767;
  color: #ffffff;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 1rem;
  text-decoration: none;
}

.add-btn:hover {
  background: #e4e140;
  color: #1f1f1e;
}

.form-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.form-section input,
.form-section select {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  min-width: 200px;
}

.submit-btn {
  background-color: #e4e140;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  color: white;
}

.submit-btn:hover {
  background: #1f1f1e;
}

.team-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.team-card {
  background: #ffffff;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  cursor: pointer;
}

.team-card h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.2rem;
}

.team-card p {
  color: #6b7280;
  margin: 0;
}

.actions {
  display: flex;
  justify-content: flex-end; /* Push icons to the right */
  margin-top: 8px;
}

.icon-group {
  display: flex;
  gap: 12px;
}

.icon {
  font-size: 1.25rem; /* ~20px */
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
  opacity: 0.9;
}

.icon:hover {
  transform: scale(1.15);
  opacity: 1;
}

.icon.edit {
  color: #daea33; /* Tailwind blue-500 */
}

.icon.delete {
  color: #000000; /* Tailwind red-500 */
}


.role {
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.3rem 0.6rem;
  background: #e4e140;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: bold;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-content h2 {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  color: #1f2937;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.form-group label {
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 0.25rem;
}

input,
select {
  padding: 0.6rem;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

input:focus,
select:focus {
  border-color: #6366f1;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.submit-btn {

  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease-in-out;
}

.submit-btn:hover {
  background-color: #b4b43a;
}

.cancel-btn {
  background-color: transparent;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.cancel-btn:hover {
  background-color: #f3f4f6;
}

.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  justify-content: center;
}
.tabs button {
  padding: 0.6rem 1.4rem;
  border-radius: 999px;
  border: none;
  background: #f1f5f9;
  color: #374151;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}
.tabs button.active {
  background: #1f2937;
  color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.team-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 0.5rem;
  margin-top: 1rem;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.team-table th, .team-table td {
  padding: 1rem;
  text-align: left;
}
.team-table thead {
  background-color: #f9fafb;
}
.team-table tbody tr {
  background-color: #ffffff;
  transition: background-color 0.2s;
}
.team-table tbody tr:hover {
  background-color: #f3f4f6;
}
.team-table th {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 700;
  border-bottom: 1px solid #e5e7eb;
}
.team-table td {
  font-size: 0.95rem;
  color: #374151;
  vertical-align: middle;
  border-bottom: 1px solid #f3f4f6;
}

.icon.edit {
  color: #3b82f6;
  margin-right: 10px;
  cursor: pointer;
}
.icon.delete {
  color: #ef4444;
  cursor: pointer;
}

.role {
  display: inline-block;
  margin-top: 0.5rem;
  padding: 0.3rem 0.6rem;
  background: #facc15;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: bold;
  color: #1f2937;
}

.expanded-row {
  background-color: #f9fafb;
  padding: 1rem;
  font-size: 0.9rem;
  color: #374151;
}
.expanded-row ul {
  list-style: none;
  padding-left: 1rem;
  margin: 0;
}
.expanded-row li {
  padding: 0.3rem 0;
}
</style>
