<template>
  <div class="dashboard-overview">
    <header class="header">
      <h1>Welcome, {{ userName }}</h1>
      <br>
      <p>Here is your activity snapshot for today.</p>
    </header>

    <section class="cards">
      <div class="card">
        <router-link :to="'/projects'" class="card-link">
          <div class="card">
            <h3>Projects in progress</h3>
            <p class="number"> {{ projectsCount }}</p>
          </div>
        </router-link>
        <router-link :to="'/tasks'" class="card-link">
          <div class="card">
            <h3>Tasks in progess</h3>
            <p class="number">{{tasksCount}}</p>
          </div>
        </router-link>
      </div>

      <router-link :to="'/team'" class="card-link">
        <div class="card">
          <h3>Team Members</h3>
          <p class="number"> {{ teamCount }} </p>
        </div>
      </router-link>
      <div class="card task-list-card">
        <h3>My Assigned Tasks</h3>
        <ul>
          <li v-for="task in assignedTasks" :key="task.task_id">
            <router-link :to="`/tasks/${task.task_id}`" class="task-link">
              <strong>{{ task.title }}</strong><br>
              <span class="description">{{ truncate(task.description) }}</span>
            </router-link>
          </li>
          <li v-if="assignedTasks.length === 0">No tasks assigned</li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>
const API_BASE_URL = process.env.VUE_APP_BASE_URL || 'http://localhost:8080';

export default {
  name: 'DashboardPage',

  data() {
    return {
      userName: '',
      teamCount: 0,
      projectsCount: 0,
      tasksCount: 0,
      userId: null,
      assignedTasks: []
    };
  },

  mounted() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      this.userName = userObj.name || '';
      this.userId = userObj.id;
      this.fetchAssignedTasks();
    }

    this.fetchTeamCount();
    this.fetchProjectsCount();
    this.fetchTasksCount();
  },

  methods: {
    async fetchTeamCount() {
      try {
        const response = await fetch(`${API_BASE_URL}/users/count`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        const data = await response.json();
        this.teamCount = data;
      } catch (error) {
        console.error('Error fetching team count:', error);
      }
    },

    async fetchProjectsCount() {
      try {
        const response = await fetch(`${API_BASE_URL}/projects/count`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        const data = await response.json();
        this.projectsCount = data.count;
      } catch (error) {
        console.error('Error fetching projects count:', error);
      }
    },

    async fetchTasksCount() {
      try {
        const response = await fetch(`${API_BASE_URL}/tasks/count`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        const data = await response.json();
        this.tasksCount = data.count;
      } catch (error) {
        console.error('Error fetching tasks count:', error);
      }
    },

async fetchAssignedTasks() {
  if (!this.userId) return;

  try {
    const response = await fetch(`${API_BASE_URL}/user-tasks/${this.userId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });

    const data = await response.json();
    console.log("Fetched assigned tasks:", data);
    this.assignedTasks = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching assigned tasks:', error);
  }
}
,
    truncate(text, length = 100) {
      return text.length > length ? text.substring(0, length) + '...' : text;
    }
  }
};
</script>

<style scoped>
.dashboard-overview {
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
}

.header h1 {
  font-size: 2rem;
  font-weight: bold;
  color: #1f2937;
}

.header p {
  color: #6b7280;
  margin-top: 0.5rem;
}

.cards {
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.card {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  text-decoration: none;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.card h3 {
  font-size: 1.1rem;
  color: #374151;
  margin-bottom: 0.5rem;
}

.card .number {
  font-size: 2rem;
  font-weight: bold;
  color: #e4e140;
}

.task-list-card {
  background-color: #f9fafb;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.task-list-card h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.task-list-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.task-list-card li {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  margin-bottom: 0.75rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
  transition: background-color 0.2s ease;
}

.task-list-card li:hover {
  background-color: #f3f4f6;
}

.task-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.task-link:hover {
  text-decoration: underline;
  color: #374151;
}

.description {
  color: #6b7280;
  font-size: 0.9rem;
}

.card-link {
  text-decoration: none;
  color: inherit;
}

</style>
