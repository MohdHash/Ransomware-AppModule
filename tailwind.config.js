/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBlue: "#1E293B",
        navy: "#0F172A",
        cyberGreen: "#34D399",
        neonBlue: "#3B82F6",
        amber: "#F59E0B",
        lightGray: "#E5E7EB",
        mutedGray: "#9CA3AF",
        electricPurple: "#A855F7",
        // Additional Colors
        softYellow: "#FDE047",
        deepRed: "#DC2626",
        oceanBlue: "#2563EB",
        forestGreen: "#166534",
        paleBlue: "#DBEAFE",
        warmGray: "#D1D5DB",
        twilightPurple: "#6D28D9",
        midnightBlue: "#1E3A8A",
        softPink: "#F9A8D4",
        mistyRose: "#FFE4E6",
        skyGray: "#CBD5E1",
        slate: "#475569",
        jetBlack: "#111827",



         // Header and Text Colors
         'header-bg': '#1E3A8A',   // Warm Dark Blue (Background for Header)
         'header-text': '#FFFFFF',  // White (Text color in Header)
 
         // Card and Content Colors
         'card-bg': '#F0F4F8',      // Light Blueish White (Card Background)
         'card-border': '#D1D5DB',  // Muted Gray (Card Border)
 
         // Heading and Subheading Colors
         'heading-color': '#1D4ED8', // Warm Blue (Primary Heading Color)
         'subheading-color': '#3B82F6', // Lighter Blue (Subheading Color)
 
         // Footer Color
         'footer-bg': '#0F172A',    // Deep Navy Blue (Footer Background)
         'footer-text': '#FFFFFF',  // White (Text in Footer)
 
         // Form Colors
         'form-bg': '#F8FAFC',      // Light Grayish Blue (Form Background)
         'form-border': '#E5E7EB',  // Light Gray (Form Border)
         'form-input-text': '#1E293B', // Dark Blue (Input Text)
 
         // Text Colors
         'primary-text': '#1E293B', // Dark Blue (Primary Text Color)
         'secondary-text': '#6B7280', // Muted Gray (Secondary Text Color)
         
         // Calm and Appealing Accent Colors
         'accent-color': '#94A3B8',   // Soft Grayish Blue (Accent Color for Buttons or Highlights)
         'highlight-color': '#A7F3D0', // Light Greenish Blue (Highlight Color)
 
         // Background Colors
         'bg-light': '#FFFFFF',  // White Background
         'bg-dark': '#111827',   // Very Dark Navy Blue (For Dark Background)
         
         // Border Colors
         'border-light': '#D1D5DB',  // Light Gray (For Borders)
         'border-dark': '#1E293B',
      },
    },
  },
  plugins: [],
}
