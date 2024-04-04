<template>
  <div class="conversation-section" ref="conversationContainer">
    <div class="message" v-for="(item, index) in conversationHistory" :key="index"
         :class="{'user-message': item.type === 'user', 'system-message': item.type === 'system' || item.type === 'text'}">
      <div class="message-header">
        <div class="icon-container">
          <IconUser v-if="item.type === 'user'"/>
          <IconResponse v-else/>
        </div>
        <div class="source-label">{{ item.type === 'user' ? 'User' : 'System' }}</div>
      </div>
      <div class="message-content">
        <p v-if="item.type === 'text' || item.type === 'system' || item.type === 'user'">{{ item.message }}</p>
        <div v-if="item.type === 'song'" class="cards-container">
          <SongCard v-for="(song, idx) in item.songs" :key="`song-${idx}`" :song="song" class="song-card-container"/>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import IconUser from './icons/IconUser.vue'
import IconResponse from './icons/IconResponse.vue'
import SongCard from "@/components/SongCard.vue";

export default {
  name: 'ConversationSection',
  components: {
    SongCard,
    IconUser,
    IconResponse
  },
  props: {
    conversationHistory: {
      type: Array,
      required: true
    }
  },
  methods: {
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.conversationContainer
        container.scrollTop = container.scrollHeight
      })
    }
  },
  watch: {
    conversationHistory: {
      immediate: false,
      deep: true,
      handler() {
        this.scrollToBottom()
      }
    }
  }
}
</script>

<style scoped>
.conversation-section {
  max-width: 800px; /* Use max-width for scalability on smaller devices */
  width: 100%; /* Ensure section stretches to device width */
  height: 500px;
  border: 1px solid #ccc;
  border-radius: 20px;
  margin: 10px auto; /* Center the section on the page */
  overflow-y: scroll;
  padding: 10px;
}

.message {
  margin-bottom: 20px;
}

.message-header {
  display: flex;
  align-items: center;
  margin: 20px 0 10px 20px; /* Consolidated margin property */
}

.icon-container {
  margin-right: 10px;
}

.source-label {
  font-weight: bold;
}

.message-content {
  margin-left: 50px;
}

.user-message p, .system-message p {
  text-align: left;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around; /* Adjust if needed for better alignment */
  align-items: flex-start;
}

.song-card-container {
  margin: 10px;
  flex: 0 1 calc(50% - 20px); /* Adjust based on margins to fit two cards per row */
}

/* Responsive adjustments for smaller screens */
@media (max-width: 600px) {
  .conversation-section {
    height: 500px; /* Allow dynamic height for variable content */
    margin: 10px; /* Smaller margin to utilize more screen space */
    width: 100%;
  }

  .message-header, .message-content {
    margin-left: 10px; /* Reduce margin for more screen real estate */
  }

  .message-content {
    margin-left: 30px; /* Adjust content margin slightly larger than header for visual hierarchy */
  }

  .song-card-container {
    flex: 0 1 calc(100% - 20px); /* Allow cards to take full width minus margin */
  }
}
</style>
