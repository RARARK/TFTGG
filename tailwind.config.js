/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Open Sans는 한글 글립이 없어요 → 한글 폴백을 꼭 같이!
        sans: ["Open Sans Variable", "Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", "system-ui", "Arial"],
      },
    },
  },
  plugins: [],
}

