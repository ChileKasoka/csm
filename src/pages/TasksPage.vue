<template>
  <div class="tasks-page">
    <header class="page-header">
      <h1>📝 Tasks</h1>
      <p>Track and manage your tasks here.</p>
    </header>

    <!-- Form -->
    <form @submit.prevent="saveTask" class="task-form">
      <input v-model="newTask.title" placeholder="Title" required />
      <input v-model="newTask.description" placeholder="Description" required />
      <input type="date" v-model="newTask.start_date" placeholder="Start Date" />
      <input type="date" v-model="newTask.end_date" placeholder="End Date" />
      <select v-model="newTask.status" required>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <button type="submit">{{ selectedTask ? 'Update Task' : 'Create Task' }}</button>
      <button type="button" v-if="selectedTask" @click="cancelEdit">Cancel</button>
    </form>

    <!-- Task List -->
    <section class="task-list">
      <div class="task-card" v-for="task in tasks" :key="task.id">
        <h3>{{ task.title }}</h3>
        <p>{{ task.description }}</p>
        <p><small>Start: {{ formatDate(task.start_date) }} | End: {{ formatDate(task.end_date) }}</small></p>
        <span class="status" :class="task.status">{{ task.status }}</span>
        <div class="actions">
          <div class="icon-group">
            <font-awesome-icon icon="edit" class="icon edit" @click="editTask(task)" />
            <font-awesome-icon icon="trash" class="icon delete" @click="deleteTask(task.id)" />
          </div>
        </div>
        <button class="assign-btn" @click="openAssignModal(task.id)">Assign</button>
      </div>
    </section>

    <!-- Assign Modal -->
    <div v-if="showAssignModal" class="modal-overlay">
      <div class="modal">
        <h2>Assign Task</h2>
        <label>Select User:</label>
        <select v-model="assignForm.user_id">
          <option disabled value="">Choose a user</option>
          <option v-for="user in users" :key="user.id" :value="user.id">
            {{ user.name }}
          </option>
        </select>
        <div class="modal-actions">
          <button @click="assignTask">Assign</button>
          <button @click="closeAssignModal">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TasksPage',
  data() {
    return {
      tasks: [],
      newTask: {
        title: '',
        description: '',
        status: 'pending',
        start_date: '',
        end_date: ''
      },
      selectedTask: null,
      users: [],
      showAssignModal: false,
      assignForm: {
        task_id: null,
        user_id: ''
      },
    };
  },
  mounted() {
    this.fetchTasks();
  },
  methods: {
    async fetchTasks() {
      const res = await fetch('http://localhost:8080/tasks');
      this.tasks = await res.json();
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
      this.selectedTask = task;
      this.newTask = {
        title: task.title,
        description: task.description,
        start_date: task.start_date.split('T')[0],
        end_date: task.end_date.split('T')[0],
        status: task.status
      };
    },

async saveTask() {
  const formattedTask = {
    ...this.newTask,
    start_date: new Date(this.newTask.start_date + 'T00:00:00Z').toISOString(),
    end_date: new Date(this.newTask.end_date + 'T00:00:00Z').toISOString(),
    status: this.newTask.status
  };


  const url = this.selectedTask
    ? `http://localhost:8080/tasks/${this.selectedTask.id}`
    : 'http://localhost:8080/tasks';

  const method = this.selectedTask ? 'PUT' : 'POST';

  try {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formattedTask)
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.message || 'Failed to save task');
      return;
    }

    const savedTask = await response.json();

    if (this.selectedTask) {
      const index = this.tasks.findIndex(t => t.id === savedTask.id);
      if (index !== -1) this.tasks.splice(index, 1, savedTask);
    } else {
      this.tasks.push(savedTask);
    }

    this.resetForm();
    this.selectedTask = null;
  } catch (err) {
    console.error('Task save failed:', err);
    alert('Failed to save task: ' + err.message);
  }
}
,

    async deleteTask(id) {
      if (confirm('Delete this task?')) {
        const res = await fetch(`http://localhost:8080/tasks/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          this.tasks = this.tasks.filter(t => t.id !== id);
        } else {
          alert('Failed to delete task');
        }
      }
    },



    cancelEdit() {
      this.resetForm();
      this.selectedTask = null;
    },

    resetForm() {
      this.newTask = {
        title: '',
        description: '',
        status: 'pending',
        start_date: '',
        end_date: ''
      };
    },

    async fetchUsers() {
      const res = await fetch('http://localhost:8080/users');
      this.users = await res.json();
    },

    openAssignModal(taskId) {
      this.assignForm.task_id = taskId;
      this.assignForm.user_id = '';
      this.showAssignModal = true;
      this.fetchUsers();
    },

    closeAssignModal() {
      this.showAssignModal = false;
    },

    async assignTask() {
      try {
        const res = await fetch('http://localhost:8080/user-tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.assignForm)
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to assign task');
        }

        alert('Task assigned successfully!');
        this.closeAssignModal();
      } catch (err) {
        console.error("Assignment error:", err);
        alert("Error assigning task: " + err.message);
      }
    }
  }
};
</script>

<style scoped>
.tasks-page {
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

.assign-btn {
  margin-top: 12px;
  background-color: #e1e731;
  color: rgb(0, 0, 0);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.assign-btn:hover {
  background-color: #2c2a2a;
  transform: translateY(-1px);
  color: white;
}

.task-form {
  margin: 1rem 0 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.task-form input,
.task-form select {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.task-form button {
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}

.task-form button[type="button"] {
  background-color: #9ca3af;
  margin-left: 0.5rem;
}

.task-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.task-card {
  background: white;
  border-radius: 10px;
  padding: 1.25rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.task-card h3 {
  margin-bottom: 0.5rem;
  color: #374151;
}

.task-card p {
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

.status.pending {
  background-color: #fef3c7;
  color: #b45309;
}

.status.in-progress {
  background-color: #dbeafe;
  color: #1d4ed8;
}

.status.completed {
  background-color: #d1fae5;
  color: #047857;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.icon-group {
  display: flex;
  gap: 12px;
}

.icon {
  font-size: 1.25rem;
  cursor: pointer;
}

.icon.edit {
  color: #2563eb;
}

.icon.delete {
  color: #ef4444;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  width: 300px;
  max-width: 90vw;
}

.modal-actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.modal-actions button {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.modal-actions button:first-child {
  background-color: #2563eb;
  color: white;
}

.modal-actions button:last-child {
  background-color: #9ca3af;
  color: white;
}
</style>
