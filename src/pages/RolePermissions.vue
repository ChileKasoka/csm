<template>
  <div class="page-container">
    <h2 class="page-title">Role Permissions</h2>

    <div
      class="role-section"
      v-for="(role, index) in groupedPermissions"
      :key="index"
    >
      <h3 class="role-title">{{ role.role_name }}</h3>

      <div class="permission-badges">
        <div
          class="permission-badge"
          v-for="(perm, pIndex) in role.permissions"
          :key="pIndex"
        >
          {{ perm.permission_name }}
          <span class="remove-btn" @click="removePermission(role.role_id, perm.permission_id)">✕</span>
        </div>
      </div>
    </div>

    <div v-if="groupedPermissions.length === 0" class="empty-message">
      No role-permissions found.
    </div>
  </div>
</template>

<script>
const API_BASE_URL = process.env.VUE_APP_BASE_URL || 'http://localhost:8080';

export default {
  name: "RolePermissions",
  data() {
    return {
      rawPermissions: [],
      groupedPermissions: [],
      token: null,
    };
  },

  mounted() {
    const rawToken = localStorage.getItem("access_token");
    try {
      const parsed = JSON.parse(rawToken);
      this.token = parsed.access_token;
    } catch (e) {
      this.token = rawToken;
    }

    this.rolePermissions();
  },

  methods: {
    async rolePermissions() {
      try {
        const res = await fetch(`${API_BASE_URL}/role-permissions`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        this.rawPermissions = Array.isArray(data) ? data : data.data || [];

        const grouped = {};
        this.rawPermissions.forEach((item) => {
          const roleKey = `${item.role_id}-${item.role_name}`;
          if (!grouped[roleKey]) {
            grouped[roleKey] = {
              role_id: item.role_id,
              role_name: item.role_name,
              permissions: [],
            };
          }
          grouped[roleKey].permissions.push({
            permission_name: item.permission_name,
            permission_id: item.permission_id,
          });
        });

        this.groupedPermissions = Object.values(grouped);
      } catch (err) {
        console.error("Failed to fetch role permissions:", err);
      }
    },

    async removePermission(roleId, permissionId) {
      if (!confirm("Are you sure you want to remove this permission from the role?")) return;

      try {
        const res = await fetch(
          `${API_BASE_URL}/role-permissions/${roleId}/permissions/${permissionId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to delete permission");

        // Re-fetch updated list
        this.rolePermissions();
      } catch (err) {
        console.error("Error deleting permission:", err);
        alert("Could not remove permission.");
      }
    },
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
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 0.5rem;
}

.role-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  text-transform: capitalize;
}

.permission-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.permission-badge {
  background-color: #e0f2fe;
  color: #0369a1;
  padding: 0.4rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.remove-btn {
  background: transparent;
  color: #dc2626;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  margin-left: 0.25rem;
}

.remove-btn:hover {
  color: #b91c1c;
}

.empty-message {
  padding: 1rem;
  font-style: italic;
  color: #6b7280;
}
</style>
