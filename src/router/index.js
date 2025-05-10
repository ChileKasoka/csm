// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/components/HomeView.vue'
import LoginPage from '@/pages/LoginPage.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import DashboardPage from '@/pages/DashboardPage.vue'
import TeamPage from '@/pages/TeamPage.vue'
import TasksPage from '@/pages/TasksPage.vue'
import RolesPage from '@/pages/RolesPage.vue'
import SettingsPage from '@/pages/SettingsPage.vue'
import ProjectsPage from '@/pages/ProjectsPage.vue'

const routes = [
  {
    path: '/home',
    name: 'home',
    component: HomeView
  },
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: 'dashboard', name: 'dashboard', component: DashboardPage },
      { path: 'team', name: 'team', component: TeamPage },
      { path: 'tasks', name: 'tasks', component: TasksPage },
      { path: 'roles', name: 'roles', component: RolesPage },
      {path: 'projects', name: 'projects', component: ProjectsPage },
      { path: 'settings', name: 'settings', component: SettingsPage }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
