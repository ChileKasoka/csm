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
      <select v-model="newMember.role">
        <option disabled value="">Select Role</option>
        <option>Admin</option>
        <option>Manager</option>
        <option>Contributor</option>
      </select>
      <button @click="addMember" class="submit-btn">Add</button>
    </div>

    <section class="team-list">
      <div v-for="(member, index) in team" :key="index" class="team-card">
        <h3>{{ member.name }}</h3>
        <p>{{ member.email }}</p>
        <span class="role">{{ member.role }}</span>
      </div>
    </section>
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
      team: [
        { name: 'Alice Johnson', email: 'alice@example.com', role: 'Manager' },
        { name: 'Bob Smith', email: 'bob@example.com', role: 'Contributor' }
      ]
    };
  },
  methods: {
    addMember() {
      if (this.newMember.name && this.newMember.email && this.newMember.role) {
        this.team.push({ ...this.newMember });
        this.newMember.name = '';
        this.newMember.email = '';
        this.newMember.role = '';
        this.showForm = false;
      } else {
        alert('Please fill all fields.');
      }
    }
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
  background-color: #4ade80;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  color: white;
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
}

.team-card h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.2rem;
}

.team-card p {
  color: #6b7280;
  margin: 0;
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
</style>
