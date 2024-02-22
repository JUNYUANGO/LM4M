<template>
  <div class="app-container">
    <HeaderComp :theme="theme" @toggleTheme="toggleTheme"/>
    <ConversationSection ref="conversationSection" :conversationHistory="conversationHistory"/>
    <UserInput :isWaitingForResponse="isWaitingForResponse" @getRecommendations="getMusicRecommendations"/>
    <DisplayResults :songs="songs"/>
  </div>
</template>

<script>
import HeaderComp from './components/HeaderComp.vue';
import ConversationSection from './components/ConversationSection.vue';
import UserInput from './components/UserInput.vue';
import DisplayResults from './components/DisplayResults.vue';
import MusicRecommendation from './components/MusicRecommendation.vue';

export default {
  name: 'App',
  components: {
    HeaderComp,
    ConversationSection,
    UserInput,
    DisplayResults,
  },
  data() {
    return {
      theme: 'light',
      conversationHistory: [],
      isWaitingForResponse: false,
      songs: [] // To be filled with music recommendations
    };
  },
  methods: {
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      document.body.className = this.theme;
    },
    async getMusicRecommendations(userInput) {
      this.isWaitingForResponse = true;
      this.addToConversation(userInput, 'user');

      const recommendations = await MusicRecommendation.methods.fetchRecommendations(userInput);
      this.songs = recommendations; // Assuming the API returns an array of song names
      this.addToConversation(`Here are your music recommendations based on your feelings:`, 'system', recommendations);
      this.isWaitingForResponse = false;
    },
    addToConversation(message, type, songs = null) {
      this.conversationHistory.push({message, type, songs});
      this.$refs.conversationSection.scrollToBottom();
    },
    setSystemTheme() {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.theme = prefersDark ? 'dark' : 'light';
      document.body.className = this.theme;
    },
  },
  mounted() {
    this.setSystemTheme();
  },
  created() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      this.theme = e.matches ? 'dark' : 'light';
      document.body.className = this.theme;
    });
  },
};
</script>


<style>
.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
}

h1, textarea, button {
  font-family: 'IBM Plex Sans', Ubuntu, sans-serif;
}
</style>
