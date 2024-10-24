/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'trai-white': '#FFFFFF',
        'trai-background': '#F8F9FA',
        'trai-mint': '#4FD1C5',
        'trai-navy': '#2C3357',
        'trai-darknavy': '#151928',
        'trai-greytext': '#A0AEC0',
        'trai-text': '#2D3748',
        'trai-success': '#48BB78',
        'trai-error': '#E53E3E',
        'trai-disabled': '#CBD5E0',
        'trai-highprice': '#F13B3B',
        'trai-lowprice': '#3030FD',
        'trai-sell': '#2D9CDB',
        'trai-buy': '#EB5757',
      },
      fontFamily: {
        pretendard: ['Pretendard', 'sans-serif'],
        helveticaRegular: ['HelveticaRegular'],
        helveticaLight: ['HelveticaLight'],
        helveticaBold: ['HelveticaBold'],
      },
    },
  },
  plugins: [],
}
