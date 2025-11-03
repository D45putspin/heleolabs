# heleolabs

A monochrome landing page for heleolabs—building three innovative dApps on Hathor Network: a collaborative pixel canvas game, a provably fair lottery, and a DAO voting platform.

## Features

- 🎨 Monochrome aesthetic with dynamic corner beam lighting
- ⚡ Grid reveal effects with beam interaction
- 🌊 Animated dust particles and echo effects
- 📊 Scroll-synced progress bar
- 🎹 ASCII raster mode (press 'M' to toggle)
- 🔊 Subtle click sound effects
- 📱 **Mobile-first responsive design** with hamburger menu
- 👆 **Touch-optimized** buttons and interactive elements
- ♿ Reduced motion support for accessibility

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn/pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Development

The development server will start at `http://localhost:5173`

### Project Structure

```
heleolabs/
├── src/
│   ├── LucidLab.tsx      # Main component with all effects
│   ├── main.tsx          # Application entry point
│   └── index.css         # Global styles with Tailwind
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
└── tailwind.config.js    # Tailwind CSS configuration
```

## What We're Building

1. **Pixel Canvas** (In Development) - Collaborative pixel art game inspired by the Million Dollar Homepage, where each pixel placement is a permanent transaction on Hathor
2. **HTR Lottery** (Planned) - Provably fair lottery with transparent draws and verifiable randomness
3. **DAO Voting** (Planned) - Decentralized governance platform with token-weighted voting

## Interactive Features

- **Scroll Effects**: The beam and grid reveal effects animate as you scroll
- **ASCII Mode**: Press 'M' to toggle ASCII raster overlay
- **Click Sounds**: Subtle audio feedback on interactive elements
- **Mobile Menu**: Hamburger menu for mobile navigation with smooth animations
- **Touch-Friendly**: All buttons and interactive elements optimized for touch devices
- **Runtime Tests**: Open console and run `window.runLucidLabTests()` to verify component integrity

## Mobile Optimizations

- Responsive text sizing from mobile to desktop
- Touch-optimized button sizes (minimum 44x44px touch targets)
- Mobile hamburger menu with smooth animations
- Optimized spacing and padding for small screens
- Full-width buttons on mobile, inline on desktop
- Responsive grid layouts (2 columns → 4 columns)
- Smaller font sizes and tighter spacing on mobile

## Performance

- Optimized animations with CSS transforms and will-change
- Passive scroll listeners
- Intersection Observer for lazy activation
- Reduced motion support for accessibility

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Community

- 🛰️ Telegram: [Join the HeleoLabs Relay](https://t.me/HeleoLabs)
- ✖️ X: [@heleolabs](https://x.com/heleolabs)

## License

MIT

---

© 2025 heleolabs — Building on Hathor Network
