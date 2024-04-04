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
      songs: []
    };
  },
  methods: {
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      document.body.className = this.theme;
    },


    /*** Function to get music recommendations based on user input ***/
    async getMusicRecommendations(userInput) {
      this.isWaitingForResponse = true;
      this.addToConversation(
          userInput,
          'user',
          null
      );

      try {
        // Fetch music recommendations based on user input
        const recommendations = await MusicRecommendation.methods.fetchRecommendations(userInput);

        // Check if recommendations were found
        if (recommendations && recommendations.length > 0) {

          // Add a system message to the conversation history
          this.addToConversation(
              `Here are some music recommendations: `,
              'system',
              null
          );

          // Add recommendations to the conversation history
          this.addToConversation(
              '',
              'song',
              recommendations
          );
        }

        // Handle case where no recommendations were found
        else {
          this.addToConversation(
              `Sorry, I couldn't find any recommendations based on your input.`,
              'text',
              null
          );
        }
      }

          // Error handling for failed API requests
      catch (error) {
        console.error('Failed to fetch recommendations:', error);
        this.addToConversation(
            `Oops! Something went wrong while fetching your music recommendations. Please try again later.`,
            'text',
            null
        );
      } finally {
        this.isWaitingForResponse = false;
      }
    },


    /*** Function to add messages to the conversation history ***/
    addToConversation(message, type = 'text', songs = null) {

      // Add songs to conversation history
      if (type === 'song' && Array.isArray(songs)) {
        this.conversationHistory.push({
          type: 'song',
          songs: songs,
        });
      }

      // Add text messages to conversation history
      else {
        this.conversationHistory.push({message, type});
      }

      // Scroll to the bottom of the conversation
      this.$nextTick(this.scrollToBottom);
    },


    /*** Function to set system theme ***/
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
  margin: 0 auto;
  width: 100%;
  max-width: none;
  min-width: 320px;
}

h1, textarea, button {
  font-family: 'IBM Plex Sans', Ubuntu, sans-serif;
}

@media (max-width: 600px) {
  .app-container {
    margin: 50px auto;
  }

  h1 {
    font-size: 24px; /* Adjust font size for smaller screens if needed */
  }

  textarea, button {
    width: 100%; /* Adjust width for smaller screens, accounting for padding */

  }
}
</style>
