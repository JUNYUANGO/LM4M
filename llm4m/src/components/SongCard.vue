<template>
  <a :href="song.link" target="_blank" class="song-card-link">
    <div class="song-card">
      <img :src="song.imageUrl" :alt="song.title" class="song-image">
      <div class="song-info">
        <h3 class="song-title">{{ song.title }}</h3>
        <p class="song-artist">{{ song.artist }}</p>
        <a :href="song.link" target="_blank" class="spotify-link">Listen on Spotify</a>
      </div>
    </div>
  </a>
</template>

<script>
export default {
  props: {
    song: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style scoped>
.song-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  text-decoration: none;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  overflow: hidden;
  height: fit-content;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.song-card:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.song-image {
  width: 100px;
  height: 100px;
  margin: 15px;
  object-fit: cover;
}

.song-info {
  padding: 10px;
}

.song-title, .song-artist {
  margin: 5px 0;
}

.spotify-link {
  display: block;
  color: #1DB954;
  text-decoration: none;
  padding: 5px 15px;
  border-radius: 20px;
  margin-top: 10px;
}
</style>
