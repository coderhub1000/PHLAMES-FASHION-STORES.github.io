let label = document.getElementById('label');
let shoppingbag = document.getElementById('shopping-bag');

let updateLocalStorage = () => {
    localStorage.setItem("basket", JSON.stringify(basket));
    localStorage.setItem("itemQuantities", JSON.stringify(itemQuantities));
};

let basket = JSON.parse(localStorage.getItem("basket")) || [];
let itemQuantities = JSON.parse(localStorage.getItem("itemQuantities")) || {};
let totalItemCount = 0;

// Replace this logic with your actual item price retrieval
let getItemPrice = (id) => {
    const selectedItem = shopItemsData.find(item => item.id === id);
    return selectedItem ? selectedItem.price : 0;
};

let updateCartIcon = () => {
    let cartIcon = document.getElementById("cartAmount");
    cartIcon.textContent = basket.length;
};

updateCartIcon();

let generateCartItems = () => {
    const uniqueItems = new Set(basket);

    if (uniqueItems.size !== 0) {
        shoppingbag.innerHTML = Array.from(uniqueItems).map((itemId) => {
            const item = shopItemsData.find((itemData) => itemData.id === itemId);
            if (item) {
                return `
                <div><br></div>
                <div class="cart-item">
                    <img src="${item.img}" alt="${item.name}" width="100">
                    <div class="item-details">
                        <div class="title-price-x">
                            <h4 class="title-price">
                                <p>${item.name}</p>
                                <p class="card-item-price">&#x20A6;${item.price}</p>
                            </h4>
                            <i onclick="removeItem('${itemId}')" class="bi bi-x-lg"></i>
                        </div>
                        <div class="buttons">
                            <i onclick="decrement('${item.id}')" class="bi bi-dash-lg"></i>
                            <div id="${item.id}" class="quantity">${itemQuantities[item.id] || 0}</div>
                            <i onclick="increment('${item.id}')" class="bi bi-plus-lg"></i>
                        </div>
                        <h3 id="totalPrice_${item.id}"> &#x20A6; ${itemQuantities[item.id] * item.price || 0}</h3>
                    </div>
                </div>`;
            }
        }).join('');
    } else {
        shoppingbag.innerHTML = '';
        label.innerHTML = `
            <h2>Your shopping bag is empty</h2>
            <a href="home.html">
                <button class="HomeBtn">BACK TO HOME</button>
            </a>
        `;
    }
}
;

generateCartItems();


let calculateTotalPrice = () => {
    let totalBill = 0;
    for (const itemId in itemQuantities) {
        const quantity = itemQuantities[itemId];
        const itemPrice = getItemPrice(itemId);
        totalBill += quantity * itemPrice;
    }

    logTotalPrice(totalBill);
};

let totalItemPrice = 0;

let logTotalPrice = (totalPrice) => {
    let totalBillElement = document.getElementById('totalBill');
    totalBillElement.textContent = `Total Bill: ${totalPrice}`;
};

label.innerHTML += `
    <button class="checkout" id="checkoutButton">Checkout</button>
    <button onclick="clearcart()" class="removeAll">Clear Bag</button>
`;
const checkoutButton = document.querySelector('.checkout');
checkoutButton.addEventListener('click', displayPaymentOptions);
document.addEventListener("DOMContentLoaded", function () {
    const checkoutButton = document.querySelector('.checkout');
    checkoutButton.addEventListener('click', displayPaymentOptions);
});




let increment = (id) => {
    if (itemQuantities[id] === undefined) {
        itemQuantities[id] = 0;
    }

    const quantityElement = document.getElementById(id);
    let currentQuantity = parseInt(quantityElement.innerText, 10);

    currentQuantity++;
    quantityElement.innerText = currentQuantity;
    itemQuantities[id] = currentQuantity;
    basket.push(id);

    const itemPrice = getItemPrice(id);
    const itemTotalPriceElement = document.getElementById(`totalPrice_${id}`);
    const itemTotalPrice = currentQuantity * itemPrice;
    itemTotalPriceElement.innerText = `₦${itemTotalPrice}`;

    calculateTotalPrice();
    updateLocalStorage();
    updateCartIcon();
};

let decrement = (id) => {
    const index = basket.indexOf(id);
    if (index > -1) {
        basket.splice(index, 1);

        const quantityElement = document.getElementById(id);
        if (quantityElement) {
            const currentQuantity = parseInt(quantityElement.innerText, 10);

            if (currentQuantity > 0) {
                itemQuantities[id] = currentQuantity - 1;
                quantityElement.innerText = itemQuantities[id];

                const itemPrice = getItemPrice(id);
                const itemTotalPriceElement = document.getElementById(`totalPrice_${id}`);
                const itemTotalPrice = itemQuantities[id] * itemPrice;
                itemTotalPriceElement.innerText = `₦${itemTotalPrice}`;
            }
        }

        calculateTotalPrice();
        updateLocalStorage();
        updateCartIcon();
    }
    generateCartItems();
};

let removeItem = (itemId) => {
    const itemQuantity = itemQuantities[itemId];
    if (itemQuantity) {
        totalItemCount -= itemQuantity;
        totalItemPrice -= (getItemPrice(itemId) * itemQuantity);
        delete itemQuantities[itemId];

        basket = basket.filter((id) => id !== itemId);

        calculateTotalPrice();
        updateLocalStorage();
        updateCartIcon();
        logTotalPrice();
        generateCartItems();
    }
};

let calculateButton = document.getElementById('calculateButton');
calculateButton.addEventListener('click', () => {
    calculateTotalPrice();
});

const clearCartAndRefreshUI = () => {
    basket = [];
    itemQuantities = {};

    updateLocalStorage();

    generateCartItems();
    updateCartIcon();

    window.location.href = "home.html";
};

let clearcart = () => {
    basket = [];
    generateCartItems();
    localStorage.setItem("basket", JSON.stringify(basket));
    localStorage.setItem("itemQuantities", JSON.stringify(itemQuantities));
    clearCartAndRefreshUI();
};


function displayPaymentOptions() {
    // Create HTML elements for payment options
    const paymentOptionsDiv = document.createElement('div');
    paymentOptionsDiv.innerHTML = `
        <div id="checkoutModal" class="modal">
            <div class="modal-content">
            <span class="close-modal-button" id="closeModalButton">X</span>
                <h2>Payment Details</h2>
                
                <br>
                <p>Account Number: 1234567890 <i class="fa-solid fa-copy fa-fade" id="copyAccountButton"></i></p>
                <br>
                <p>Account Name: Your Name</p>
                <br>
                <p>Bank<i class="fa-solid fa-building-columns" style="color: #010005;"></i>: First City Monument Bank (FCMB)</p>
                <br>
                <p>FOR PAYMENT ON DELIVERY AND CONFIRMATION OF PAYMENT, PLEASE SHARE PAYMENT SLIP AND CONTACT US ON WHATSAPP <a href="https://wa.me/+2347033062210?text=I%20I%20Would%20Like%20To%20CONFIRM%20The%20PAYMENT%20OF₦________%20FOR%20THE%20_________ MATERIAL"><img src="/images/whatsapp-icon.png" class="icon-what"></a></p>

            </div>
        </div>
    `;
    

    // Append the payment options to the document
    const checkoutButton = document.getElementById('checkoutButton');
    checkoutButton.insertAdjacentElement('beforebegin', paymentOptionsDiv);

    // Add a click event listener to the "Copy Account Number" button
    const copyAccountButton = document.getElementById('copyAccountButton');
    copyAccountButton.addEventListener('click', copyAccountNumber);

// Add a click event listener to the close button to hide the modal
const closeModalButton = document.getElementById('closeModalButton');
if (closeModalButton) {
    closeModalButton.addEventListener('click', () => {
        const checkoutModal = document.getElementById('checkoutModal');
        if (checkoutModal) {
            checkoutModal.style.display = 'none';
        }
    });
}
}
function copyAccountNumber() {
    const accountNumber = '1234567890';
    navigator.clipboard.writeText(accountNumber).then(() => {
        alert('Account number copied to the clipboard');
    });
}
