/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        recording: '#F43F5E',
        primary: '#009CB1',
        process: '#28A18C',
      },
    },
  },
  plugins: [],
}
