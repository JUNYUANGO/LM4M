<template>
  <div class="header-container">
    <h1>Large Language Model for Music Recommendation - LLM4M</h1>
    <button @click="$emit('toggleTheme')" class="theme-toggle-btn">
      <span class="material-symbols-outlined">
        {{ theme === 'light' ? 'dark_mode' : 'light_mode' }}
      </span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'HeaderComp',
  props: ['theme']
}
</script>

<style>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0,
  'wght' 400,
  'GRAD' 0,
  'opsz' 48
}

.theme-toggle-btn {
  border: none;
  background-color: #f0f0f0;
  color: #606060;
  font-size: 16px;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  outline: none;
}

.theme-toggle-btn:hover {
  background-color: #e0e0e0;
}

.dark .theme-toggle-btn {
  background-color: #333;
  color: #fff;
}

.dark .theme-toggle-btn:hover {
  background-color: #444;
}

</style>
