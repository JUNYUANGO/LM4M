<template>
  <div class="input-section">
    <textarea v-model="input"
              placeholder="How do you feel today? Share your feelings and get music recommendations." rows="4"
              @keyup.enter="sendInput"
              :disabled="isWaiting"></textarea>
    <button @click="sendInput">Send</button>
  </div>
</template>

<script>
export default {
  name: 'UserInput',
  data() {
    return {
      input: '',
      isWaiting: false,
    };
  },
  methods: {
    sendInput() {
      if (!this.input.trim()) return;
      this.$emit('getRecommendations', this.input);
      this.input = ''; // Clear input after sending
    }
  },
  props: {
    isWaitingForResponse: {
      type: Boolean,
      default: false,
    }
  },
  watch: {
    isWaitingForResponse(newValue) {
      this.isWaiting = newValue;
    }
  }
};
</script>


<style scoped>
.input-section textarea {
  width: 800px;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 20px;
  resize: none;
}

.input-section button {
  padding: 10px 20px;
  cursor: pointer;
}
</style>