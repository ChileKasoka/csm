<template>
  <form class="login-form" @submit.prevent="handleLogin">
    <h2 class="login-title">Login</h2>
    <input
      type="email"
      placeholder="Email"
      v-model="email"
      required
      autocomplete="email"
    />
    <input
      type="password"
      placeholder="Password"
      v-model="password"
      required
      autocomplete="current-password"
    />
    <button type="submit" class="submit-btn" :disabled="loading">
      <span v-if="loading" class="spinner"></span>
      {{ loading ? "Logging in..." : "Login" }}
    </button>
    <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>
  </form>
</template>

<script>

const API_BASE_URL = process.env.VUE_APP_BASE_URL || 'http://localhost:8080';

export default {
  data() {
    return {
      email: "",
      password: "",
      loading: false,
      errorMessage: "",
    };
  },
  methods: {
    async handleLogin() {
      this.errorMessage = "";
      this.loading = true;

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const response = await fetch("API_BASE_URL/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
          }),
        });

        if (!response.ok) {
          throw new Error("Invalid email or password");
        }

        const data = await response.json();

        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user", JSON.stringify({ id: data.user.id, name: data.user.name }));
        localStorage.setItem("permissions", JSON.stringify(data.permissions));

        // Optional: redirect or update UI here
        this.$router.push('/dashboard')
      } catch (err) {
        this.errorMessage = err.message || "Login failed";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.login-title {
  font-size: 2rem;
  font-weight: bold;
  color: #282828;
  text-align: center;
}
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: rgb(230, 230, 230);
}
.login-form input,
.login-form button {
  padding: 0.5rem;
  font-size: 1rem;
}
.submit-btn {
  background-color: #e4e140;
  color: #282828;
  border: none;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #323232;
  color: #fff;
}

.error-msg {
  color: red;
  text-align: center;
}

.spinner {
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-left-color: #282828;
  border-radius: 50%;
  width: 1rem;
  height: 1rem;
  display: inline-block;
  margin-right: 0.5rem;
  animation: spin 1s linear infinite;
  vertical-align: middle;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

</style>
