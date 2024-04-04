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
      this.input = '';
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
.input-section {
  position: fixed;
  bottom: 0;
  left: 50%; /* Center align the input section */
  transform: translateX(-50%); /* Adjust horizontally to truly center */
  box-sizing: border-box; /* Ensure padding is included in width calculation */
  display: flex;
  align-items: center; /* Align items vertically within the section */
  justify-content: space-between; /* Space out textarea and button */
  max-width: 650px;
  width: 100%;
  margin: 50px auto;
}

.input-section textarea {
  flex-grow: 1;
  margin-bottom: 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  resize: none; /* Consider allowing resize on larger screens if it improves UX */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 16px; /* Consider scaling this with viewport width */
  min-height: 48px;
  height: auto;
  overflow-y: hidden;
}

.input-section textarea:focus {
  overflow-y: auto;
}

.input-section button {
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 8px;
  border: none;
  background-color: #007BFF;
  color: white;
  font-size: 16px; /* Consider scaling this with viewport width */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
  height: 100%;
  margin: 10px;
}

.input-section button:hover {
  background-color: #0056b3; /* Darker blue on hover for feedback */
}

/* Responsive styles */
@media (max-width: 600px) {
  .input-section {
    left: 0; /* Reset to full width for small screens */
    transform: none; /* Remove transform for small screens */
    width: 100%; /* Ensure it spans the full width of the viewport */
    padding: 20px;
  }

  .input-section textarea{
    width: 100%;

  }

  .input-section button {
    max-width: fit-content;
    height: 100%;
    margin: 10px;
  }
}
</style>
