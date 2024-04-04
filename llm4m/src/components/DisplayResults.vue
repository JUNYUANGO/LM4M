<template>
  <div class="results-section">
    <SongCard
        v-for="(song, index) in songs"
        :key="index"
        :song="song"
    />
  </div>
</template>

<script>
import SongCard from './SongCard.vue'; // Ensure the path is correct

export default {
  name: 'DisplayResults',
  components: {
    SongCard
  },
  props: ['songs']
};
</script>

<style scoped>
</style>