document.getElementById('generate-btn').addEventListener('click', generatePassword);
document.getElementById('copy-btn').addEventListener('click', copyPassword);
document.getElementById('check-btn').addEventListener('click', checkUserPasswordStrength);

function generatePassword() {
    const length = document.getElementById('length').value;
    const includeUppercase = document.getElementById('uppercase').checked;
    const includeLowercase = document.getElementById('lowercase').checked;
    const includeNumbers = document.getElementById('numbers').checked;
    const includeSymbols = document.getElementById('symbols').checked;
    const excludeSimilar = document.getElementById('exclude-similar').checked;
    const pronounceable = document.getElementById('pronounceable').checked;

    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    if (excludeSimilar) {
        charset = charset.replace(/[O0Il1]/g, '');
    }

    let password = '';
    if (pronounceable) {
        password = generatePronounceablePassword(length);
    } else {
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
    }

    document.getElementById('password').value = password;
    updateStrengthMeter(password);
    calculateCrackTime(password);
}

function generatePronounceablePassword(length) {
    const consonants = 'bcdfghjklmnpqrstvwxyz';
    const vowels = 'aeiou';

    let password = '';
    let isConsonant = true;

    for (let i = 0; i < length; i++) {
        if (isConsonant) {
            password += consonants.charAt(Math.floor(Math.random() * consonants.length));
        } else {
            password += vowels.charAt(Math.floor(Math.random() * vowels.length));
        }
        isConsonant = !isConsonant;
    }

    return password;
}

function copyPassword() {
    const password = document.getElementById('password').value;
    if (password === '') {
        alert('Please generate a password first!');
        return;
    }
    navigator.clipboard.writeText(password).then(() => {
        alert('Password copied to clipboard!');
    });
}

function checkUserPasswordStrength() {
    const userPassword = document.getElementById('user-password').value;
    if (userPassword === '') {
        alert('Please enter a password to check its strength!');
        return;
    }
    updateStrengthMeter(userPassword);
    calculateCrackTime(userPassword);
}

function updateStrengthMeter(password) {
    const strengthBar = document.getElementById('strength-bar');
    const strengthLabel = document.getElementById('strength-label');

    let strength = 0;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[\W_]/.test(password)) strength++;

    // Reset bar color and width
    strengthBar.style.width = '0';
    strengthBar.style.backgroundColor = '#ccc';
    strengthLabel.textContent = 'Strength: Weak'; // Default to Weak

    if (strength === 4 && password.length >= 12) {
        strengthBar.style.backgroundColor = '#28a745'; // Green for Strong
        strengthLabel.textContent = 'Strength: Strong';
        strengthBar.style.width = '100%';
    } else if (strength >= 3 && password.length >= 8) {
        strengthBar.style.backgroundColor = '#ffc107'; // Yellow for Medium
        strengthLabel.textContent = 'Strength: Medium';
        strengthBar.style.width = '66%';
    } else {
        strengthBar.style.backgroundColor = '#dc3545'; // Red for Weak
        strengthLabel.textContent = 'Strength: Weak';
        strengthBar.style.width = '33%';
    }
}


function calculateCrackTime(password) {
    const charsetSize = calculateCharsetSize(password);
    const combinations = Math.pow(charsetSize, password.length);
    const guessesPerSecond = 1e9; // Assume 1 billion guesses per second
    const secondsToCrack = combinations / guessesPerSecond;

    let timeToCrack = formatTime(secondsToCrack);
    document.getElementById('crack-time').textContent = timeToCrack;
}

function calculateCharsetSize(password) {
    let charsetSize = 0;
    if (/[a-z]/.test(password)) charsetSize += 26;
    if (/[A-Z]/.test(password)) charsetSize += 26;
    if (/[0-9]/.test(password)) charsetSize += 10;
    if (/[\W_]/.test(password)) charsetSize += 32; // Assuming 32 special characters

    return charsetSize;
}

function formatTime(seconds) {
    const years = Math.floor(seconds / (60 * 60 * 24 * 365));
    seconds %= 60 * 60 * 24 * 365;
    const days = Math.floor(seconds / (60 * 60 * 24));
    seconds %= 60 * 60 * 24;
    const hours = Math.floor(seconds / (60 * 60));
    seconds %= 60 * 60;
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);

    if (years > 0) return `${years} years, ${days} days`;
    if (days > 0) return `${days} days, ${hours} hours`;
    if (hours > 0) return `${hours} hours, ${minutes} minutes`;
    if (minutes > 0) return `${minutes} minutes, ${seconds} seconds`;
    return `${seconds} seconds`;
}

// Function to show popup with a custom message
function showPopup(message) {
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');
    const closeBtn = document.querySelector('.close-btn');

    popupMessage.textContent = message;
    popup.classList.remove('hidden');
    setTimeout(() => {
        popup.style.opacity = '1';
        popup.style.pointerEvents = 'auto';
    }, 0);

    // Close popup on clicking the close button
    closeBtn.onclick = () => closePopup(popup);
    
    // Auto-close popup after 3 seconds
    setTimeout(() => closePopup(popup), 3000);
}

// Function to close popup
function closePopup(popup) {
    popup.style.opacity = '0';
    popup.style.pointerEvents = 'none';
    setTimeout(() => popup.classList.add('hidden'), 300);
}

// Prevent copying empty password
function copyPassword() {
    const password = document.getElementById('password').value;
    if (password === '') {
        showPopup('Please generate a password first!');
        return;
    }
    navigator.clipboard.writeText(password).then(() => {
        showPopup('Password copied to clipboard!');
    });
}

// Prevent checking empty password strength
function checkUserPasswordStrength() {
    const userPassword = document.getElementById('user-password').value;
    if (userPassword === '') {
        showPopup('Please enter a password to check its strength!');
        return;
    }
    updateStrengthMeter(userPassword);
    calculateCrackTime(userPassword);
}
