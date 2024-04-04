import {fileURLToPath, URL} from 'node:url'

import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import * as process from "process";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        define: {
            'process.env.VUE_APP_OPENAI_API_KEY': JSON.stringify(env.VUE_APP_OPENAI_API_KEY),
            'process.env.VUE_APP_SPOTIFY_CLIENT_ID': JSON.stringify(env.VUE_APP_SPOTIFY_CLIENT_ID),
            'process.env.VUE_APP_SPOTIFY_CLIENT_SECRET': JSON.stringify(env.VUE_APP_SPOTIFY_CLIENT_SECRET),
        },
        plugins: [
            vue(),
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        }
    };
});