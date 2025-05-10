<template>
  <form class="login-form">
    <h2 class="login-title">Login</h2>
    <input type="text" placeholder="Username" />
    <input type="password" placeholder="Password" />
    <button type="submit" class="submit-btn">Login</button>
  </form>
</template>

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
  border: 5px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #323232;
  color: #fff;
}
</style>
