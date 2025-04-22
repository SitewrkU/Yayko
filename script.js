import * as data from './data.js';

const egg = document.getElementById("egg-img");
const eggSelect = document.getElementById('eggSelect');
const toggleEggSelect = document.getElementById('egg-select');
const eggSelector = document.querySelector('.egg-selector');
const petsList = document.getElementById('pets-list');
const petsListBtn = document.getElementById('egg-info');

const money_span = document.getElementById("money");
const info = document.getElementById("info");
const info_name = document.getElementById("PetName");
const info_rarity = document.getElementById("Rarity");
const info_price = document.getElementById("Price");
document.querySelector('.SellAll').addEventListener('click', SellInventory);

let EGG_PIC = 'src/pics/dragonEgg.png';
let EGG_PRICE = 20;
const CLICKS_TO_OPEN = 4;
const ANIMATION_DURATION_COMMON = 1000;
const ANIMATION_DURATION_RARE = 3000;

let selectedPet = null;
let money = 200;
let rotate = 'left';
let clicks = 0;  
let clickable = true;

let inventory = [];

let EggType = data.StandartEggPets;




data.EggTypes.forEach((egg, index) => {
    const option = document.createElement('option');
    option.value = index; 
    option.textContent = egg.name;
    eggSelect.appendChild(option);
});

eggSelect.addEventListener('change', () => {
    const eggName = document.getElementById("egg-name");
    const selectedIndex = eggSelect.value;
    const selectedEgg = data.EggTypes[selectedIndex];
    eggSelector.style.display = 'none';
    petsList.style.display = 'none';

    EggType = data[selectedEgg.constName];
    EGG_PRICE = selectedEgg.price;
    EGG_PIC = selectedEgg.src;
    egg.src = EGG_PIC;
    eggName.textContent = selectedEgg.name;
});

toggleEggSelect.addEventListener('click', () => {
    eggSelector.style.display = eggSelector.style.display === 'none' || eggSelector.style.display === '' 
        ? 'block' 
        : 'none';
});



petsListBtn.addEventListener('click', () => {
    const visible = petsList.style.display === 'block';
    petsList.style.display = visible ? 'none' : 'block';
  
    if (!visible) {
        petsList.innerHTML = EggType.map(pet =>
          `<div class="pets-list-item">${pet.name} — [${pet.chance}%]</div>`
        ).join('');
    }
});




egg.addEventListener("click", () => {
    if(clickable){
        let rotation = rotate === 'right' ? 'rotateZ(20deg)' : 'rotateZ(-20deg)';
        rotate = rotate === 'right' ? 'left' : 'right';
    
        egg.style.transform = `scale(1.1) ${rotation}`;
        egg.style.opacity = '0.6';
    
        setTimeout(() => {
            egg.style.transform = 'none';
            egg.style.opacity = '1';
        }, 150);
    
        clicks++;
    }

    if(money >= EGG_PRICE){
        if(clicks === CLICKS_TO_OPEN){
            money -= EGG_PRICE;
            money_span.textContent = money;
            clicks = 0;
            clickable = false;

            egg.style.cursor = 'default';
            egg.style.transform = `scale(1.5)`
            setTimeout(() => {
                egg.style.transform = 'none';
            }, 350);

            OpenEgg();

            setTimeout(() => {
                clickable = true;
                egg.style.cursor = 'pointer';
                info.style.display = 'none';
                info_name.textContent = null;
                info_rarity.textContent = null;
                info_price.textContent = null;
                egg.src = EGG_PIC;
            }, selectedPet.rarity === "Легендарний" || selectedPet.rarity === "Міфічний" ? ANIMATION_DURATION_RARE : ANIMATION_DURATION_COMMON);
        }
    }else{
        clicks = 0;
    }
});


function OpenEgg(){
    const random = Math.random() * 100;
    let sum = 0;
    
    for (let pet of EggType) {
        sum += pet.chance;
        if (random <= sum) {
            selectedPet = pet;
            egg.src = pet.src;

            info.style.display = 'block';
            info_name.textContent = pet.name;
            info_rarity.textContent = pet.rarity;
            info_price.textContent = `Ціна: ${pet.price}$`;

            if(pet.rarity === "Міфічний"){
                money += pet.price * 0.10;
                money_span.textContent = money;
            }

            inventory.push({ ...pet });
            updateInventory();

            console.log(inventory)
            break;
        }
    }
}

function updateInventory() {
    const inventoryElement = document.getElementById('inventory');
    const invPrice = document.getElementById('invFull-price');
    inventoryElement.innerHTML = ''; 
    

    inventory.forEach(item => {
        const PetItem = document.createElement('div');
        PetItem.classList.add('inventory-item');
        inventoryElement.appendChild(PetItem);
        item.isFavourite = item.isFavourite ?? false;

        const starSrc = item.isFavourite
            ? 'src/pics/icons/starUsed.png'
            : 'src/pics/icons/star.png';

        const SellAvaible = item.isFavourite
            ? 'void(0)'
            : 'SellPet(this)';

        PetItem.innerHTML = `   
            <img src="${starSrc}" onclick="FavouritePet(this)" class="star">
            <p class="inv-price" onclick="${SellAvaible}">${item.price}$</p>
            <img src="${item.src}" class="pixelated-background">
        `;

        if(item.rarity === "Легендарний"){
            PetItem.style.borderColor = 'yellow';
        }else if(item.rarity === "Міфічний"){
            PetItem.style.borderColor = '#4B0082';
        }
    });

    let FullPrice = 0;
    inventory.forEach(item => {
        FullPrice = item.price + FullPrice;
    }); 
    invPrice.textContent = FullPrice;
}


function SellPet(button) {
    const parent = button.closest('.inventory-item');
    const allParents = Array.from(document.querySelectorAll('.inventory-item'));
    const index = allParents.indexOf(parent);

    money += inventory[index].price;
    money_span.textContent = money;

    inventory.splice(index, 1);
    updateInventory();
}
window.SellPet = SellPet;


function FavouritePet(star) {
    const parent = star.closest('.inventory-item');
    const p = parent.querySelector(".inv-price");
    const allParents = Array.from(document.querySelectorAll('.inventory-item'));
    const index = allParents.indexOf(parent);

    if(!inventory[index].isFavourite){
        inventory[index].isFavourite = true;
    }else{
        inventory[index].isFavourite = false;
    }
    updateInventory();

}
window.FavouritePet = FavouritePet;



function SellInventory() {
    const allParents = Array.from(document.querySelectorAll('.inventory-item'));
    const sellIndices = [];

    allParents.forEach((el, i) => {
        const p = el.querySelector('p[onclick]');
        if (p && !inventory[i].isFavourite) {
            sellIndices.push(i);
        }
    });

    // Продаємо з кінця, щоб не зламати індекси при splice
    for (let i = sellIndices.length - 1; i >= 0; i--) {
        const index = sellIndices[i];
        money += inventory[index].price;
        inventory.splice(index, 1);
    }

    money_span.textContent = money;
    updateInventory();
}