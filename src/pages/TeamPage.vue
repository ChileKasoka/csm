<template>
  <div class="team-page">
    <header class="page-header">
      <div>
        <h1>👥 Team</h1>
        <p>Manage your team members</p>
      </div>
      <div>
        <button class="add-btn" @click="showForm = !showForm">
          Add New User
        </button>
      </div>
    </header>

    <div v-if="showForm" class="form-section">
      <input v-model="newMember.name" placeholder="Name" />
      <input v-model="newMember.email" placeholder="Email" />
      <select v-model="newMember.role_id">
        <option disabled value="">Select Role</option>
        <option v-for="role in roles" :key="role.id" :value="role.id">
          {{ role.name }}
        </option>
      </select>
      <button @click="addMember" class="submit-btn">Add</button>
    </div>

    <section class="team-list">
      <div v-for="(member, index) in team" :key="index" class="team-card" @click="openEditModal(member)">
        <h3>{{ member.name }}</h3>
        <p>{{ member.email }}</p>
        <span class="role">{{ member.role }}</span>
      <div class="actions">
        <div class="icon-group">
          <font-awesome-icon
            icon="edit"
            class="icon edit"
            @click="openEditModal(member)"
          />
          <font-awesome-icon
            icon="trash"
            class="icon delete"
            @click="deleteMember(member.id)"
          />
        </div>
      </div>
      </div>
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

export default {
  name: 'TeamPage',
  data() {
    return {
      showForm: false,
      newMember: {
        name: '',
        email: '',
        role: ''
      },
      team: [], // Will be filled with data from API
      roles: [],
      selectedUser: null
    };
  },
  methods: {
async fetchRoles() {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch('http://localhost:8080/roles', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to fetch roles');

    const data = await response.json();
    this.roles = data;
  } catch (error) {
    console.error('Error fetching roles:', error);
  }
}
,
async addMember() {
  if (this.newMember.name && this.newMember.email && this.newMember.role_id) {
    try {
      const response = await fetch('http://localhost:8080/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: this.newMember.name,
          email: this.newMember.email,
          role_id: this.newMember.role_id  // <-- fixed here
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add user');
      }

      const createdUser = await response.json();
      console.log('User created:', createdUser);

      this.team.push({
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role?.name || 'N/A',
        role_id: createdUser.role?.id || null
      });

      this.newMember = { name: '', email: '', role_id: '' };
      this.showForm = false;

    } catch (error) {
      alert('Error adding user: ' + error.message);
      console.error(error);
    }
  } else {
    alert('Please fill all fields.');
  }
},
    openEditModal(user) {
      console.log('Opening modal for user:', user); // ← Add this
      this.selectedUser = { ...user }; // clone to avoid direct mutation
    },
async fetchTeam() {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch('http://localhost:8080/users', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    const data = await response.json();
    this.team = data.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role?.name || 'N/A',
      role_id: user.role?.id || null
    }));
  } catch (error) {
    console.error('Error loading team:', error);
  }
},

    async updateUser() {
  try {
    const response = await fetch(`http://localhost:8080/users/${this.selectedUser.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: this.selectedUser.name,
        email: this.selectedUser.email,
        role_id: this.selectedUser.role_id
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update user');
    }

    const updatedUser = await response.json();
    const index = this.team.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      this.team[index] = {
        ...updatedUser,
        role: updatedUser.role?.name || 'N/A',
        role_id: updatedUser.role?.id || null
      };
    }
    this.selectedUser = null;
  } catch (error) {
    alert('Error updating user: ' + error.message);
    console.error(error);
  }
},

async deleteMember(userId) {
  if (!confirm('Are you sure you want to delete this user?')) return;

  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`http://localhost:8080/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Failed to delete user');

    this.team = this.team.filter(member => member.id !== userId);
  } catch (error) {
    alert('Error deleting user: ' + error.message);
    console.error(error);
  }
},

async getUserById(userId) {
  try {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`http://localhost:8080/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch user');
    const user = await response.json();
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role?.name || 'N/A',
      role_id: user.role?.id || null
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
},


  },
  mounted() {
    this.fetchTeam();
    this.fetchRoles();
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
  background-color: #1f1f1e;
  color: #ffffff;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 1rem;
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
</style>
