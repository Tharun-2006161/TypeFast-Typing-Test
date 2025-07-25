const texts = [
    "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet and is commonly used for typing practice.",
    "Technology has transformed the way we communicate, work, and live. From smartphones to artificial intelligence, innovation continues to shape our future.",
    "Reading books expands our knowledge and imagination. Whether fiction or non-fiction, every book has the potential to teach us something new.",
    "Cooking is both an art and a science. The perfect combination of ingredients, timing, and technique creates memorable meals that bring people together.",
    "Exercise is essential for maintaining good health. Regular physical activity strengthens our bodies, improves mood, and increases energy levels.",
    "Music has the power to evoke emotions and create lasting memories. Different genres and rhythms can transport us to different times and places.",
    "Travel broadens our perspective and understanding of different cultures. Each journey offers unique experiences and opportunities for personal growth.",
    "Learning a new language opens doors to new opportunities and helps us connect with people from different backgrounds and cultures around the world."
];

let currentText = '';
let currentIndex = 0;
let startTime = null;
let timerInterval = null;
let testDuration = 60;
let timeLeft = 60;
let isTestActive = false;
let errors = 0;
let totalTyped = 0;

const textDisplay = document.getElementById('textDisplay');
const typingInput = document.getElementById('typingInput');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const timerDisplay = document.getElementById('timer');
const errorsDisplay = document.getElementById('errors');
const progressBar = document.getElementById('progress');
const resultModal = document.getElementById('resultModal');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');

function initializeText() {
    currentText = texts[Math.floor(Math.random() * texts.length)];
    currentIndex = 0;
    displayText();
}

function displayText() {
    textDisplay.innerHTML = currentText.split('').map((char, index) => {
        let className = '';
        if (index < currentIndex) {
            className = typingInput.value[index] === char ? 'correct' : 'incorrect';
        } else if (index === currentIndex) {
            className = 'current';
        }
        return `<span class="char ${className}">${char}</span>`;
    }).join('');
}

function startTest() {
    if (isTestActive) return;
    
    initializeText();
    isTestActive = true;
    startTime = Date.now();
    timeLeft = testDuration;
    errors = 0;
    totalTyped = 0;
    currentIndex = 0;
    
    typingInput.disabled = false;
    typingInput.value = '';
    typingInput.focus();
    startBtn.textContent = 'Testing...';
    startBtn.disabled = true;
    
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    
    const progress = ((testDuration - timeLeft) / testDuration) * 100;
    progressBar.style.width = progress + '%';
    
    if (timeLeft <= 0) {
        endTest();
    }
}

function endTest() {
    isTestActive = false;
    clearInterval(timerInterval);
    typingInput.disabled = true;
    startBtn.textContent = 'Start Test';
    startBtn.disabled = false;
    
    showResults();
}

function showResults() {
    const timeElapsed = (testDuration - timeLeft) / 60;
    const wordsTyped = totalTyped / 5;
    const wpm = Math.round(wordsTyped / timeElapsed) || 0;
    const accuracy = totalTyped > 0 ? Math.round(((totalTyped - errors) / totalTyped) * 100) : 100;
    
    document.getElementById('finalWPM').textContent = wpm;
    document.getElementById('finalAccuracy').textContent = accuracy;
    
    resultModal.classList.add('show');
    resultModal.style.display = 'flex';
}

function closeModal() {
    resultModal.classList.remove('show');
    resultModal.style.display = 'none';
    resetTest();
}

function resetTest() {
    isTestActive = false;
    clearInterval(timerInterval);
    
    currentIndex = 0;
    errors = 0;
    totalTyped = 0;
    timeLeft = testDuration;
    
    typingInput.disabled = true;
    typingInput.value = '';
    startBtn.textContent = 'Start Test';
    startBtn.disabled = false;
    
    wpmDisplay.textContent = '0';
    accuracyDisplay.textContent = '100';
    timerDisplay.textContent = testDuration;
    errorsDisplay.textContent = '0';
    progressBar.style.width = '0%';
    
    initializeText();
}

function updateStats() {
    if (!isTestActive) return;
    
    const timeElapsed = (Date.now() - startTime) / 1000 / 60;
    const wordsTyped = totalTyped / 5;
    const wpm = Math.round(wordsTyped / timeElapsed) || 0;
    const accuracy = totalTyped > 0 ? Math.round(((totalTyped - errors) / totalTyped) * 100) : 100;
    
    wpmDisplay.textContent = wpm;
    accuracyDisplay.textContent = accuracy;
    errorsDisplay.textContent = errors;
}

function createParticles() {
    const particlesContainer = document.getElementById('particles');
    
    setInterval(() => {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 2 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        particle.style.width = (Math.random() * 5 + 3) + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = `rgba(${Math.floor(Math.random() * 55 + 200)}, ${Math.floor(Math.random() * 55 + 200)}, ${Math.floor(Math.random() * 55 + 200)}, 0.5)`;
        
        particlesContainer.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 8000);
    }, 300);
}

startBtn.addEventListener('click', startTest);
resetBtn.addEventListener('click', resetTest);

typingInput.addEventListener('input', (e) => {
    if (!isTestActive) return;
    
    const typedText = e.target.value;
    const currentChar = currentText[currentIndex];
    
    if (typedText.length > currentIndex) {
        totalTyped++;
        if (typedText[currentIndex] !== currentChar) {
            errors++;
        }
        currentIndex++;
        
        if (currentIndex >= currentText.length) {
            endTest();
            return;
        }
    } else if (typedText.length < currentIndex) {
        currentIndex = typedText.length;
    }
    
    displayText();
    updateStats();
});

difficultyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (isTestActive) return;
        
        difficultyBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        testDuration = parseInt(btn.getAttribute('data-time'));
        timeLeft = testDuration;
        timerDisplay.textContent = testDuration;
    });
});

initializeText();
createParticles();