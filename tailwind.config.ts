import type { Config } from 'tailwindcss'

export default {
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./nuxt.config.{js,ts}",
        "./app.vue",
    ],
    theme: {
        extend: {
            colors: {
                ssblue: '#0C6BFF',
                ssdarkblue: '#0040A8',
                sslightblue: '#3F89FF',
                ssyellow: '#CEF56C',
                ssdarkyellow: '#92c60d',
            }
        },
    },
    darkMode: 'class',
    plugins: [],
} satisfies Config