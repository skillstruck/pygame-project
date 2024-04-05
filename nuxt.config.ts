// NUXT CONFIG FILE
import {defineNuxtConfig} from 'nuxt/config';

export default defineNuxtConfig({
    ssr: false,
    css: ['@/assets/styles/main.css'],
    app: {
        head: {
            title: 'Pygame Project',
            htmlAttrs: {
                lang: 'en'
            }
        },
    },
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        }
    },
    runtimeConfig: {
        public: {
            CONTAINER_SOCKET: process.env.CONTAINER_SOCKET,
        },
    },
    devServer: {
        port: 3000,
    },
});