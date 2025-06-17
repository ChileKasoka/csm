<template>
  <div v-if="project" class="project-detail">
    <h2 class="project-name">{{ project.name }}</h2>
    <p class="project-description">{{ project.description }}</p>
    <p class="project-status">
      Status: 
      <span :class="statusClass">{{ project.status }}</span>
    </p>
    <router-link to="/projects" class="back-button">← Back to Projects</router-link>
  </div>
</template>

<script>
export default {
  name: 'ProjectDetail',
  props: ['id'],
  data() {
    return {
      project: null
    }
  },
  computed: {
    statusClass() {
      // Return different classes based on status for color coding
      switch ((this.project?.status || '').toLowerCase()) {
        case 'completed':
          return 'status-completed'
        case 'in progress':
          return 'status-in-progress'
        case 'pending':
          return 'status-pending'
        default:
          return ''
      }
    }
  },
  async created() {
    try {
      const res = await fetch(`http://localhost:8080/projects/${this.id}`)
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      this.project = await res.json()
    } catch (err) {
      console.error('Failed to fetch project:', err)
    }
  }
}
</script>

<style scoped>
.project-detail {
  /* max-width: 600px; */
  margin: 2rem auto;
  padding: 1.8rem 2.4rem;
  background: #fff;
  /* border-radius: 12px; */
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  transition: box-shadow 0.3s ease;
}
.project-detail:hover {
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.15);
}

.project-name {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.6rem;
  color: #2c3e50;
}

.project-description {
  font-size: 1.125rem;
  line-height: 1.6;
  color: #555;
  margin-bottom: 1.2rem;
}

.project-status {
  font-size: 1rem;
  font-weight: 600;
  color: #666;
}

.project-status span {
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 8px;
  text-transform: capitalize;
}

/* Status colors */
.status-completed {
  background-color: #d4edda;
  color: #155724;
}

.status-in-progress {
  background-color: #fff3cd;
  color: #856404;
}

.status-pending {
  background-color: #f8d7da;
  color: #721c24;
}

.back-button {
  display: inline-block;
  margin-top: 2rem;
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.back-button:hover {
  color: #1e40af;
}
</style>
