import { createRouter, createWebHistory } from 'vue-router';
import { hasPermission } from '@/utils/permissions';

import LoginPage from '@/pages/LoginPage.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import DashboardPage from '@/pages/DashboardPage.vue';
import TeamPage from '@/pages/TeamPage.vue';
import TasksPage from '@/pages/TasksPage.vue';
import RolesPage from '@/pages/RolesPage.vue';
import SettingsPage from '@/pages/SettingsPage.vue';
import ProjectsPage from '@/pages/ProjectsPage.vue';
import AssignmentPermissions from '@/pages/AssignmentPermissions.vue';
import RolePermissionsPage from '@/pages/RolePermissions.vue';
import ProjectDetail from '@/pages/ProjectDetail.vue';
import TaskDetail from '@/pages/TaskDetail.vue';
import CreateTask from '@/pages/CreateTask.vue';
import TaskEdit from '@/pages/TaskEdit.vue';
import CreateProject from '@/pages/CreateProject.vue';
import EditProject from '@/pages/EditProject.vue';
import AddUser from '@/pages/AddUser.vue';
import AssignUsersToTask from '@/pages/AssignUsersToTask.vue';
import CreatePermission from '@/pages/CreatePermission.vue';
import AssignUsersToProject from '@/pages/AssignUsersToProject.vue';

const routes = [
  {
    path: '/',
    redirect: () => {
      return localStorage.getItem('access_token') ? '/dashboard' : '/login';
    }
  },
  {
    path: '/',
    component: DefaultLayout,
    meta: { requiresAuth: true  },
    children: [
      { 
        path: 'dashboard', 
        name: 'dashboard', 
        component: DashboardPage,
        meta: { requiresAuth: true  }
      },
      { 
        path: 'team', 
        name: 'team', 
        component: TeamPage
      },
      { 
        path: 'tasks', 
        name: 'tasks', 
        component: TasksPage ,
        // meta: { requiredPermission: 'Get All Tasks' }
      },
      {
        path: '/roles',
        name: 'roles',
        component: RolesPage,
        meta: { requiredPermission: 'Get All Roles' }
      },
      {
        path: '/create-permission',
        name: 'createPermission',
        component: CreatePermission,
      },
      {
        path: '/assign',
        name: 'assignRoles',
        component: AssignmentPermissions,
        meta: { requiredPermission: 'Assign Permission to Role' }
      },
      {
        path: '/role-permissions',
        name: 'RolePermissions',
        component: RolePermissionsPage,
        // meta: { requiredPermission: 'List All Role Permissions' }
      },
      {
        path: 'projects',
        name: 'projects',
        component: ProjectsPage,
        // meta: { requiredPermission: 'Get All Projects' }
      },
      {
        path: 'projects/:id',
        name: 'ProjectDetail',
        component: ProjectDetail,
        props: true,
        // meta: { requiredPermission: 'Get One Project' }
      },
      {
        path: 'projects/create',
        name: 'CreateProject',
        component: CreateProject,
        meta: { requiredPermission: 'Create Project' }
      },
      {
        path: 'projects/:id/edit',
        name: 'EditProject',
        component: EditProject,
        meta: { requiredPermission: 'Update Project' }
      },
      {
        path: 'tasks/:id',
        name: 'TaskDetail',
        component: TaskDetail,
        props: true,
        // meta: { requiredPermission: 'Get My Task By ID' }
      },
      {
        path: 'tasks/create',
        name: 'CreateTask',
        component: CreateTask,
        meta: { requiredPermission: 'Create Task' }
      },
      {
        path: '/tasks/:id/edit',
        name: 'TaskEdit',
        component: TaskEdit,
        // meta: { requiredPermission: 'Update Task' }
      },
      {
        path: '/add-user',
        name: 'AddUser',
        component: AddUser,
        meta: { requiredPermission: 'Create User' }
      },
      {
        path: '/tasks/:id/assign-users',
        name: 'AssignUsersToTask',
        component: AssignUsersToTask,
        meta: { requiredPermission: 'Assign Users to Task' }
      },
      {
        path: '/user-project/:id/assign-users',
        name: 'AssignUsersToProject',
        component: AssignUsersToProject,
      },
      {
        path: 'settings',
        name: 'settings',
        component: SettingsPage
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 🔐 Route guard
router.beforeEach((to, from, next) => {
  const requiredPermission = to.meta.requiredPermission;
  const requiresAuth = to.meta.requiresAuth;

  // Always allow login page
  if (to.path === '/login') {
    return next();
  }

  // If route requires a permission, verify it
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return next({ path: '/login' }); // or redirect to unauthorized page
  }

  if (requiresAuth && !localStorage.getItem('access_token')) {
    return next({ path: '/login' });
  }

  next();
});

export default router;
