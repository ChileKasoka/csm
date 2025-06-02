<template>
  <div class="dashboard">
    <!-- Toggle Button -->
    <!-- <button class="toggle-btn" @click="toggleSidebar">
      ☰
    </button> -->
    <aside class="sidebar" :class="{ 'collapsed': !isSidebarOpen }">
    <div style="display: flex;">
      <h2 class="logo">Northern Hire Ltd</h2>
      <img src="../assets/logo.svg" alt="Logo" style="width: 50px; height: 50px; margin-left: 1rem;" />
    </div>

    <hr />

      <nav class="nav-links">
        <router-link to="/dashboard">📉 Dashboard</router-link>

<details>
  <summary>👷🏿 Resources</summary>
  <div class="submenu">
    <div></div>
    <router-link to="/team">👥 Team</router-link>
    <div></div>
    <router-link to="/projects">🚧 Projects</router-link>
    <div></div>
    <router-link to="/tasks">📝 Assignments</router-link>
    <details>
      <summary>🔐 Access Control</summary>
      <div class="submenu">
        <div></div>
        <router-link to="/roles">Roles</router-link>
        <router-link to="/assign">Permisisons</router-link>
        <router-link to="/role-permissions">Role Permisisons</router-link>
      </div>
    </details>
  </div>
</details>

<div></div>
        <router-link to="/settings">⚙️ Settings</router-link>
      </nav>
    </aside>

    <main class="main-content">
    <!-- Navbar -->
      <header class="navbar">
        <!-- Toggle Button -->
        <button class="toggle-btn" @click="toggleSidebar">
          ☰
        </button>
        <div class="navbar-right">
          <span class="user-info">Hi, {{ userName }}</span>
        </div>
      </header>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isSidebarOpen = ref(true)
const userName = ref('User')

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

onMounted(() => {
  const storedName = localStorage.getItem('user')
  if (storedName) {
    userName.value = JSON.parse(storedName)
  }
})
</script>

<style scoped>
.dashboard {
  display: flex;
  height: 100vh;
  font-family: 'Segoe UI', sans-serif;
  background-color: #f9fafb;
  position: relative;
}

/* Toggle Button */
.toggle-btn {
  color: #fff;
  top: 0.5rem;
  left: 0.5rem;
  background: #ffff1a;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 0.7rem;
  border-radius: 8px;
  cursor: pointer;
}

.toggle-btn:hover {
  background: #ffffff;
  color: #1f1f1e;
}

/* Sidebar */
.sidebar {
  width: 250px;
  background-color: #676767;
  padding: 2rem 1rem;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.sidebar.collapsed {
  transform: translateX(-100%);
  position: absolute;
  z-index: 999;
  height: 100%;
}

/* Sidebar Content */
.logo {
  font-size: 1.8rem;
  font-weight: bold;
  color: #e4e140;
  margin-bottom: 2rem;
  text-align: left;
  font-family: "Bodoni Moda"
}

.sidebar hr {
  border: none;
  border-top: 1px solid #ccc; /* light gray line */
  margin: 1rem 0; /* space above and below */
}


.nav-links {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.nav-links a {
  text-decoration: none;
  color: #ffffff;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: #e4e140;
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
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

/* Cards */
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

details {
  cursor: pointer;
  color: #fff;
  margin-top: 1rem;
}

details summary {
  list-style: none;
  font-weight: 500;
  user-select: none;
  color: #ffffff;
}

details[open] summary {
  color: #e4e140;
}

.submenu {
  margin-left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.submenu a {
  font-size: 0.95rem;
  color: #ffffff;
  text-decoration: none;
}

.submenu a:hover {
  color: #e4e140;
}

.navbar {
  height: 60px;
  background: #676767;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  font-weight: 500;
  color: #f5ff32;
}

</style>
