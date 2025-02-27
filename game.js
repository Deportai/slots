// Initialize Telegram Web App
window.Telegram.WebApp.ready();
window.Telegram.WebApp.expand();

// Game variables
const symbols = ['🌍', '⭐', '🚀', '🪐', '🌙'];
let credits = 100;
let isSpinning = false;
const spinCost = 5;

const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const reel3 = document.getElementById('reel3');
const creditCount = document.getElementById('credit-count');
const result = document.getElementById('result');
const spinButton = document.getElementById('spin-button');

// Random symbol generator
function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

// Check win condition
function checkWin(symbol1, symbol2, symbol3) {
    if (symbol1 === symbol2 && symbol2 === symbol3) {
        return 50; // Jackpot
    }
    return 0; // No win
}

// Spin animation and logic
function spin() {
    if (isSpinning || credits < spinCost) {
        if (credits < spinCost) {
            result.textContent = 'Not enough credits!';
            window.Telegram.WebApp.showAlert('Insufficient credits!');
        }
        return;
    }

    isSpinning = true;
    spinButton.disabled = true;
    credits -= spinCost;
    creditCount.textContent = credits;
    result.textContent = '';

    // Add spinning class for visual effect
    [reel1, reel2, reel3].forEach(reel => reel.classList.add('spinning'));

    let spins = 12; // Slightly longer animation
    const interval = setInterval(() => {
        reel1.textContent = getRandomSymbol();
        reel2.textContent = getRandomSymbol();
        reel3.textContent = getRandomSymbol();
        spins--;

        if (spins <= 0) {
            clearInterval(interval);
            const final1 = getRandomSymbol();
            const final2 = getRandomSymbol();
            const final3 = getRandomSymbol();
            reel1.textContent = final1;
            reel2.textContent = final2;
            reel3.textContent = final3;

            // Remove spinning effect
            [reel1, reel2, reel3].forEach(reel => reel.classList.remove('spinning'));

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
    }, 80); // Faster animation for a snappy feel
}

// Telegram back button
window.Telegram.WebApp.BackButton.onClick(() => {
    window.Telegram.WebApp.close();
});
window.Telegram.WebApp.BackButton.show();
