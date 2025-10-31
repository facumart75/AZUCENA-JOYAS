// ===============================================
// LÓGICA DEL CARRITO DE COMPRAS (Compartida en todas las páginas)
// ===============================================

// Inicializa el carrito leyendo lo guardado en el navegador (localStorage)
let cart = JSON.parse(localStorage.getItem('azucenaCart')) || [];
const cartCountElement = document.getElementById('cartCount');

// Formato de moneda para Argentina (ARS)
const formatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0
});

// Función para sumar todos los productos y actualizar el número del carrito
function updateCartCount() {
    // Suma la cantidad de todos los productos
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

// Guarda el carrito actual en localStorage
function saveCart() {
    localStorage.setItem('azucenaCart', JSON.stringify(cart));
}

// Añade o incrementa un producto al carrito
function addProductToCart(name, price, id, quantity = 1) {
    const priceNum = parseInt(price);
    
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        // Asumo que tienes una imagen en una ruta similar a "img/item-id.jpg"
        const imgUrl = `./img/${id.replace(/-/g, '')}.png`; 
        cart.push({ id, name, price: priceNum, quantity, img: imgUrl });
    }

    saveCart();
    updateCartCount();
    
    alert(`¡${name} añadido al carrito! Total de artículos: ${cart.length}`);
}


// ===============================================
// LÓGICA ESPECÍFICA PARA CARRITO.HTML
// ===============================================

// Controla la cantidad (incrementa, decrementa o remueve)
function changeQuantity(id, action) {
    const itemIndex = cart.findIndex(item => item.id === id);
    
    if (itemIndex > -1) {
        if (action === 'increase') {
            cart[itemIndex].quantity++;
        } else if (action === 'decrease') {
            cart[itemIndex].quantity--;
        }

        // Si la cantidad llega a 0, remueve el ítem
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }

        saveCart();
        updateCartCount();
        renderCart(); // Vuelve a renderizar el carrito
    }
}

// Remueve un ítem completamente
function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartCount();
    renderCart(); // Vuelve a renderizar el carrito
}

// Renderiza los ítems del carrito y actualiza los totales
function renderCart() {
    const listElement = document.getElementById('cartItemsList');
    const subtotalElement = document.getElementById('cartSubtotal');
    const totalElement = document.getElementById('cartTotal');
    
    if (!listElement) return;

    listElement.innerHTML = '';
    let subtotal = 0;

    if (cart.length === 0) {
        listElement.innerHTML = '<p class="cart-empty-message">Tu carrito está vacío. ¡Descubre nuestra colección!</p>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            // Crear el elemento HTML para el producto
            const itemHTML = `
                <div class="cart-item" data-product-id="${item.id}">
                    <div class="cart-item-details">
                        <img src="./img/collaramatista.png" alt="${item.name}"> <div class="item-info">
                            <h4>${item.name}</h4>
                            <p>${formatter.format(item.price)} c/u</p>
                        </div>
                    </div>
                    
                    <div class="quantity-controls">
                        <button class="quantity-change" data-id="${item.id}" data-action="decrease">-</button>
                        <span class="item-quantity">${item.quantity}</span>
                        <button class="quantity-change" data-id="${item.id}" data-action="increase">+</button>
                    </div>
                    
                    <p class="item-price-total">${formatter.format(itemTotal)}</p>
                    <button class="remove-item" data-id="${item.id}">❌</button>
                </div>
            `;
            listElement.insertAdjacentHTML('beforeend', itemHTML);
        });

        // Agrega listeners a los botones generados
        document.querySelectorAll('.quantity-change').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const action = e.target.getAttribute('data-action');
                changeQuantity(id, action);
            });
        });

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                removeItem(id);
            });
        });
    }

    // Actualiza los totales
    subtotalElement.textContent = formatter.format(subtotal);
    totalElement.textContent = formatter.format(subtotal);
}


// ===============================================
// EJECUCIÓN AL CARGAR LA PÁGINA
// ===============================================
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Lógica del Carrito (Activación del botón y contador)
    updateCartCount(); // Actualiza el contador al cargar CUALQUIER página

    const addToCartBtn = document.getElementById('addToCartBtn');
    if (addToCartBtn) {
        // Si el botón existe (estamos en una página de producto), agregamos el listener
        addToCartBtn.addEventListener('click', () => {
            const name = addToCartBtn.getAttribute('data-product-name');
            const price = addToCartBtn.getAttribute('data-product-price');
            const id = addToCartBtn.getAttribute('data-product-id');
            addProductToCart(name, price, id);
        });
    }

    // 2. Lógica de la Galería de Imágenes (Código que ya tenías)
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail-item');

    if (mainImage && thumbnails.length > 0) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                const fullImgSrc = this.getAttribute('data-full-img');
                mainImage.src = fullImgSrc;
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
        thumbnails[0].classList.add('active');
    }

    // 3. Lógica Específica para la página del Carrito
    if (document.querySelector('.cart-page')) {
        renderCart();
    }
});