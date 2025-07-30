<template>
  <div class="assign-users-page">
    <div class="form-container">
      <h2 class="title">Assign Users to Task: {{ task.title || 'Loading...' }}</h2>

      <div v-if="loading" class="loading">Loading users...</div>

      <div v-else>
        <label class="label">Select Users to Assign:</label>
        <div
          class="checkbox-list"
          role="listbox"
          aria-multiselectable="true"
          tabindex="0"
        >
          <label
            v-for="user in users"
            :key="user.id"
            class="checkbox-item"
            :aria-selected="selectedUserIds.includes(user.id) ? 'true' : 'false'"
          >
            <input
              type="checkbox"
              :value="user.id"
              v-model="selectedUserIds"
              class="checkbox-input"
            />
            <span class="checkbox-label">
              {{ user.name }} <small>({{ user.email }})</small>
            </span>
          </label>
          <p v-if="users.length === 0" class="no-users">No users available</p>
        </div>

        <div class="actions">
          <button
            @click="assignUsers"
            :disabled="selectedUserIds.length === 0 || submitting"
            class="btn btn-primary"
          >
            {{ submitting ? 'Assigning...' : 'Assign Selected Users' }}
          </button>
          <router-link :to="`/tasks/${taskId}`" class="btn btn-secondary">
            Cancel
          </router-link>
        </div>

        <p v-if="message" :class="messageType">{{ message }}</p>
      </div>
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
      messageType: '',
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
        const res = await fetch(`${API_BASE_URL}/tasks/${this.taskId}`);
        if (!res.ok) throw new Error('Failed to fetch task');
        this.task = await res.json();
      } catch (error) {
        this.message = 'Error loading task info.';
        this.messageType = 'error';
      }
    },
    async fetchUsers() {
      try {
        const res = await fetch(`${API_BASE_URL}/users`);
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
        const res = await fetch(`${API_BASE_URL}/tasks/${this.taskId}/assign-users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task_id: this.taskId, user_ids: this.selectedUserIds }),
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
    },
  },
};
</script>

<style scoped>
.assign-users-page {
  display: flex;
  justify-content: center;
  padding: 3rem 1.5rem;
  background: #f9fafb;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.form-container {
  background: #fff;
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 1.9rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.25rem;
  user-select: none;
}

.loading {
  font-style: italic;
  color: #6b7280;
  margin-bottom: 1rem;
}

.label {
  font-weight: 600;
  margin-bottom: 0.6rem;
  color: #374151;
  user-select: none;
  display: block;
}

.checkbox-list {
  max-height: 280px;
  overflow-y: auto;
  border: 1.8px solid #d1d5db;
  border-radius: 0.6rem;
  background: #fafafa;
  padding: 0.5rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  outline-offset: 2px;
  cursor: pointer;
}

.checkbox-list:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px #bfdbfe;
  background: #fff;
  outline: none;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1rem;
  color: #374151;
  user-select: none;
  padding: 0.25rem 0.5rem;
  border-radius: 0.4rem;
  transition: background-color 0.15s ease;
}

.checkbox-item:hover {
  background-color: #e0e7ff;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #2563eb;
}

.checkbox-label small {
  font-weight: 400;
  color: #6b7280;
  margin-left: 0.25rem;
}

.no-users {
  padding: 1rem 0;
  color: #9ca3af;
  font-style: italic;
  user-select: none;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn {
  font-weight: 700;
  font-size: 1rem;
  padding: 0.65rem 1.6rem;
  border-radius: 0.6rem;
  border: none;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.25s ease, color 0.25s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background-color: #2563eb;
  color: #fff;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.45);
}

.btn-primary:hover:not(:disabled) {
  background-color: #1e40af;
  box-shadow: 0 6px 15px rgba(30, 64, 175, 0.55);
}

.btn-primary:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-secondary {
  background-color: #6b7280;
  color: #fff;
  text-decoration: none;
  user-select: none;
}

.btn-secondary:hover {
  background-color: #4b5563;
  text-decoration: none;
  color: #fff;
}

.success {
  color: #10b981;
  font-weight: 600;
  margin-top: 1rem;
}

.error {
  color: #ef4444;
  font-weight: 600;
  margin-top: 1rem;
}
</style>
