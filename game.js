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
    const newBet = betAmount + change;
    if (newBet >= 5 && newBet <= 50) { // Ensure bet stays between 5 and 50
        betAmount = newBet;
        betAmountDisplay.textContent = `Bet: ${betAmount} Credits`;
        spinButton.textContent = `Spin (${betAmount} Credits)`;
    }
}

// Check win condition
function checkWin(symbol1, symbol2, symbol3) {
    if (symbol1 === symbol2 && symbol2 === symbol3) {
        return betAmount * 10; // 10x bet payout
    }
    return 0;
}

// Realistic spin animation for a single reel
function spinReel(reel, duration, callback) {
    const startTime = performance.now();
    const initialSpeed = 50; // Fast initial speed (ms)
    const deceleration = 0.05; // Controls slowdown rate

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1); // 0 to 1
        const easedProgress = 1 - Math.pow(1 - progress, 4); // Ease-out quartic
        const speed = initialSpeed + (duration - initialSpeed) * easedProgress;

        reel.textContent = getRandomSymbol();

        if (progress < 1) {
            setTimeout(() => requestAnimationFrame(animate), speed / (1 + deceleration * elapsed));
        } else {
            reel.textContent = getRandomSymbol(); // Final symbol
            callback();
        }
    }

    requestAnimationFrame(animate);
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

    // Sequential reel spins with realistic timing
    spinReel(reel1, 1500, onReelComplete); // First reel: 1.5s
    setTimeout(() => spinReel(reel2, 1800, onReelComplete), 300); // Second reel: 1.8s, delayed
    setTimeout(() => spinReel(reel3, 2100, onReelComplete), 600); // Third reel: 2.1s, delayed
}

// Initial setup
betAmountDisplay.textContent = `Bet: ${betAmount} Credits`;
spinButton.textContent = `Spin (${betAmount} Credits)`;

// Telegram back button
window.Telegram.WebApp.BackButton.onClick(() => {
    window.Telegram.WebApp.close();
});
window.Telegram.WebApp.BackButton.show();
