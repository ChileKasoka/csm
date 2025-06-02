<template>
  <div class="dashboard-overview">
    <header class="header">
      <h1>Welcome back, {{userName}}</h1>
      <p>Here is your activity snapshot for today.</p>
    </header>

    <section class="cards">
      <div class="card">
        <h3>Projects</h3>
        <p class="number">8</p>
      </div>
      <div class="card">
        <h3>Tasks</h3>
        <p class="number">23</p>
      </div>
      <div class="card">
        <h3>Team Members</h3>
        <p class="number"> {{ teamCount }} </p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'DashboardPage',

  data() {
    return {
      userName: '',
      teamCount: 0
    }
  },

  mounted() {
    const storedName = localStorage.getItem('user');
    if (storedName) {
      this.userName = JSON.parse(storedName);
    }
    this.fetchTeamCount(); // properly scoped now
  },

  methods: {
    async fetchTeamCount() {
      try {
        const response = await fetch('http://localhost:8080/users/count', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        this.teamCount = data;
        console.log('Team data:', data);
      } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
      }
    }
  }
}
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
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

.card {
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s, box-shadow 0.2s;
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
</style>
