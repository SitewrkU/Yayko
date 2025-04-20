import * as data from './data.js';
const egg = document.getElementById("egg-img");
const money_span = document.getElementById("money");
const info = document.getElementById("info");
const info_name = document.getElementById("PetName");
const info_rarity = document.getElementById("Rarity");
const info_price = document.getElementById("Price");

const EGG_PRICE = 20;
const CLICKS_TO_OPEN = 5;
const ANIMATION_DURATION_COMMON = 1000;
const ANIMATION_DURATION_RARE = 3000;

let selectedPet = null;
let money = 200;
let rotate = 'left';
let clicks = 0;  
let clickable = true;

let inventory = [];

let EggType = data.StandartEggPets;

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
                egg.src = 'src/pics/dragonEgg.png'
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
            info_price.textContent = `Ціна: ${pet.price}`;

            inventory.push(pet);
            updateInventory();

            console.log(`Тобі випав: ${pet.name} [${pet.chance}%]`)
            console.log(inventory)
            break;
        }
    }
}

function updateInventory() {
    const inventoryElement = document.getElementById('inventory');
    inventoryElement.innerHTML = ''; 

    inventory.forEach(item => {
        const PetItem = document.createElement('div');
        PetItem.classList.add('inventory-item');
        inventoryElement.appendChild(PetItem);
        // PetItem.style.backgroundImage = `url(${item.src})`;
        PetItem.innerHTML = `   
            <p class="inv-price" onclick="SellPet(this)">${item.price}$</p>
            <img src="${item.src}" class="pixelated-background">
        `;

        if(item.rarity === "Легендарний"){
            PetItem.style.borderColor = 'yellow';
        }else if(item.rarity === "Міфічний"){
            PetItem.style.borderColor = '#4B0082';
        }
    });
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