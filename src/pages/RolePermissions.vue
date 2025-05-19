<template>
  <div class="page-container">
    <h2 class="page-title">Role Permissions</h2>

    <div
      v-for="(group, index) in groupedPermissions"
      :key="index"
      class="role-section"
    >
      <h3 class="role-title">{{ group.role_name }}</h3>

      <table class="permissions-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Permission</th>
            <th>Method</th>
            <th>Path</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(perm, i) in group.permissions" :key="i">
            <td>{{ i + 1 }}</td>
            <td>{{ perm.permission_name }}</td>
            <td>
              <span :class="['method', perm.method.toLowerCase()]">{{ perm.method }}</span>
            </td>
            <td>{{ perm.path }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RolePermissionsPage',
  data() {
    return {
      permissions: [],
    };
  },
  computed: {
    groupedPermissions() {
      const map = {};

      for (const perm of this.permissions) {
        if (!map[perm.role_name]) {
          map[perm.role_name] = [];
        }
        map[perm.role_name].push(perm);
      }

      return Object.entries(map).map(([role_name, permissions]) => ({
        role_name,
        permissions,
      }));
    },
  },
  mounted() {
    fetch('http://localhost:8080/role-permissions')
      .then((res) => res.json())
      .then((data) => {
        this.permissions = data;
      })
      .catch((err) => {
        console.error('Failed to load permissions:', err);
      });
  },
};
</script>

<style scoped>
.page-container {
  padding: 2rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.role-section {
  margin-bottom: 2rem;
}

.role-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  text-transform: capitalize;
}

.permissions-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border: 1px solid #e5e7eb;
}

.permissions-table th,
.permissions-table td {
  border: 1px solid #e5e7eb;
  padding: 0.75rem;
  text-align: left;
}

.permissions-table th {
  background-color: #f9fafb;
  font-weight: 500;
}

.method {
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
}

.method.get {
  color: #16a34a;
}

.method.post {
  color: #2563eb;
}

.method.put {
  color: #ca8a04;
}

.method.delete {
  color: #dc2626;
}
</style>
