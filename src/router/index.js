// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/pages/LoginPage.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import DashboardPage from '@/pages/DashboardPage.vue'
import TeamPage from '@/pages/TeamPage.vue'
import TasksPage from '@/pages/TasksPage.vue'
import RolesPage from '@/pages/RolesPage.vue'
import SettingsPage from '@/pages/SettingsPage.vue'
import ProjectsPage from '@/pages/ProjectsPage.vue'
import AssignmentPermissions from '@/pages/AssignmentPermissions.vue'
import RolePermissionsPage from '@/pages/RolePermissions.vue'
import ProjectDetail from '@/pages/ProjectDetail.vue'
import TaskDetail from '@/pages/TaskDetail.vue'
import CreateTask from '@/pages/CreateTask.vue'
import TaskEdit from '@/pages/TaskEdit.vue'
import CreateProject from '@/pages/CreateProject.vue'
import EditProject from '@/pages/EditProject.vue'
import AddUser from '@/pages/AddUser.vue'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: 'dashboard', name: 'dashboard', component: DashboardPage },
      { path: 'team', name: 'team', component: TeamPage },
      { path: 'tasks', name: 'tasks', component: TasksPage },
      {
        name: 'roles',
        path: '/roles',
        component: RolesPage,
      },
      {
        name: 'assignRoles',
        path: '/assign',
        component: AssignmentPermissions,
      },
      {
        path: 'role-permissions',
        name: 'RolePermissions',
        component: RolePermissionsPage,
      },
      {path: 'projects', name: 'projects', component: ProjectsPage },
      { path: 'settings', name: 'settings', component: SettingsPage },
      {
        path: 'projects/:id',
        name: 'ProjectDetail',
        component: ProjectDetail,
        props: true
      },
      {
        path: 'tasks/:id',
        name: 'TaskDetail',
        component: TaskDetail,
        props: true
      },
      {
        path: 'tasks/create',
        name: 'CreateTask',
        component: CreateTask
      },
      {
        path: '/tasks/:id/edit',
        name: 'TaskEdit',
        component: TaskEdit
      },
      {
        path: '/projects/create',
        name: 'CreateProject',
        component: CreateProject
      },
      {
        path: '/projects/:id/edit',
        name: 'EditProject',
        component: EditProject
      },
      {
        path: '/add-user',
        name: 'AddUser',
        component: AddUser
      }
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
