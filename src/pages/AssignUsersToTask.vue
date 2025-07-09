<template>
  <div class="assign-page">
    <h1>Assign Users to Task: {{ task.title || 'Loading...' }}</h1>

    <div v-if="loading" class="loading">Loading users...</div>

    <div v-else>
      <label>Select Users to Assign:</label>
      <select v-model="selectedUserIds" multiple size="8" class="user-select">
        <option v-for="user in users" :key="user.id" :value="user.id">
          {{ user.name }} ({{ user.email }})
        </option>
      </select>

      <div class="buttons">
        <button @click="assignUsers" :disabled="selectedUserIds.length === 0 || submitting">
          {{ submitting ? 'Assigning...' : 'Assign Selected Users' }}
        </button>
        <router-link :to="`/tasks/${taskId}`" class="cancel-btn">Cancel</router-link>
      </div>

      <p v-if="message" :class="messageType">{{ message }}</p>
    </div>
  </div>
</template>

<script>
const API_BASE_URL = process.env.VUE_APP_BASE_URL || 'http://localhost:8080';

export default {
  name: 'AssignUsersToTask',
  data() {
    return {
      taskId: parseInt(this.$route.params.id),
      task: {},
      users: [],
      selectedUserIds: [],
      loading: true,
      submitting: false,
      message: '',
      messageType: ''
    };
  },
  async created() {
    await this.fetchTask();
    await this.fetchUsers();
    this.loading = false;
  },
  methods: {
    async fetchTask() {
      try {
        const res = await fetch(`http://API_BASE_URL/tasks/${this.taskId}`);
        if (!res.ok) throw new Error('Failed to fetch task');
        this.task = await res.json();
      } catch (error) {
        this.message = 'Error loading task info.';
        this.messageType = 'error';
      }
    },
    async fetchUsers() {
      try {
        const res = await fetch('http://API_BASE_URL/users');
        if (!res.ok) throw new Error('Failed to fetch users');
        this.users = await res.json();
      } catch (error) {
        this.message = 'Error loading users.';
        this.messageType = 'error';
      }
    },
    async assignUsers() {
      if (this.selectedUserIds.length === 0) return;

      this.submitting = true;
      this.message = '';

      try {
        const res = await fetch(`http://API_BASE_URL/tasks/${this.taskId}/assign-users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task_id: this.taskId, user_ids: this.selectedUserIds })
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || 'Failed to assign users');
        }

        this.message = 'Users assigned successfully!';
        this.messageType = 'success';
        this.selectedUserIds = [];
      } catch (error) {
        this.message = `Error: ${error.message}`;
        this.messageType = 'error';
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>

<style scoped>
.assign-page {
  max-width: 600px;
  margin: 2rem auto;
  font-family: Arial, sans-serif;
}

h1 {
  margin-bottom: 1rem;
}

.user-select {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-bottom: 1rem;
}

.buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

button {
  background-color: #2563eb;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

button:disabled {
  background-color: #94a3b8;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #1e40af;
}

.cancel-btn {
  display: inline-block;
  padding: 0.6rem 1.2rem;
  text-decoration: none;
  color: #374151;
  border: 1px solid #9ca3af;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.cancel-btn:hover {
  background-color: #e5e7eb;
}

.loading {
  font-style: italic;
}

.success {
  color: #10b981;
  font-weight: 600;
}

.error {
  color: #ef4444;
  font-weight: 600;
}
</style>
