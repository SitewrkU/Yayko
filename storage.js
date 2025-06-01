export function saveGame(money, inventory) {
    const data = {
        money,
        inventory
    };
    localStorage.setItem('gameData', JSON.stringify(data));
}

export function loadGame() {
    const saved = localStorage.getItem('gameData');
    if (!saved) return null;
    try {
        return JSON.parse(saved);
    } catch (e) {
        console.error("Помилка парсингу localStorage:", e);
        return null;
    }
}