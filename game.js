// Initialize Telegram Web App
window.Telegram.WebApp.ready();
window.Telegram.WebApp.expand();

// Game variables
const symbols = ['🌍', '⭐', '🚀', '🪐', '🌙'];
let credits = 100;
let betAmount = 5;
let isSpinning = false;

const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const reel3 = document.getElementById('reel3');
const creditCount = document.getElementById('credit-count');
const betAmountDisplay = document.getElementById('bet-amount');
const result = document.getElementById('result');
const spinButton = document.getElementById('spin-button');

// Random symbol generator
function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

// Update bet amount
function changeBet(change) {
    if (isSpinning) return;
    betAmount = Math.max(5, Math.min(50, betAmount + change)); // Min 5, Max 50
    betAmountDisplay.textContent = `Bet: ${betAmount} Credits`;
    spinButton.textContent = `Spin (${betAmount} Credits)`;
}

// Check win condition (payout based on bet)
function checkWin(symbol1, symbol2, symbol3) {
    if (symbol1 === symbol2 && symbol2 === symbol3) {
        return betAmount * 10; // 10x bet for jackpot
    }
    return 0;
}

// Realistic spin animation
function spinReel(reel, duration, callback) {
    let spins = 20; // Number of symbols to cycle through
    let speed = 50; // Initial speed (ms)
    const acceleration = 1.2; // Deceleration factor

    function update() {
        reel.textContent = getRandomSymbol();
        spins--;
        speed *= acceleration; // Slow down over time

        if (spins > 0) {
            setTimeout(update, speed);
        } else {
            callback();
        }
    }
    update();
}

// Spin logic
function spin() {
    if (isSpinning || credits < betAmount) {
        if (credits < betAmount) {
            result.textContent = 'Not enough credits!';
            window.Telegram.WebApp.showAlert('Insufficient credits!');
        }
        return;
    }

    isSpinning = true;
    spinButton.disabled = true;
    credits -= betAmount;
    creditCount.textContent = credits;
    result.textContent = '';

    let completedReels = 0;
    const onReelComplete = () => {
        completedReels++;
        if (completedReels === 3) {
            const final1 = reel1.textContent;
            const final2 = reel2.textContent;
            const final3 = reel3.textContent;

            const winnings = checkWin(final1, final2, final3);
            if (winnings > 0) {
                credits += winnings;
                creditCount.textContent = credits;
                result.textContent = `Jackpot! +${winnings} Credits!`;
                window.Telegram.WebApp.showPopup({
                    title: 'Big Win!',
                    message: `You won ${winnings} credits!`,
                    buttons: [{ type: 'ok' }]
                });
            } else {
                result.textContent = 'Spin Again!';
            }

            isSpinning = false;
            spinButton.disabled = false;
        }
    };

    spinReel(reel1, 2000, onReelComplete); // Reel 1 stops first
    setTimeout(() => spinReel(reel2, 2500, onReelComplete), 300); // Reel 2 slightly delayed
    setTimeout(() => spinReel(reel3, 3000, onReelComplete), 600); // Reel 3 last
}

// Initial setup
betAmountDisplay.textContent = `Bet: ${betAmount} Credits`;
spinButton.textContent = `Spin (${betAmount} Credits)`;

// Telegram back button
window.Telegram.WebApp.BackButton.onClick(() => {
    window.Telegram.WebApp.close());
window.Telegram.WebApp.BackButton.show();
