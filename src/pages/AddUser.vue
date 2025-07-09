<template>
  <div class="add-user-wrapper">
    <div class="form-card">
      <h2 class="form-title">Create a New Team Member</h2>

      <div class="form-group">
        <label>Name</label>
        <input v-model="newUser.name" placeholder="John Doe" />
      </div>

      <div class="form-group">
        <label>Email</label>
        <input v-model="newUser.email" placeholder="johndoe@example.com" />
      </div>

      <div class="form-group">
        <label>Role</label>
        <select v-model="newUser.role_id">
          <option disabled value="">Select a role</option>
          <option v-for="role in roles" :key="role.id" :value="role.id">
            {{ role.name }}
          </option>
        </select>
      </div>

      <div class="add-edit-btns">
        <div>
            <button @click="handleAddUser" class="submit-btn">Create User</button>
        </div>
        <br>
        <div>
            <router-link to="/team" class="cancel-btn">Cancel</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

const API_BASE_URL = process.env.VUE_APP_BASE_URL || 'http://localhost:8080';

export default {
  name: 'AddUser',
  data() {
    return {
      newUser: {
        name: '',
        email: '',
        role_id: ''
      },
      roles: []
    };
  },
  mounted() {
    this.fetchRoles();
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
    async handleAddUser() {
      if (this.newUser.name && this.newUser.email && this.newUser.role_id) {
        try {
          const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('access_token')}`
            },
            body: JSON.stringify(this.newUser)
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to add user');
          }

          const createdUser = await response.json();

          this.$emit('user-added', {
            id: createdUser.id,
            name: createdUser.name,
            email: createdUser.email,
            role: createdUser.role?.name || 'N/A',
            role_id: createdUser.role?.id || null
          });

          this.$router.push('/team');
        } catch (error) {
          alert('Error adding user: ' + error.message);
        }
      } else {
        alert('Please fill out all fields.');
      }
    }
  }
};
</script>

<style scoped>
.add-user-wrapper {
  display: flex;
  justify-content: center;
  padding-top: 2rem;
}

.form-card {
  background: #ffffff;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  width: 100%;
}

.form-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.2rem;
}

.form-group label {
  margin-bottom: 0.4rem;
  font-weight: 500;
  color: #4b5563;
}

input,
select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus,
select:focus {
  outline: none;
  border-color: #6366f1;
}

.submit-btn {
  background-color: #6366f1;
  color: white;
  font-weight: 600;
  padding: 0.75rem;
  width: 100%;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.submit-btn:hover {
  background-color: #4f46e5;
}
.cancel-btn {
  padding: 0.6rem 1.2rem;
  background-color: #9ca3af;
  color: white;
  border-radius: 0.5rem;
  text-decoration: none;
  text-align: center;
  line-height: 1.9rem;
}

.cancel-btn:hover {
  background-color: #6b7280;
}

.add-edit-btns {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>
