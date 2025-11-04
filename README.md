# Interval Timer

A mobile-first interval training timer app for exercise with customizable warmup, training, rest periods, and interval counts.

## Features

- ⏱️ **Adjustable Timer Settings**
  - Warmup Time: 0-600 seconds
  - Training Time: 1-600 seconds
  - Rest Time: 0-600 seconds
  - Number of Intervals: 1-50

- 📱 **Mobile-Optimized Design**
  - Responsive layout for phones and tablets
  - Touch-friendly controls with +/- buttons
  - Large, easy-to-read timer display

- 🎯 **Timer Controls**
  - Start/Pause/Resume functionality
  - Reset to initial state
  - Settings locked during operation

- 🎨 **User Experience**
  - Color-coded phase indicators (Warmup, Training, Rest, Complete)
  - Audio feedback for countdown and completion
  - Interval counter showing progress
  - Modern gradient UI design

## Usage

1. Open `index.html` in a web browser
2. Adjust your desired settings:
   - Set warmup duration (optional, can be 0)
   - Set training interval duration
   - Set rest period duration
   - Set number of intervals
3. Tap **Start** to begin
4. Use **Pause** to pause/resume during workout
5. Use **Reset** to start over

## Timer Phases

1. **Warmup** (orange) - Prepare for exercise
2. **Training** (green) - Active exercise period
3. **Rest** (blue) - Recovery period between intervals
4. **Complete** (purple) - All intervals finished

The timer automatically progresses through: Warmup → Training → Rest → Training → Rest... → Complete

## Technical Details

- Pure HTML/CSS/JavaScript (no dependencies)
- Web Audio API for sound feedback
- Progressive Web App ready
- Optimized for mobile devices (375x667) and tablets (768x1024)

## Browser Support

Works on modern browsers that support:
- ES6 JavaScript
- CSS Flexbox
- Web Audio API (for sound, optional)
