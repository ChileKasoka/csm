<template>
  <div class="projects-page">
    <header class="page-header">
      <h1>📁 Projects</h1>
      <p>Manage your active and archived projects.</p>
    </header>

    <section class="project-list">
      <div class="project-card" v-for="project in projects" :key="project.id">
        <h3>{{ project.name }}</h3>
        <p>{{ project.description }}</p>
        <span class="status" :class="project.status">{{ project.status }}</span>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'ProjectsPage',
  data() {
    return {
      projects: [
        { id: 1, name: 'Construction CRM', description: 'Build out core features for the CRM system.', status: 'active' },
        { id: 2, name: 'Vendor Portal', description: 'Frontend for vendor appointment scheduling.', status: 'on-hold' },
        { id: 3, name: 'Admin Redesign', description: 'Revamp the admin dashboard UI/UX.', status: 'completed' }
      ]
    };
  }
};
</script>

<style scoped>
.projects-page {
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

.project-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.project-card {
  background: white;
  border-radius: 10px;
  padding: 1.25rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.project-card h3 {
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.project-card p {
  font-size: 0.95rem;
  color: #4b5563;
  margin-bottom: 1rem;
}

.status {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: capitalize;
}

.status.active {
  background-color: #d1fae5;
  color: #047857;
}

.status.on-hold {
  background-color: #fef3c7;
  color: #b45309;
}

.status.completed {
  background-color: #dbeafe;
  color: #1d4ed8;
}
</style>
