<template>
  <div class="assign-users-page">
    <div class="form-container">
      <h2>Assign Users to Project</h2>
      <p><strong>Project ID:</strong> {{ projectId }}</p>

      <form @submit.prevent="assignUsers">
        <div class="user-list">
            <label>Select Users to Assign:</label>
            <select v-model="selectedUserIds" multiple size="8" class="user-select">
                <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name }} ({{ user.email }})
                </option>
            </select>
        </div>

        <div class="actions">
          <button type="submit">Assign Users</button>
          <router-link to="/projects" class="cancel-btn">Cancel</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "AssignUsersToProject",
  data() {
    return {
      users: [],
      selectedUserIds: [],
      projectId: this.$route.params.id
    };
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const res = await fetch("http://localhost:8080/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        this.users = await res.json();
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    },
    async assignUsers() {
      if (this.selectedUserIds.length === 0) {
        alert("Please select at least one user.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/user-projects/${this.projectId}/many`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({ user_ids: this.selectedUserIds, project_id: parseInt(this.projectId) }),
        });

        if (!response.ok) throw new Error("Failed to assign users.");
        alert("Users assigned successfully!");
        this.$router.push("/projects");
      } catch (err) {
        alert(err.message || "Error assigning users.");
      }
    },
  },
};
</script>

<style scoped>
.assign-users-page {
  display: flex;
  justify-content: center;
  padding-top: 2rem;
}

.form-container {
  background: white;
  padding: 2rem;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  border-radius: 1rem;
}

.user-list {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.user-checkbox {
  display: flex;
  align-items: center;
}

.user-checkbox label {
  margin-left: 0.5rem;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

button {
  background-color: #10b981;
  color: white;
  font-weight: 600;
  padding: 0.6rem 1.25rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}

.cancel-btn {
  background-color: #9ca3af;
  color: white;
  font-weight: 600;
  padding: 0.6rem 1.25rem;
  border-radius: 0.5rem;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

.user-select {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  margin-bottom: 1rem;
}
</style>
