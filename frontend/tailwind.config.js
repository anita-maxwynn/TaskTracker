/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'jira-primary': '#0052CC',
        'jira-primary-hover': '#0747A6',
        'jira-secondary': '#DFE1E6',
        'jira-background': '#F4F5F7',
        'jira-surface': '#FFFFFF',
        'jira-text-primary': '#172B4D',
        'jira-text-secondary': '#5E6C84',
        'jira-text-subtle': '#6B778C',
        'jira-border': '#DFE1E6',
        'jira-success': '#00875A',
        'jira-warning': '#FF8B00',
        'jira-danger': '#DE350B',
        'jira-info': '#0065FF',
      },
    },
  },
  plugins: [],
}