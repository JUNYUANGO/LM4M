<template>
  <div class="loading-container">
    <!-- Display the loading progress bar when isLoading is true -->
    <a-progress class="loading-bar" v-if="isLoading" :percent="loadingProgress" status="active" />
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'MusicRecommendation',
  data() {
    return {
      isLoading: false,
      loadingProgress: 0
    }
  },
  methods: {
    /*** This function sends requests to OpenAI based on the User Input ***/

    async sendOpenAIRequest(userInput) {
      const openAIResponse = await axios.post(
        'https://api.openai.com/v1/completions',
        {
          model: 'text-davinci-003', // Adjust model as needed
          prompt: `Suggest some music based on the following mood: ${userInput}`,
          max_tokens: 100
        },
        {
          headers: {
            'Authorization': `Bearer YOUR_OPENAI_API_KEY`
          }
        }
      )
      return openAIResponse
    },


    /*** This function parses the OpenAI response and returns the music recommendations ***/

    parseOpenAIResponse(response) {
      // Parse the OpenAI response and return the music recommendations
      const recommendations = response.split('\n').filter(line => line.trim() !== '')
      console.log('This function needs improvement.')
      return recommendations
    },


    /*** This function fetches the music recommendations based on the user input ***/

    async fetchRecommendations(userInput) {
      // Start the loading process
      // this.startLoading()

      // Sending the user input to OpenAI's API
      console.log('Sending request to OpenAI')
      const openAIResponse = await this.sendOpenAIRequest(userInput)
      console.log('OpenAI response:', openAIResponse.data.choices[0].text)

      // Parse the OpenAI response and return the music recommendations
      const parsedResult = this.parseOpenAIResponse(openAIResponse.data.choices[0].text)
      console.log('Parsed OpenAI response: ', parsedResult)
      return parsedResult

    },


    /*** This function fetches the Spotify data based on the music recommendation ***/

    async fetchSpotifyData(recommendation) {
      const spotifyResponse = await axios.get(`https://api.spotify.com/v1/search`, {
        params: {
          q: recommendation,
          type: 'track',
          limit: 1
        },
        headers: {
          'Authorization': `Bearer YOUR_SPOTIFY_ACCESS_TOKEN`
        }
      })

      // Extract and return the relevant data from Spotify's response
      const trackInfo = spotifyResponse.data.tracks.items[0]
      return {
        name: trackInfo.name,
        artist: trackInfo.artists.map(artist => artist.name).join(', '),
        link: trackInfo.external_urls.spotify
      }
    }

    // startLoading() {
    //   this.isLoading = true
    //   this.loadingProgress = 0
    // },
    // finishLoading() {
    //   this.isLoading = false
    //   this.loadingProgress = 100 // Ensure the progress bar completes before hiding
    //   setTimeout(() => {
    //     this.loadingProgress = 0 // Reset progress for the next operation
    //   }, 500) // Short delay to visually complete the progress
    // }
  }
}
</script>

<style>
.loading-container {
  width: 100%;
  background-color: #e0e0e0;
  border-radius: 2px;
}

.loading-bar {
  height: 5px;
  background-color: #3b82f6;
  border-radius: 2px;
  transition: width 0.5s ease;
}
</style>
