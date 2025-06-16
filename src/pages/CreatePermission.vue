<template>
  <form @submit.prevent="createPermission" class="form-only">
    <div class="form-group">
      <label for="name">Permission Name</label>
      <input v-model="form.name" id="name" required />
    </div>

    <div class="form-group">
      <label for="method">HTTP Method</label>
      <select v-model="form.method" id="method" required>
        <option disabled value="">Select Method</option>
        <option>GET</option>
        <option>POST</option>
        <option>PUT</option>
        <option>DELETE</option>
        <option>PATCH</option>
      </select>
    </div>

    <div class="form-group">
      <label for="path">API Path</label>
      <input v-model="form.path" id="path" placeholder="/projects/:id" required />
    </div>

    <button type="submit" class="submit-btn">Create</button>
  </form>
</template>

<script>
export default {
  name: 'CreatePermission',
  data() {
    return {
      form: {
        name: '',
        method: '',
        path: '',
      },
      token: null,
    };
  },
  mounted() {
    const rawToken = localStorage.getItem('access_token');
    try {
      const parsed = JSON.parse(rawToken);
      this.token = parsed.access_token;
    } catch {
      this.token = rawToken;
    }
  },
  methods: {
    async createPermission() {
      try {
        const response = await fetch('http://localhost:8080/permissions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`,
          },
          body: JSON.stringify(this.form),
        });

        if (!response.ok) throw new Error('Failed to create permission');

        alert('Permission created successfully');
        this.form = { name: '', method: '', path: '' }; // Reset form
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to create permission');
      }
    },
  },
};
</script>

<style scoped>
.form-only {

  max-width: 100%;
  margin: auto;
  padding: 2rem;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.form-group {
  margin-bottom: 1.25rem;
}
.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
.form-group input,
.form-group select {
  width: 100%;
  padding: 0.6rem;
  font-size: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
}
.submit-btn {
  display: inline-block;
  background-color: #10b981;
  color: white;
  font-weight: 600;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}
.submit-btn:hover {
  background-color: #059669;
}
</style>
