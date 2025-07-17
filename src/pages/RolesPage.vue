<template>
  <div class="roles-page">
    <header class="page-header">
      <h1>🛡️ Roles</h1>
      <p>User roles and their permissions.</p>
    </header>

    <section class="role-list">
      <div class="role-card" v-for="role in roles" :key="role.id">
        <h3>{{ role.name }}</h3>
        <ul class="description">
          <li>{{ role.description }}</li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>
const API_BASE_URL = process.env.VUE_APP_BASE_URL || 'http://localhost:8080';

export default {
  name: 'RolesPage',
  data() {
    return {
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
      const response = await fetch(`${API_BASE_URL}/roles`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      if (!response.ok) {
        throw new Error('Failed to fetch roles');
      }
      this.roles = await response.json();
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  }
}

};
</script>

<style scoped>
.roles-page {
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.page-header p {
  color: #6b7280;
}

.role-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.role-card {
  background: white;
  border-radius: 10px;
  padding: 1.25rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.role-card h3 {
  margin-bottom: 0.75rem;
  color: #1f2937;
}

.description {
  list-style: none;
  padding: 0;
  margin: 0;
}

.description li {
  background-color: #f3f4f6;
  color: #374151;
  margin-bottom: 0.5rem;
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
}
</style>
