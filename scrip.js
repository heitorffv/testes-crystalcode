const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")
const pontorefInput = document.getElementById('pontoref')
const nameuserInput = document.getElementById('nameuser')
const nameuserWarn = document.getElementById('nameuser-warn')
const cashamountInput = document.getElementById('cash-amount')
const observacoesInput = document.getElementById('observacoes')
const trocoWarn = document.getElementById('troco-warn')

let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function() {
    cartModal.style.display = "flex"
})

// Fechar modal quando clicar fora
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

menu.addEventListener("click", function(event){

    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name, price)
    }
})

// Função para adicionar no carrinho
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        // Se o item já existe, aumenta apenas a quantidade +1
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal()
}

// Atualiza o carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");  
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Quantidade: ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>

            <button class="remove-from-cart-btn" data-name="${item.name}">
                Remover
            </button>
        </div>
    `

        total += item.price * item.quantity;
        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

// Função para remover itens do carrinho
cartItemsContainer.addEventListener("click", function(event) {
    if(event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name");
        removeItemCart(name);
    }
});

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1) {
        const item = cart[index];

        if(item.quantity > 1) {
            item.quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
        updateCartModal();
    }
}

nameuserInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        nameuserInput.classList.remove("border-red-500")
        nameuserWarn.classList.add("hidden")
    }
})

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

cashamountInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        cashamountInput.classList.remove("border-red-500")
        trocoWarn.classList.add("hidden")
    }
})

// Finalizar pedidos
checkoutBtn.addEventListener("click", function(){

    const isOpen = checkRestaurantOpen();
    if(!isOpen){

        Toastify({
            text: "Ops, o restaurante está fechado no momento",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
        }).showToast();

        return;
    }

    if(cart.length === 0) return;
    if(nameuserInput.value === ""){
        nameuserWarn.classList.remove("hidden")
        nameuserWarn.classList.add("border-red-500")
        return;
    }

    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressWarn.classList.add("border-red-500")
        return;
    }

    if(cart.length === 0) return;
    if(cashamountInput.value === ""){
        trocoWarn.classList.remove("hidden")
        trocoWarn.classList.add("border-red-500")
        return;
    }

    // Enviar o pedido para o WhatsApp
    const cartItems = cart.map((item) => {
        return (
            `Pedido: ${item.name}\nQuantidade: (${item.quantity})\nPreço: R$${item.price}\n`
        );
    }).join("\n");

    const message = encodeURIComponent(`
${cartItems}

Nome do cliente: ${nameuserInput.value}

Endereço: ${addressInput.value}

Ponto de referência: ${pontorefInput.value}

O cliente precisa de troco? ${cashamountInput.value}

Observações do cliente, caso tenha: '${observacoesInput.value}'

    `);

    const phone = "+5579996747380";

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

    cart = [];
    updateCartModal();
})

function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 15 && hora < 23; // true
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
} else {
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}
