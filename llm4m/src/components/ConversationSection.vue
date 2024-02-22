<template>
  <div class="conversation-section" ref="conversationContainer">
    <div class="message" v-for="(item, index) in conversationHistory" :key="index"
         :class="{'user-message': item.type === 'user', 'system-message': item.type === 'system'}">
      <div class="message-header">
        <div class="icon-container">
          <IconUser v-if="item.type === 'user'" />
          <IconResponse v-else />
        </div>
        <div class="source-label">{{ item.type === 'user' ? 'User' : 'LLM4M' }}</div>
      </div>
      <div class="message-content">
        <p>{{ item.message }}</p>
        <ul v-if="item.songs">
          <li v-for="(song, index) in item.songs" :key="index">{{ song }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import IconUser from './icons/IconUser.vue'
import IconResponse from './icons/IconResponse.vue'

export default {
  name: 'ConversationSection',
  components: {
    IconUser,
    IconResponse
  },
  props: ['conversationHistory'],
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
  width: 800px;
  height: 500px;
  border: 1px solid #ccc;
  border-radius: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  overflow-y: auto;
  padding: 10px;
  //background-color: white;
}

.message {
  margin-bottom: 20px;
}

.message-header {
  display: flex;
  align-items: center;
  margin-left: 20px;
  margin-bottom: 10px;
  margin-top: 20px;
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

.user-message p {
  text-align: left;
}

.system-message p {
  text-align: left;
}
</style>