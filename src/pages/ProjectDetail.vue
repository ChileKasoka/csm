<template>
  <div v-if="project" class="project-detail">
    <!-- Project Header -->
    <h2 class="project-name">{{ project.name }}</h2>
    <p class="project-description">{{ project.description }}</p>

    <!-- Details Grid -->
    <div class="project-grid">
      <!-- Dynamic Fields -->
      <div class="detail-card">
        <h4>Project Name</h4>
        <p>{{ project.name }}</p>
      </div>

      <div class="detail-card description-card">
        <h4>Description</h4>
        <p>{{ project.description }}</p>
      </div>

      <div class="detail-card">
        <h4>Status</h4>
        <span :class="statusClass">{{ project.status }}</span>
      </div>

      <!-- Static Fields (to be made dynamic later) -->
      <div class="detail-card">
        <h4>Client</h4>
        <p>ZamBuild Ltd.</p>
      </div>

      <div class="detail-card">
        <h4>Location</h4>
        <p>Lusaka, Zambia</p>
      </div>

      <div class="detail-card">
        <h4>Project Manager</h4>
        <p>Eng. John Mwale</p>
      </div>

      <div class="detail-card">
        <h4>Contractor</h4>
        <p>Elite Constructions</p>
      </div>

      <div class="detail-card">
        <h4>Start Date</h4>
        <p>{{ project.start_date }}</p>
      </div>

      <div class="detail-card">
        <h4>End Date</h4>
        <p>{{project.end_date}}</p>
      </div>

      <div class="detail-card">
        <h4>Budget</h4>
        <p>N/A</p>
      </div>
    </div>

    <!-- Actions -->
    <div class="actions">
      <router-link to="/projects" class="back-button">← Back to Projects</router-link>
      <button class="assign-btn" @click="goToAssignUsers(project.id)">Assign Users</button>
    </div>
  </div>
</template>

<script>
const API_BASE_URL = process.env.VUE_APP_BASE_URL || 'http://localhost:8080';

export default {
  name: 'ProjectDetail',
  props: ['id'],
  data() {
    return {
      project: null
    };
  },
  computed: {
    statusClass() {
      switch ((this.project?.status || '').toLowerCase()) {
        case 'completed':
          return 'status-completed';
        case 'in progress':
          return 'status-in-progress';
        case 'pending':
          return 'status-pending';
        default:
          return 'status-unknown';
      }
    }
  },
  methods: {
    goToAssignUsers(projectId) {
      this.$router.push(`/user-project/${projectId}/assign-users`);
    }
  },
  async created() {
    try {
      const res = await fetch(`http://API_BASE_URL/projects/${this.id}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      this.project = await res.json();
    } catch (err) {
      console.error('Failed to fetch project:', err);
    }
  }
};
</script>

<style scoped>
.project-detail {
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.07);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.project-name {
  font-size: 2.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.project-description {
  font-size: 1.1rem;
  color: #4b5563;
  margin-bottom: 2rem;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.2rem;
  margin-bottom: 2rem;
}

.detail-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  padding: 1rem;
  border-radius: 10px;
}

.description-card {
  grid-column: span 2;
}

.detail-card h4 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0.4rem;
}

.detail-card p,
.detail-card span {
  font-size: 1rem;
  color: #111827;
  font-weight: 500;
}

.status-completed {
  background-color: #d1fae5;
  color: #065f46;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  display: inline-block;
}

.status-in-progress {
  background-color: #fef3c7;
  color: #92400e;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  display: inline-block;
}

.status-pending {
  background-color: #fee2e2;
  color: #991b1b;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  display: inline-block;
}

.status-unknown {
  background-color: #e5e7eb;
  color: #6b7280;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  display: inline-block;
}

.actions {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.back-button {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  transition: color 0.2s ease;
}

.back-button:hover {
  color: #1e3a8a;
}

.assign-btn {
  background-color: #374151;
  color: #ffffff;
  border: none;
  padding: 0.6rem 1.4rem;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: background 0.2s ease;
}

.assign-btn:hover {
  background-color: #eab308;
  color: #1e1e1e;
}
</style>
