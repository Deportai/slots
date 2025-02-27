// Initialize Telegram Web App
window.Telegram.WebApp.ready();
window.Telegram.WebApp.expand(); // Expand to full screen

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

// Check for win condition (simple: all three match)
function checkWin(symbol1, symbol2, symbol3) {
    if (symbol1 === symbol2 && symbol2 === symbol3) {
        return 50; // Win payout (e.g., 50 credits)
    }
    return 0; // No win
}

// Spin animation and logic
function spin() {
    if (isSpinning || credits < spinCost) {
        if (credits < spinCost) {
            result.textContent = 'Not enough credits!';
            window.Telegram.WebApp.showAlert('Not enough credits to spin!');
        }
        return;
    }

    isSpinning = true;
    spinButton.disabled = true;
    credits -= spinCost;
    creditCount.textContent = credits;
    result.textContent = '';

    let spins = 10; // Number of "frames" for animation
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

            const winnings = checkWin(final1, final2, final3);
            if (winnings > 0) {
                credits += winnings;
                creditCount.textContent = credits;
                result.textContent = `You won ${winnings} credits!`;
                window.Telegram.WebApp.showPopup({
                    title: 'Jackpot!',
                    message: `You won ${winnings} credits!`,
                    buttons: [{ type: 'ok' }]
                });
            } else {
                result.textContent = 'Try again!';
            }

            isSpinning = false;
            spinButton.disabled = false;
        }
    }, 100); // Animation speed
}

// Optional: Add a Telegram back button handler
window.Telegram.WebApp.BackButton.onClick(() => {
    window.Telegram.WebApp.close();
});
window.Telegram.WebApp.BackButton.show();