<template>
  <div class="settings-page">
    <header class="page-header">
      <h1>⚙️ Settings</h1>
      <p>Manage your account and application preferences.</p>
    </header>

    <!-- Account Settings -->
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
        <input type="password" v-model="user.password" placeholder="••••••••" />
      </div>

      <button @click="saveSettings" class="save-btn">Save Changes</button>

      <!-- Feedback -->
      <p v-if="saveSuccess" class="success-msg">✅ Settings saved!</p>
      <p v-if="saveError" class="error-msg">❌ Failed to save settings.</p>
    </section>

    <!-- Preferences -->
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
const API_BASE_URL = process.env.VUE_APP_BASE_URL || 'http://localhost:8080';

export default {
  name: 'SettingsPage',
  data() {
    return {
user: {
  id: null,
  name: '',
  email: '',
  password: '',
  role_id: null
}
,
      preferences: {
        darkMode: false
      },
      saveSuccess: false,
      saveError: false
    };
  },
  mounted() {
    // Load user info
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    this.user = {
      id: storedUser.id,
      name: storedUser.name,
      email: storedUser.email,
      password: '',
      role_id: storedUser.role?.id || storedUser.role_id || null
    };


    // Load dark mode preference
    this.preferences.darkMode = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark', this.preferences.darkMode);
  },
  watch: {
    'preferences.darkMode'(newVal) {
      localStorage.setItem('darkMode', newVal);
      document.body.classList.toggle('dark', newVal);
    }
  },
  methods: {
async saveSettings() {
  const payload = {
    name: this.user.name,
    email: this.user.email,
    role_id: this.user.role_id // add role_id explicitly
  };

  // Only include password if user filled it
  if (this.user.password && this.user.password.trim() !== '') {
    payload.password = this.user.password;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/users/${this.user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Failed to update user:", errorText);
      alert('Failed to save settings');
      return;
    }

    const updatedUser = await res.json();
    localStorage.setItem('user', JSON.stringify(updatedUser));
    alert('Settings saved!');
    this.user.password = ''; // clear password after save
  } catch (err) {
    console.error("Save error:", err);
    alert('Error saving settings');
  }
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

.success-msg {
  color: green;
  margin-top: 0.5rem;
}

.error-msg {
  color: red;
  margin-top: 0.5rem;
}
</style>
