<template>
  <div class="loading-container" v-if="isLoading">
    <!-- Loading indicator here -->
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'MusicRecommendation',
  data() {
    return {
      isLoading: false,
      loadingProgress: 0,
      recommendedSongs: []
    }
  },
  methods: {
    /*** This function sends requests to OpenAI based on the User Input ***/
    async sendOpenAIRequest(userInput) {
      const apiKey = process.env.VUE_APP_OPENAI_API_KEY;

      if (!apiKey) {
        console.error('OpenAI API key is missing');
        return null;
      }

      this.isLoading = true;
      this.loadingProgress = 30;

      try {
        const url = `https://api.openai.com/v1/chat/completions`;

        const messages = [
          {
            role: 'system',
            content:
                'You are a music recommendation system designed to suggest songs based on user input. ' +
                'Please list musics only, without additional commentary or details. Respond with a straightforward list of music recommendations.',
          },
          {
            role: 'user',
            content: userInput,
          }
        ];


        const data = {
          model: "gpt-3.5-turbo",
          messages: messages,
          max_tokens: 200,
          temperature: 0.7
        };

        const headers = {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        };

        const response = await axios.post(url, data, {headers});
        console.log("Response: ", response);

        this.isLoading = false;
        this.loadingProgress = 100;

        return response.data;
      } catch (error) {
        console.error('Error in sendOpenAIRequest:', error);
        this.isLoading = false;
        this.loadingProgress = 0; // Reset progress on error
        return null;
      }
    },

    /*** Parses OpenAI response and returns music recommendations ***/
    parseOpenAIResponse(response) {
      if (!response || !response.choices || !response.choices.length) {
        console.log('No recommendations found.');
        return [];
      }

      const recommendations = response.choices[0].message.content;

      recommendations.split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0);

      return recommendations;
    },

    /*** Fetches music recommendations based on user input ***/
    async fetchRecommendations(userInput) {
      // Send request to OpenAI
      console.log('Sending request to OpenAI...');
      const openAIResponse = await this.sendOpenAIRequest(userInput);
      if (!openAIResponse) {
        console.log('Failed to get a response from OpenAI');
        return [];
      }
      console.log('OpenAI response:', openAIResponse);

      // Parse the OpenAI response to get the music recommendations
      const parsedResult = this.parseOpenAIResponse(openAIResponse);
      console.log('Parsed OpenAI response:', parsedResult);

      // Parse the recommendations to Spotify queries
      const spotifyQueries = this.parseRecommendationsToSpotifyQuery(parsedResult);
      console.log('Spotify queries:', spotifyQueries);

      // Get Spotify access token
      const spotifyAccessToken = await this.getSpotifyAccessToken();

      // Fetch Spotify data for each recommendation
      const spotifyData = await Promise.all(spotifyQueries.map(query => this.fetchSpotifyData(query, spotifyAccessToken)));
      console.log('Spotify data:', spotifyData);

      // Add the Spotify data to the recommended songs array
      this.recommendedSongs = spotifyData.filter(song => song !== null);

      return this.recommendedSongs;
    },

    /** Parses Recommendations to Spotify Query ***/
    parseRecommendationsToSpotifyQuery(recommendations) {
      // Split the string by new lines to process each recommendation individually
      const lines = recommendations.split('\n');

      if (recommendations.length === 0) {
        return [];
      }

      // Map each line to a Spotify search query
      const queries = lines.map(line => {
        // Extract the song title and artist by removing the number, quotes, and "by"
        const match = line.match(/"\s*(.+?)\s*"\s*by\s*(.+)/);
        if (match) {
          const [, songTitle, artist] = match;
          // Format as Spotify search query
          return `track:"${songTitle}" artist:${artist}`;
        }
        return null; // Return null for lines that do not match the expected pattern
      }).filter(query => query !== null); // Filter out any nulls from lines that didn't match

      return queries;
    },

    /*** Retrieves Spotify access token ***/
    async getSpotifyAccessToken() {
      console.log('Getting Spotify access token...');
      const spotifyClientId = process.env.VUE_APP_SPOTIFY_CLIENT_ID;
      const spotifyClientSecret = process.env.VUE_APP_SPOTIFY_CLIENT_SECRET;

      if (!spotifyClientId || !spotifyClientSecret) {
        console.error('Spotify client ID or client secret is missing');
        return null;
      }

      // Base64 encode client ID and client secret
      const credentials = btoa(`${spotifyClientId}:${spotifyClientSecret}`);

      const headers = {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      };

      const data = 'grant_type=client_credentials';

      // Send a POST request to get the access token
      try {
        const response = await axios.post('https://accounts.spotify.com/api/token', data, {headers});

        if (response.data && response.data.access_token) {
          console.log('Spotify access token:', response.data.access_token);
          return response.data.access_token;
        } else {
          console.error('Failed to get Spotify access token');
          return null;
        }
      } catch (error) {
        console.error('Fail to get Spotify access token:', error);
        return null;
      }
    },

    /*** Fetches Spotify data based on music recommendation ***/
    async fetchSpotifyData(recommendation, spotifyAccessToken) {
      try {
        // Send a GET request to Spotify API to search for the track
        const spotifyResponse = await axios.get(`https://api.spotify.com/v1/search`, {
          params: {
            q: recommendation,
            type: 'track',
            limit: 1
          },
          headers: {
            'Authorization': `Bearer ${spotifyAccessToken}`
          }
        });

        // Check if any tracks were found
        if (!spotifyResponse.data || !spotifyResponse.data.tracks || !spotifyResponse.data.tracks.items) {
          console.error('Invalid or empty Spotify response:', spotifyResponse.data);
          return null;
        }

        // Extract relevant information from the Spotify response
        if (spotifyResponse.data.tracks.items.length > 0) {
          const trackInfo = spotifyResponse.data.tracks.items[0];

          return {
            title: trackInfo.name || 'Unknown Track',
            artist: trackInfo.artists.map(artist => artist.name).join(', '),
            link: trackInfo.external_urls.spotify,
            imageUrl: trackInfo.album.images[0]?.url || 'default_image_url',
          };
        } else {
          return null; // Or handle the case where no tracks were found
        }
      } catch (error) {
        console.error('Failed to fetch Spotify data:', error);
        return null;
      }
    }
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
