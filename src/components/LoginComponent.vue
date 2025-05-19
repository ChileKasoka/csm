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
      {{ loading ? "Logging in..." : "Login" }}
    </button>
    <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>
  </form>
</template>

<script>
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
        const response = await fetch("http://localhost:8080/login", {
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

        localStorage.setItem("access_token", data.token || JSON.stringify(data));

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
</style>
