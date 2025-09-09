<template>
  <div class="dashboard">
    <!-- Toggle Button -->
    <!-- <button class="toggle-btn" @click="toggleSidebar">
      ☰
    </button> -->
<aside class="sidebar" :class="{ 'collapsed': !isSidebarOpen }">
  <div class="logo-title">
    <div>
      <h2 class="logo">Northern Hire Ltd</h2>
    </div>
    <div>
      <img src="../assets/logo.svg" alt="Logo" style="width: 50px; height: 50px; margin-left: 1rem;" />
    </div>
  </div>

  <hr />

  <nav class="nav-links">
    <router-link to="/dashboard">📉 Dashboard</router-link>
    <router-link to="/alerts">🔔 Alerts</router-link>
        <router-link to="/team">👥 Team</router-link>
        <router-link to="/projects">🚧 Projects</router-link>
        <router-link to="/tasks">📝 Assignments</router-link>

    <details>
      <summary class="summary-with-toggle-arrow">⚙️ Settings</summary>
      <hr>
      <div class="submenu">
        <router-link to="/settings">⚙️ General Settings</router-link>
        <details v-if="getAllRoles">
          <summary>🔐 Access Control</summary>
          <hr>
          <div class="submenu">
            <div v-if="getAllRoles">
            <router-link to="/roles">Roles</router-link>
            </div>
            <div v-if="canAccessPermissions">
            <router-link to="/assign">Permissions</router-link>
            </div>
            <div v-if="canAccessPermissions">
              <router-link to="/role-permissions">Role Permissions</router-link>
            </div>
          </div>
        </details>
      </div>
    </details>
  </nav>

  <!-- Logout button at bottom -->
  <div class="logout-section">
    <hr />
    <button @click="handleLogout" class="logout-btn">Logout</button>
  </div>
</aside>


    <main class="main-content">
    <!-- Navbar -->
      <header class="navbar">
        <!-- Toggle Button -->
        <button class="toggle-btn" @click="toggleSidebar">
          ☰
        </button>
        <div class="navbar-right">
          <span class="user-info">{{ userName.name }}</span>
        </div>
      </header>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import {logout} from '../utils/logout.js'
import { hasPermission } from '@/utils/permissions';

const isSidebarOpen = ref(true)
const userName = ref('User')

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

function handleLogout() {
  logout()
}

const canAccessPermissions = computed(() => {
  return hasPermission('Get All Permissions');
});

const getAllRoles = computed(() => {
  return hasPermission('Get All Roles');
});

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
  color: #000000;
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
/* Sidebar */
.sidebar {
  width: 250px;
  background-color: #363636;
  padding: 2rem 1rem;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
  transition: width 0.5s cubic-bezier(0.25, 1, 0.5, 1), 
              opacity 0.4s ease;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  white-space: nowrap;
  opacity: 1;
}

.sidebar.collapsed {
  width: 0;
  padding: 2rem 0;
  overflow: hidden;
  opacity: 0.5; /* faint ghost before disappearing */
}


/* Sidebar Content */
.logo {
  font-size: 1rem;
  font-weight: bold;
  color: #e4e140;
  margin: 0;
  line-height: 1;

}

.logo-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
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
  background-color: rgb(230, 230, 230);
  transition: margin-left 0.5s cubic-bezier(0.25, 1, 0.5, 1);
}

.sidebar.collapsed ~ .main-content {
  margin-left: 0;
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
  background: #363636;
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
  color: #d8e125;
}

.logout-btn {
  margin-left: auto;
  padding: 6px 12px;
  background: #d8e125;
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.logout-btn:hover {
  background: white;
}

.logout-section {
  margin-top: auto;
  padding-top: 1rem
}

/* Default arrow hidden */
.summary-with-toggle-arrow::after {
  content: '';
  opacity: 0;
  margin-left: 6px;
  transition: opacity 0.2s, content 0.2s;
}

/* Show ▾ on hover (not open) */
.dropdown:not([open]) .summary-with-toggle-arrow:hover::after {
  content: '▾';
  opacity: 1;
}

/* Show ▴ when open */
.dropdown[open] .summary-with-toggle-arrow::after {
  content: '▴';
  opacity: 1;
}



</style>
