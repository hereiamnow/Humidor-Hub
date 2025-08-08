// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Crucial: This tells Tailwind where to find your classes
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        headline: ['Inter', 'sans-serif'],
        code: ['monospace'],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        humidorhub: {
          "primary": "#44403c",          
          "primary-content": "#ffffff",                    
          "secondary": "#9ca3af",                    
          "secondary-content": "#090a0b",                    
          "accent": "#4b5563",                    
          "accent-content": "#d8dbde",                    
          "neutral": "#d6d3d1",                    
          "neutral-content": "#101010",                    
          "base-100": "#1f2937",                    
          "base-200": "#19222e",                    
          "base-300": "#141c26",                    
          "base-content": "#cdd0d3",                    
          "info": "#e7e5e4",                    
          "info-content": "#131212",                    
          "success": "#16a34a",                    
          "success-content": "#ffffff",                    
          "warning": "#fef08a",                    
          "warning-content": "#000000",                    
          "error": "#f87171",                    
          "error-content": "#000000",
          "--rounded-box": "1rem",      // border radius rounded-box utility class, used in card and other large boxes
          "--rounded-btn": "0.5rem",    // border radius rounded-btn utility class, used in buttons and similar element
          "--rounded-badge": "1.9rem",  // border radius rounded-badge utility class, used in badges and similar
          "--animation-btn": "0.25s",   // duration of animation when you click on button
          "--animation-input": "0.2s",  // duration of animation for inputs like checkbox, toggle, radio, etc
          "--btn-focus-scale": "0.95",  // scale transform of button when you focus on it
          "--border-btn": "1px",        // border width of buttons
          "--tab-border": "1px",        // border width of tabs
          "--tab-radius": "0.5rem",     // border radius of tabs
        },
      },
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
    ],
  },
};
