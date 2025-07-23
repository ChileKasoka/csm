<template>
  <div class="tasks-page">
    <div class="header">
      <h1>Assignments</h1>
      <div v-if="canCreateTask">
        <router-link to="/tasks/create" class="create-btn">Create Assignment</router-link>
      </div>
    </div>

<section class="task-list">
  <!-- Loading State -->
  <div v-if="isLoading" class="loading-message">
    🔄 Loading assignments...
  </div>

  <!-- Empty State -->
  <div v-else-if="tasks.length === 0" class="no-tasks">
    🚫 No available assignments.
  </div>

  <!-- Task Cards -->
  <router-link
    v-else
    v-for="task in tasks"
    :key="task.id"
    :to="`/tasks/${task.id}`"
    class="task-card-wrapper"
  >
    <div class="task-card">
      <h3>{{ task.title }}</h3>

      <div class="description">
        <p>
          {{ task.description.length > 100
            ? task.description.substring(0, 100) + '...'
            : task.description }}
        </p>
      </div>

      <div class="task-details">
        <div>
          <p class="format-time">
            <small>
              Start: {{ formatDate(task.start_date) }} <br />
              End: {{ formatDate(task.end_date) }}
            </small>
          </p>
          <span class="status" :class="task.status">{{ task.status }}</span>
        </div>

        <div class="actions">
          <div class="icon-group">
            <font-awesome-icon
              icon="edit"
              class="icon edit"
              title="Edit Task"
              @click.stop.prevent="editTask(task)"
            />
            <font-awesome-icon
              icon="trash"
              class="icon delete"
              title="Delete Task"
              @click.stop.prevent="deleteTask(task.id)"
            />
          </div>
          <button v-if="assignTask" class="assign-btn" @click.stop.prevent="goToAssignUsers(task.id)">
            Assign
          </button>
        </div>
      </div>
    </div>
  </router-link>
</section>

  </div>
</template>

<script>
import { hasPermission } from '@/utils/permissions';

const API_BASE_URL = process.env.VUE_APP_BASE_URL || 'http://localhost:8080';

export default {
  data() {
    return {
      tasks: [],
      userId: null,
      role: '',
      isLoading: true,
    };
  },
mounted() {
  const storedUser = localStorage.getItem('user');

  if (!storedUser) {
    console.warn('No user in localStorage');
    this.isLoading = false;
    return;
  }

  try {
    const userObj = JSON.parse(storedUser);
    this.userName = userObj.name || '';
    this.userId = userObj.id;

    // Handle both role.name and role as plain string
    this.role = (userObj.role?.name || userObj.role || '').toLowerCase();

    console.log('User:', this.userName, '| Role:', this.role);

    if (this.userName.toLowerCase() === 'admin' || this.role === 'admin') {
      console.log('Fetching all tasks...');
      this.fetchTasks();
    } else {
      console.log('Fetching assigned tasks for user ID:', this.userId);
      this.fetchAssignedTasks();
    }
  } catch (err) {
    console.error('Error parsing user from localStorage:', err);
    this.isLoading = false;
  }
}
,
computed: {
    canCreateTask() {
      return hasPermission('Create Task');
    },

    assignTask() {
      return hasPermission('Assign Users to Task');
    }
  }
,
  methods: {
    
async fetchTasks() {
  this.isLoading = true;

  const startTime = Date.now();

  try {
    const res = await fetch(`${API_BASE_URL}/tasks`);
    const data = await res.json();
    this.tasks = Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Error fetching tasks:', err);
    this.tasks = [];
  } finally {
    // Ensure at least 500ms loading time
    const elapsed = Date.now() - startTime;
    const delay = Math.max(0, 500 - elapsed);
    setTimeout(() => {
      this.isLoading = false;
    }, delay);
  }
},

async fetchAssignedTasks() {
  this.isLoading = true;

  const startTime = Date.now();

  try {
    const response = await fetch(`${API_BASE_URL}/user-tasks/${this.userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });

    const data = await response.json();
    this.tasks = Array.isArray(data)
      ? data.map(task => ({
          ...task,
          id: task.task_id
        }))
      : [];
  } catch (error) {
    console.error('Error fetching assigned tasks:', error);
    this.tasks = [];
  } finally {
    const elapsed = Date.now() - startTime;
    const delay = Math.max(0, 500 - elapsed);
    setTimeout(() => {
      this.isLoading = false;
    }, delay);
  }
}
,

async getTask(taskId) {
  try {
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`Failed to fetch task: ${errorData.message || res.statusText}`);
    }

    const task = await res.json();
    console.log('Fetched task:', task);
    return task;

  } catch (error) {
    console.error('Error getting task:', error.message);
    // Optionally show an error message to the user
    return null;
  }
}
,
    
    async deleteTask(taskId) {
      const confirmed = confirm('Are you sure you want to delete this task?');
      if (!confirmed) return;

      const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
      }
    },
    formatDate(dateStr) {
      if (!dateStr || dateStr.startsWith('0001')) return '—';
      const date = new Date(dateStr);
      return isNaN(date)
        ? '—'
        : new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }).format(date);
    },
    editTask(task) {
      this.$router.push(`/tasks/${task.id}/edit`);
    },
    goToAssignUsers(taskId) {
      this.$router.push(`/tasks/${taskId}/assign-users`);
    }
  }
};
</script>

<style scoped>
.tasks-page {
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.header h1 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.create-btn {
  background-color: #676767;
  color: #ffffff;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 1rem;
  text-decoration: none;
}

.create-btn:hover {
  background: #e4e140;
  color: #1f1f1e;
}
.task-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.task-card-wrapper {
  text-decoration: none;
  color: inherit;
}

.task-card {
  background-color: #fff;
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
  position: relative;
}

.task-card h3 {
  font-size: 1.5rem;
  font-weight: bold;
  padding-bottom: 1rem;
}

.task-card:hover {
  transform: translateY(-4px);
}

.task-details {
  display: flex;
  justify-content: space-between;
}

.status {
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  margin-top: 0.5rem;
}

.description {
  width: 70%;
  padding: 1rem;
  color: #676767;
}

.status.pending {
  background-color: #fcd34d;
  color: #92400e;
}

.status.in-progress {
  background-color: #60a5fa;
  color: #1e3a8a;
}

.status.completed {
  background-color: #86efac;
  color: #065f46;
}

.actions {
  bottom: 1rem;
  right: 1rem;
  justify-content: space-between;
  align-items: center;
}

.icon-group {
  display: flex;
  gap: 0.5rem;
  justify-content: end;
}

.icon {
  cursor: pointer;
  font-size: 1rem;
}

.icon.edit {
  color: #676767;
}

.icon.edit :hover {
  color: #e4e140;
}

.icon.delete {
  color: #676767;
}

.icon.delete :hover {
  color: rgb(175, 17, 17);
}

.assign-btn {
  margin-top: 2rem;
  background-color: #676767;
  color: #ffffff;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 1rem;
  text-decoration: none;
}

.assign-btn:hover {
  background: #e4e140;
  color: #1f1f1e;
}

.format-time {
  padding-top: 1rem;
  font-size: small;
  color: #676767;
}

.no-tasks {
  font-size: 1rem;
  color: #6b7280;
  background-color: #f9fafb;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  grid-column: 1 / -1;
}
</style>
