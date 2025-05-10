<template>
  <div class="settings-page">
    <header class="page-header">
      <h1>⚙️ Settings</h1>
      <p>Manage your account and application preferences.</p>
    </header>

    <section class="settings-section">
      <h2>Account Settings</h2>
      <div class="form-group">
        <label>Name</label>
        <input type="text" v-model="user.name" />
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" v-model="user.email" />
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" v-model="user.password" />
      </div>
      <button @click="saveSettings" class="save-btn">Save Changes</button>
    </section>

    <section class="settings-section">
      <h2>Preferences</h2>
      <div class="form-group">
        <label>
          <input type="checkbox" v-model="preferences.darkMode" />
          Enable Dark Mode
        </label>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'SettingsPage',
  data() {
    return {
      user: {
        name: 'John Doe',
        email: 'john@example.com',
        password: ''
      },
      preferences: {
        darkMode: false
      }
    };
  },
  methods: {
    saveSettings() {
      alert('Settings saved!');
    }
  }
};
</script>

<style scoped>
.settings-page {
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
}

.page-header h1 {
  font-size: 2rem;
  margin-bottom: 0.25rem;
}

.page-header p {
  color: #6b7280;
  margin-bottom: 2rem;
}

.settings-section {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.settings-section h2 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #1f2937;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #374151;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
}

.save-btn {
  background-color: #e4e140;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 1rem;
}

.save-btn:hover {
  background-color: #c7c633;
}
</style>
