/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}", // Ensure all JSX/TSX files are included
    ],
    theme: {
      extend: {
        colors: {
          primary: '#234d43', // Custom blue shade
          secondary: "#F59E0B", // Custom yellow shade
        },
      },
    },
    plugins: [],
  };
  