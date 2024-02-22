<template>
  <div class="results-section">
    <ul v-if="songs && songs.length">
      <li v-for="(song, index) in songs" :key="index">{{ song }}</li>
    </ul>
    <p v-else>No songs found.</p>
  </div>
</template>

<script>
export default {
  name: 'DisplayResults',
  props: ['songs']
};
</script>

<style scoped>
</style>