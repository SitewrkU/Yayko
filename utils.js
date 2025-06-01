import { setClicksToOpen, getClicksToOpen } from './script.js';
const settingsbtn = document.getElementById('settings');

export function formatMoney(num) {
    if (num >= 1_000_000_000) {
        return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1_000) {
        return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return Math.round(num); 
}

settingsbtn.addEventListener('click', () => {
    const settingsMenu = document.getElementById('settings-menu');
    settingsMenu.style.display = settingsMenu.style.display === 'none' || settingsMenu.style.display === '' 
        ? 'flex' 
        : 'none';
});

document.getElementById('clear-data').addEventListener('click', () => {
    localStorage.clear();
    location.reload();
    alert('Ваші данні очищено!');
});

document.getElementById('fast-open').addEventListener('click', () => {
    const button = event.target;
    if(getClicksToOpen() == 4){
        setClicksToOpen(2); 
        button.textContent = "Швидке відкриття [on]";
    }else{
        setClicksToOpen(4); 
        button.textContent = "Швидке відкриття [off]";
    }
    
});