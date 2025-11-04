// Timer state
let timerState = {
    isRunning: false,
    isPaused: false,
    currentPhase: 'ready', // 'ready', 'warmup', 'training', 'rest', 'complete'
    currentInterval: 0,
    timeRemaining: 0,
    timerInterval: null
};

// Get settings values
function getSettings() {
    return {
        warmupTime: parseInt(document.getElementById('warmupTime').value) || 0,
        trainingTime: parseInt(document.getElementById('trainingTime').value) || 1,
        restTime: parseInt(document.getElementById('restTime').value) || 0,
        intervals: parseInt(document.getElementById('intervals').value) || 1
    };
}

// Adjust time with buttons
function adjustTime(type, delta) {
    const inputId = type === 'intervals' ? 'intervals' : `${type}Time`;
    const input = document.getElementById(inputId);
    const currentValue = parseInt(input.value) || 0;
    const newValue = Math.max(parseInt(input.min), Math.min(parseInt(input.max), currentValue + delta));
    input.value = newValue;
}

// Format time for display
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Update display
function updateDisplay() {
    const timeDisplay = document.getElementById('timeDisplay');
    const phaseIndicator = document.getElementById('phaseIndicator');
    const intervalCounter = document.getElementById('intervalCounter');
    const settings = getSettings();

    timeDisplay.textContent = formatTime(timerState.timeRemaining);
    
    // Update phase indicator
    let phaseText = 'Ready';
    let phaseClass = '';
    
    switch (timerState.currentPhase) {
        case 'warmup':
            phaseText = 'Warmup';
            phaseClass = 'phase-warmup';
            break;
        case 'training':
            phaseText = 'Training';
            phaseClass = 'phase-training';
            break;
        case 'rest':
            phaseText = 'Rest';
            phaseClass = 'phase-rest';
            break;
        case 'complete':
            phaseText = 'Complete!';
            phaseClass = 'phase-complete';
            break;
        default:
            phaseText = 'Ready';
            phaseClass = '';
    }
    
    phaseIndicator.textContent = phaseText;
    phaseIndicator.className = `phase-indicator ${phaseClass}`;
    
    // Update interval counter
    intervalCounter.textContent = `Interval: ${timerState.currentInterval}/${settings.intervals}`;
}

// Start timer
function startTimer() {
    if (timerState.isRunning && !timerState.isPaused) {
        return;
    }

    const settings = getSettings();
    
    // Disable settings inputs
    toggleSettingsInputs(true);
    
    // Auto-hide settings on start (Option C) using aria-expanded
    const toggleBtn = document.getElementById('settingsToggle');
    if (toggleBtn) {
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.setAttribute('aria-pressed', 'false');
    }
    
    if (!timerState.isPaused) {
        // Starting fresh
        timerState.currentPhase = settings.warmupTime > 0 ? 'warmup' : 'training';
        timerState.currentInterval = settings.warmupTime > 0 ? 0 : 1;
        timerState.timeRemaining = settings.warmupTime > 0 ? settings.warmupTime : settings.trainingTime;
    }
    
    timerState.isRunning = true;
    timerState.isPaused = false;
    
    // Update button states
    document.getElementById('startBtn').disabled = true;
    document.getElementById('pauseBtn').disabled = false;
    
    // Start countdown
    timerState.timerInterval = setInterval(tick, 1000);
    updateDisplay();
}

// Pause timer
function pauseTimer() {
    if (!timerState.isRunning) {
        return;
    }
    
    timerState.isPaused = true;
    clearInterval(timerState.timerInterval);
    
    // Update button states
    document.getElementById('startBtn').disabled = false;
    document.getElementById('pauseBtn').disabled = true;
}

// Reset timer
function resetTimer() {
    // Stop timer
    clearInterval(timerState.timerInterval);
    
    // Reset state
    timerState = {
        isRunning: false,
        isPaused: false,
        currentPhase: 'ready',
        currentInterval: 0,
        timeRemaining: 0,
        timerInterval: null
    };
    
    // Enable settings inputs
    toggleSettingsInputs(false);
    
    // Update button states
    document.getElementById('startBtn').disabled = false;
    document.getElementById('pauseBtn').disabled = true;
    
    // Update display
    updateDisplay();
}

// Timer tick
function tick() {
    const settings = getSettings();
    
    timerState.timeRemaining--;
    
    // Play sound on last 3 seconds (you can add actual sound later)
    if (timerState.timeRemaining <= 3 && timerState.timeRemaining > 0) {
        playBeep();
    }
    
    if (timerState.timeRemaining <= 0) {
        // Move to next phase
        advancePhase();
    }
    
    updateDisplay();
}

// Advance to next phase
function advancePhase() {
    const settings = getSettings();
    
    switch (timerState.currentPhase) {
        case 'warmup':
            // Move to first training interval
            timerState.currentPhase = 'training';
            timerState.currentInterval = 1;
            timerState.timeRemaining = settings.trainingTime;
            break;
            
        case 'training':
            if (timerState.currentInterval < settings.intervals) {
                // Move to rest
                timerState.currentPhase = 'rest';
                timerState.timeRemaining = settings.restTime;
            } else {
                // All intervals complete
                completeWorkout();
                return;
            }
            break;
            
        case 'rest':
            // Move to next training interval
            timerState.currentPhase = 'training';
            timerState.currentInterval++;
            timerState.timeRemaining = settings.trainingTime;
            break;
    }
}

// Complete workout
function completeWorkout() {
    clearInterval(timerState.timerInterval);
    timerState.currentPhase = 'complete';
    timerState.timeRemaining = 0;
    timerState.isRunning = false;
    
    // Update button states
    document.getElementById('startBtn').disabled = true;
    document.getElementById('pauseBtn').disabled = true;
    
    // Enable settings inputs
    toggleSettingsInputs(false);
    
    updateDisplay();
    
    // Play completion sound
    playCompletionBeep();
}

// Toggle settings inputs
function toggleSettingsInputs(disabled) {
    document.getElementById('warmupTime').disabled = disabled;
    document.getElementById('trainingTime').disabled = disabled;
    document.getElementById('restTime').disabled = disabled;
    document.getElementById('intervals').disabled = disabled;
    
    // Also disable adjust buttons
    const adjustButtons = document.querySelectorAll('.btn-adjust');
    adjustButtons.forEach(btn => btn.disabled = disabled);
}

// Toggle visibility of settings panel and sync ARIA state
function toggleSettingsPanel() {
    const toggleBtn = document.getElementById('settingsToggle');
    if (!toggleBtn) {
        return;
    }
    const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    const nextExpanded = !expanded;
    toggleBtn.setAttribute('aria-expanded', String(nextExpanded));
    toggleBtn.setAttribute('aria-pressed', String(nextExpanded));
}

// Simple beep sound using Web Audio API
function playBeep() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // Silently fail if audio not supported
    }
}

// Completion beep
function playCompletionBeep() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Play three beeps
        for (let i = 0; i < 3; i++) {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 1000;
            oscillator.type = 'sine';
            
            const startTime = audioContext.currentTime + (i * 0.3);
            gainNode.gain.setValueAtTime(0.3, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + 0.2);
        }
    } catch (e) {
        // Silently fail if audio not supported
    }
}

// Initialize display on page load
document.addEventListener('DOMContentLoaded', function() {
    updateDisplay();
});
