<!-- App.vue or LoginPage.vue -->
<template>
  <div class="login-wrapper">
    <!-- Background layers -->
    <div class="login-left"></div>
    <div class="login-right"></div>

    <!-- Login Form Overlay -->
    <div class="login-form-container">
      <LoginComponent />
    </div>
  </div>
</template>

<script>
import LoginComponent from '@/components/LoginComponent.vue';

export default {
  components: { LoginComponent }
}
</script>

<style scoped>
.login-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  overflow: hidden;
}

/* Left and right background blocks */
.login-left,
.login-right {
  flex: 1;
  height: 100%;
}

.login-left {
  background-color: #676767;
  background-image: url('@/assets/logo.svg');
  background-repeat: no-repeat;
  background-position: center;
}

.login-right {
  background-color: #e4e140;
}

/* Login form overlay */
.login-form-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  background-color: rgb(230, 230, 230);
  padding: 2rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
}
</style>
