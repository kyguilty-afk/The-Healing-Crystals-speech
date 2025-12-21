// DOM Elements
const inputEl = document.getElementById('numInput');
const cardEl = document.getElementById('card');
const titleEl = document.getElementById('cardTitle');
const keywordEl = document.getElementById('cardKeyword');
const meaningEl = document.getElementById('cardMeaning');
const numDisplayEl = document.getElementById('cardNumber');
const speakerEl = document.getElementById('speakerIcon');

// State
let isSpeaking = false;

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    inputEl.focus();
    window.speechSynthesis.getVoices();
});

// Input Event Listener
// Input Event Listener
inputEl.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    stopSpeaking();

    if (val) {
        showCard(val);
    } else {
        hideCard();
    }
});

function showCard(id) {
    const data = CARD_DATA.find(item => item.id === id);
    if (!data) {
        hideCard();
        return;
    }

    cardEl.classList.remove('visible');

    setTimeout(() => {
        titleEl.textContent = data.title;
        keywordEl.textContent = data.keyword;
        meaningEl.textContent = data.meaning;
        numDisplayEl.textContent = ''; // No number display for crystals

        cardEl.classList.add('visible');

        speak(data.title, data.keyword, data.meaning);
    }, 50);
}

function hideCard() {
    cardEl.classList.remove('visible');
}

// TTS Logic
function speak(title, keyword, meaning) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    // Construct text sequence
    // Using separate utterances for better control/pauses
    const uTitle = new SpeechSynthesisUtterance(title);
    const uKeyword = new SpeechSynthesisUtterance(keyword);
    const uMeaning = new SpeechSynthesisUtterance(meaning);

    const voices = window.speechSynthesis.getVoices();
    const jpVoice = voices.find(v => v.lang.includes('ja') && v.name.includes('Google')) ||
        voices.find(v => v.lang.includes('ja'));

    [uTitle, uKeyword, uMeaning].forEach(u => {
        if (jpVoice) u.voice = jpVoice;
        u.rate = 1.0;
    });

    // Slight adjustments
    uKeyword.pitch = 1.1; // Keyword slightly higher pitch
    uMeaning.rate = 0.95; // Meaning slightly slower

    // Animation trigger
    uTitle.onstart = () => cardEl.classList.add('speaking');
    uMeaning.onend = () => cardEl.classList.remove('speaking');

    window.speechSynthesis.speak(uTitle);

    // Insert small pauses by creating empty utterances or just relying on natural queue
    // (Browsers queue them).

    window.speechSynthesis.speak(uKeyword);
    window.speechSynthesis.speak(uMeaning);
}

function stopSpeaking() {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        cardEl.classList.remove('speaking');
    }
}

speakerEl.addEventListener('click', () => {
    const val = inputEl.value.trim();
    if (val) {
        const data = CARD_DATA.find(item => item.id === val);
        if (data) speak(data.title, data.keyword, data.meaning);
    }
});
