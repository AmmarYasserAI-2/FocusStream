// DOM Elements
const videoPlayer = document.getElementById('videoPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const rewind10Btn = document.getElementById('rewind10Btn');
const forward10Btn = document.getElementById('forward10Btn');
const volumeBtn = document.getElementById('volumeBtn');
const volumeSlider = document.getElementById('volumeSlider');
const timeDisplay = document.getElementById('time');
const progressContainer = document.getElementById('progressContainer');
const progress = document.getElementById('progress');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const pipBtn = document.getElementById('pipBtn');
const loopBtn = document.getElementById('loopBtn');
const playbackSpeed = document.getElementById('playbackSpeed');
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const uploadSection = document.getElementById('uploadSection');
const playerSection = document.getElementById('playerSection');
const uploadProgress = document.getElementById('uploadProgress');
const progressBar = document.getElementById('progressBar');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const videoTitleText = document.getElementById('videoTitleText');
const checkBtn = document.getElementById('checkBtn');
const confettiCanvas = document.getElementById('confettiCanvas');

// Theme Toggle
let isDarkMode = localStorage.getItem('darkMode') === 'true';
updateTheme();

themeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    localStorage.setItem('darkMode', isDarkMode);
    updateTheme();
});

function updateTheme() {
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
        themeIcon.className = 'fas fa-moon text-blue-300';
    } else {
        document.documentElement.classList.remove('dark');
        themeIcon.className = 'fas fa-sun text-yellow-400';
    }
}

// File Upload Handling
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('border-primary');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('border-primary');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('border-primary');
    handleFile(e.dataTransfer.files[0]);
});

dropZone.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    handleFile(e.target.files[0]);
});

function handleFile(file) {
    if (!file || !file.type.startsWith('video/')) {
        alert('Please upload a valid video file.');
        return;
    }

    if (file.size > 20 * 1024 * 1024 * 1024) { // 20GB
        alert('File size exceeds 20GB limit.');
        return;
    }

    const url = URL.createObjectURL(file);
    videoPlayer.src = url;
    
    // Set video title (file name without extension)
    const fileName = file.name.replace(/\.[^/.]+$/, "");
    videoTitleText.textContent = fileName;
    
    // Detect if the filename contains Arabic characters
    const hasArabic = /[\u0600-\u06FF]/.test(fileName);
    videoTitleText.style.direction = hasArabic ? 'rtl' : 'ltr';
    
    uploadSection.classList.add('hidden');
    playerSection.classList.remove('hidden');
    
    // Reset check button state
    checkBtn.disabled = false;
    checkBtn.classList.remove('opacity-50', 'cursor-not-allowed', 'bg-gray-500');
    checkBtn.classList.add('bg-green-500', 'hover:bg-green-600');
}

// Video Player Controls
playPauseBtn.addEventListener('click', togglePlay);
videoPlayer.addEventListener('play', updatePlayButton);
videoPlayer.addEventListener('pause', updatePlayButton);

function togglePlay() {
    if (videoPlayer.paused) {
        videoPlayer.play();
    } else {
        videoPlayer.pause();
    }
}

function updatePlayButton() {
    const icon = playPauseBtn.querySelector('i');
    icon.className = videoPlayer.paused ? 'fas fa-play' : 'fas fa-pause';
}

// Time Control
rewind10Btn.addEventListener('click', () => {
    videoPlayer.currentTime = Math.max(videoPlayer.currentTime - 10, 0);
});

forward10Btn.addEventListener('click', () => {
    videoPlayer.currentTime = Math.min(videoPlayer.currentTime + 10, videoPlayer.duration);
});

// Volume Control
volumeBtn.addEventListener('click', toggleMute);
volumeSlider.addEventListener('input', handleVolumeChange);

function toggleMute() {
    videoPlayer.muted = !videoPlayer.muted;
    updateVolumeIcon();
}

function handleVolumeChange() {
    videoPlayer.volume = volumeSlider.value / 100;
    videoPlayer.muted = volumeSlider.value === '0';
    updateVolumeIcon();
}

function updateVolumeIcon() {
    const icon = volumeBtn.querySelector('i');
    if (videoPlayer.muted || videoPlayer.volume === 0) {
        icon.className = 'fas fa-volume-mute';
    } else if (videoPlayer.volume < 0.5) {
        icon.className = 'fas fa-volume-down';
    } else {
        icon.className = 'fas fa-volume-up';
    }
}

// Progress Bar
videoPlayer.addEventListener('timeupdate', updateProgress);
progressContainer.addEventListener('click', seek);

function updateProgress() {
    const percent = (videoPlayer.currentTime / videoPlayer.duration) * 100;
    progress.style.width = percent + '%';
    
    const currentTime = formatTime(videoPlayer.currentTime);
    const duration = formatTime(videoPlayer.duration);
    timeDisplay.textContent = `${currentTime} / ${duration}`;
}

function seek(e) {
    const pos = (e.offsetX / progressContainer.offsetWidth);
    videoPlayer.currentTime = pos * videoPlayer.duration;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Playback Speed
playbackSpeed.addEventListener('change', () => {
    videoPlayer.playbackRate = parseFloat(playbackSpeed.value);
});

// Picture in Picture
pipBtn.addEventListener('click', async () => {
    try {
        if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
        } else {
            await videoPlayer.requestPictureInPicture();
        }
    } catch (error) {
        console.error('PiP failed:', error);
    }
});

// Loop
loopBtn.addEventListener('click', () => {
    videoPlayer.loop = !videoPlayer.loop;
    loopBtn.classList.toggle('text-primary');
});

// Fullscreen
fullscreenBtn.addEventListener('click', toggleFullscreen);

async function toggleFullscreen() {
    try {
        if (document.fullscreenElement) {
            await document.exitFullscreen();
        } else {
            await videoPlayer.requestFullscreen();
        }
    } catch (error) {
        console.error('Fullscreen failed:', error);
    }
}

// Keyboard Controls
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return; // Don't interfere with input fields
    
    switch(e.key.toLowerCase()) {
        case ' ':
        case 'k':
            e.preventDefault();
            togglePlay();
            break;
        case 'f':
            toggleFullscreen();
            break;
        case 'm':
            toggleMute();
            break;
        case 'arrowleft':
            videoPlayer.currentTime -= 10;
            break;
        case 'arrowright':
            videoPlayer.currentTime += 10;
            break;
        case 'arrowup':
            e.preventDefault();
            videoPlayer.volume = Math.min(videoPlayer.volume + 0.1, 1);
            volumeSlider.value = videoPlayer.volume * 100;
            updateVolumeIcon();
            break;
        case 'arrowdown':
            e.preventDefault();
            videoPlayer.volume = Math.max(videoPlayer.volume - 0.1, 0);
            volumeSlider.value = videoPlayer.volume * 100;
            updateVolumeIcon();
            break;
    }
});

// Confetti Animation
function createConfetti() {
    const canvas = confettiCanvas;
    const ctx = canvas.getContext('2d');
    let particles = [];
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.classList.remove('hidden');
    
    class Particle {
        constructor() {
            this.x = canvas.width * Math.random();
            this.y = -10;
            this.size = Math.random() * 8 + 4;
            this.speedY = Math.random() * 3 + 2;
            this.speedX = Math.random() * 6 - 3;
            this.color = `hsl(${Math.random() * 360}, 50%, 50%)`;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 10 - 5;
        }
        
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
            ctx.restore();
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (particles.length < 100 && Math.random() < 0.3) {
            particles.push(new Particle());
        }
        
        particles = particles.filter(p => p.y < canvas.height + 10);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        if (particles.length > 0) {
            requestAnimationFrame(animate);
        } else {
            canvas.classList.add('hidden');
        }
    }
    
    animate();
}

// Check Button Handler
checkBtn.addEventListener('click', function() {
    if (!this.disabled) {
        this.disabled = true;
        this.classList.remove('bg-green-500', 'hover:bg-green-600');
        this.classList.add('bg-gray-500', 'opacity-50', 'cursor-not-allowed');
        
        // Show confetti
        createConfetti();
    }
});

// Pomodoro Timer
const pomodoroTime = document.getElementById('pomodoroTime');
const pomodoroSession = document.getElementById('pomodoroSession');
const pomodoroStart = document.getElementById('pomodoroStart');
const pomodoroPause = document.getElementById('pomodoroPause');
const pomodoroReset = document.getElementById('pomodoroReset');
const pomodoroProgress = document.getElementById('pomodoroProgress');
const focusButton = document.getElementById('focusButton');
const shortBreakButton = document.getElementById('shortBreakButton');
const longBreakButton = document.getElementById('longBreakButton');
const workDuration = document.getElementById('workDuration');
const shortBreakDuration = document.getElementById('shortBreakDuration');
const longBreakDuration = document.getElementById('longBreakDuration');
const pomsTillLong = document.getElementById('pomsTillLong');
const autoStartNext = document.getElementById('autoStartNext');
const pomsToday = document.getElementById('pomsToday');
const focusTime = document.getElementById('focusTime');
const exportPomodoroLog = document.getElementById('exportPomodoroLog');

let timer;
let isRunning = false;
let currentTime;
let currentSession = 'work';
let completedPomodoros = 0;
let totalFocusMinutes = 0;
let pomodoroLog = [];

// Load saved settings and stats
const savedStats = JSON.parse(localStorage.getItem('pomodoroStats') || '{"completed": 0, "focusMinutes": 0}');
completedPomodoros = savedStats.completed;
totalFocusMinutes = savedStats.focusMinutes;
updateStats();

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timer = setInterval(updateTimer, 1000);
        pomodoroStart.classList.add('hidden');
        pomodoroPause.classList.remove('hidden');
    }
}

function pauseTimer() {
    if (isRunning) {
        isRunning = false;
        clearInterval(timer);
        pomodoroStart.classList.remove('hidden');
        pomodoroPause.classList.add('hidden');
    }
}

function resetTimer() {
    pauseTimer();
    setInitialTime();
    updateDisplay();
}

function setInitialTime() {
    if (currentSession === 'work') {
        currentTime = workDuration.value * 60;
    } else if (currentSession === 'short') {
        currentTime = shortBreakDuration.value * 60;
    } else {
        currentTime = longBreakDuration.value * 60;
    }
    updateTimerModeButtons();
}

function updateTimer() {
    if (currentTime > 0) {
        currentTime--;
        updateDisplay();
    } else {
        handleSessionComplete();
    }
}

function updateDisplay() {
    const minutes = Math.floor(currentTime / 60);
    const seconds = currentTime % 60;
    pomodoroTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Update progress circle
    const initialTime = currentSession === 'work' ? workDuration.value * 60 :
                       currentSession === 'short' ? shortBreakDuration.value * 60 :
                       longBreakDuration.value * 60;
    const progress = ((initialTime - currentTime) / initialTime) * 339.292; // Circle circumference
    pomodoroProgress.style.strokeDashoffset = 339.292 - progress;
    
    // Update session display
    pomodoroSession.textContent = currentSession === 'work' ? 'Work' :
                                 currentSession === 'short' ? 'Short Break' : 'Long Break';
}

function handleSessionComplete() {
    if (currentSession === 'work') {
        completedPomodoros++;
        totalFocusMinutes += parseInt(workDuration.value);
        updateStats();
        
        // Log the completed pomodoro
        pomodoroLog.push({
            timestamp: new Date().toISOString(),
            type: 'work',
            duration: workDuration.value
        });
        
        if (completedPomodoros % parseInt(pomsTillLong.value) === 0) {
            currentSession = 'long';
        } else {
            currentSession = 'short';
        }
    } else {
        currentSession = 'work';
    }
    
    setInitialTime();
    updateDisplay();
    
    if (autoStartNext.checked) {
        startTimer();
    } else {
        pauseTimer();
    }
    
    // Save stats
    localStorage.setItem('pomodoroStats', JSON.stringify({
        completed: completedPomodoros,
        focusMinutes: totalFocusMinutes
    }));
}

function updateStats() {
    pomsToday.textContent = completedPomodoros;
    focusTime.textContent = totalFocusMinutes;
}

// Update timer mode buttons
function updateTimerModeButtons() {
    const modes = [
        { button: focusButton, mode: 'work' },
        { button: shortBreakButton, mode: 'short' },
        { button: longBreakButton, mode: 'long' }
    ];

    modes.forEach(({ button, mode }) => {
        if (currentSession === mode) {
            button.classList.add('bg-primary', 'text-white');
            button.classList.remove('text-gray-600', 'dark:text-gray-400', 'bg-gray-100', 'dark:bg-gray-700');
        } else {
            button.classList.remove('bg-primary', 'text-white');
            button.classList.add('text-gray-600', 'dark:text-gray-400', 'bg-gray-100', 'dark:bg-gray-700');
        }
    });
}

// Handle timer mode changes
function changeTimerMode(mode) {
    if (isRunning) {
        const confirmed = confirm('Timer is running. Do you want to switch modes?');
        if (!confirmed) return;
        pauseTimer();
    }
    
    currentSession = mode;
    setInitialTime();
    updateDisplay();
    updateTimerModeButtons();
}

// Add event listeners for mode buttons
focusButton.addEventListener('click', () => changeTimerMode('work'));
shortBreakButton.addEventListener('click', () => changeTimerMode('short'));
longBreakButton.addEventListener('click', () => changeTimerMode('long'));

// Export pomodoro log
exportPomodoroLog.addEventListener('click', () => {
    const csv = [
        ['Timestamp', 'Session Type', 'Duration (minutes)'],
        ...pomodoroLog.map(log => [log.timestamp, log.type, log.duration])
    ].map(row => row.join(',')).join('\\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pomodoro-log.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// Initialize timer display
setInitialTime();
updateDisplay();

// Todo List
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoPoms = document.getElementById('todoPoms');
const todoList = document.getElementById('todoList');
const exportTasks = document.getElementById('exportTasks');

let todos = JSON.parse(localStorage.getItem('todos') || '[]');

function addTodo(text, poms) {
    const todo = {
        id: Date.now(),
        text,
        poms,
        completed: false
    };
    
    todos.push(todo);
    saveTodos();
    renderTodos();
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

function toggleTodo(id) {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos();
    renderTodos();
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
    todoList.innerHTML = '';
    
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'flex items-center gap-2 p-2 rounded bg-gray-50 dark:bg-gray-700';
        
        li.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                   class="form-checkbox rounded text-primary">
            <span class="${todo.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-200'} flex-1">
                ${todo.text}
                ${todo.poms ? `<span class="ml-2 text-xs text-gray-500">(${todo.poms} poms)</span>` : ''}
            </span>
            <button class="text-red-500 hover:text-red-600">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        li.querySelector('input[type="checkbox"]').addEventListener('change', () => toggleTodo(todo.id));
        li.querySelector('button').addEventListener('click', () => deleteTodo(todo.id));
        
        todoList.appendChild(li);
    });
}

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = todoInput.value.trim();
    const poms = todoPoms.value ? parseInt(todoPoms.value) : null;
    
    if (text) {
        addTodo(text, poms);
        todoInput.value = '';
        todoPoms.value = '';
    }
});

exportTasks.addEventListener('click', () => {
    const csv = [
        ['Task', 'Pomodoros', 'Completed'],
        ...todos.map(todo => [todo.text, todo.poms || '', todo.completed ? 'Yes' : 'No'])
    ].map(row => row.join(',')).join('\\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// Initialize back button
const backButton = document.getElementById('backButton');

backButton.addEventListener('click', () => {
    // Stop video playback
    videoPlayer.pause();
    videoPlayer.src = '';
    
    // Reset UI elements
    videoTitleText.textContent = 'Untitled Video';
    progress.style.width = '0%';
    timeDisplay.textContent = '0:00 / 0:00';
    playPauseBtn.querySelector('i').className = 'fas fa-play';
    
    // Show upload section, hide player section
    uploadSection.classList.remove('hidden');
    playerSection.classList.add('hidden');
    
    // Clear file input
    fileInput.value = '';
});

// Initial render
renderTodos();
