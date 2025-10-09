// Funcionalidad del carrito
let cartCount = 0;
let cartItems = [];

// Cargar carrito desde localStorage al iniciar
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('herreria_cart');
    const savedCount = localStorage.getItem('herreria_cart_count');
    
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
        cartCount = cartItems.length;
        updateCartCount();
    }
    
    if (savedCount) {
        cartCount = parseInt(savedCount);
        updateCartCount();
    }
}

// Guardar carrito en localStorage
function saveCartToStorage() {
    localStorage.setItem('herreria_cart', JSON.stringify(cartItems));
    localStorage.setItem('herreria_cart_count', cartCount.toString());
}

// Calcular total del carrito
function calculateCartTotal() {
    let total = 0;
    cartItems.forEach(item => {
        if (item.price) {
            total += parseInt(item.price);
        }
    });
    return total;
}

// Actualizar contador del carrito
function updateCartCount() {
    document.querySelector('.cart-count').textContent = cartCount;
}

// Mostrar/ocultar carrito
function toggleCart() {
    let cartModal = document.getElementById('cart-modal');
    
    // Si el modal existe y está visible, cerrarlo
    if (cartModal && cartModal.style.display === 'block') {
        cartModal.style.display = 'none';
        document.body.classList.remove('cart-open');
        return;
    }
    
    // Si el modal existe pero está oculto o no existe, recrearlo
    if (cartModal) {
        cartModal.remove();
    }
    
    createCartModal();
    document.body.classList.add('cart-open');
    cartModal = document.getElementById('cart-modal');
    updateCartDisplay();
    cartModal.style.display = 'block';
}

// Crear modal del carrito
function createCartModal() {
    const cartModal = document.createElement('div');
    cartModal.id = 'cart-modal';
    cartModal.innerHTML = `
        <div class="cart-overlay" onclick="toggleCart()"></div>
        <div class="cart-content">
            <div class="cart-header">
                <h3><i class="fas fa-shopping-cart"></i> Tu Carrito</h3>
                <button onclick="toggleCart()" class="cart-close">&times;</button>
            </div>
            <div class="cart-items" id="cart-items-list">
                <!-- Los productos aparecerán aquí -->
            </div>
            <div class="cart-footer">
                <div class="cart-summary">
                    <div class="cart-count-info">
                        <strong>Productos: <span id="cart-total-count">0</span></strong>
                    </div>
                    <div class="cart-total-info">
                        <strong>Total: $<span id="cart-total-amount">0</span></strong>
                    </div>
                </div>
                <div class="cart-actions">
                    <button onclick="clearCart()" class="btn-clear">Vaciar Carrito</button>
                    <button onclick="viewMoreProducts()" class="btn-view-more">Ver más</button>
                    <button id="checkout-btn" class="btn-checkout">Comprar</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(cartModal);
    
    // Agregar event listener al botón de checkout
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            console.log('Botón Realizar Pedido clickeado');
            proceedToCheckout();
        });
    }
}

// Actualizar visualización del carrito
function updateCartDisplay() {
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotalCount = document.getElementById('cart-total-count');
    
    if (!cartItemsList) return;
    
    if (cartItems.length === 0) {
        cartItemsList.innerHTML = '<div class="empty-cart"><i class="fas fa-shopping-cart"></i><p>Tu carrito está vacío</p></div>';
    } else {
        cartItemsList.innerHTML = cartItems.map((item, index) => `
            <div class="cart-item">
                <div class="item-icon"><i class="${item.icon}"></i></div>
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>${item.description}</p>
                    ${item.price ? `<p class="item-price">$${parseInt(item.price).toLocaleString()}</p>` : ''}
                </div>
                <button onclick="removeFromCart(${index})" class="btn-remove">&times;</button>
            </div>
        `).join('');
    }
    
    cartTotalCount.textContent = cartItems.length;
    
    // Actualizar total del carrito
    const cartTotalAmount = document.getElementById('cart-total-amount');
    if (cartTotalAmount) {
        const total = calculateCartTotal();
        cartTotalAmount.textContent = total.toLocaleString();
    }
    
    // Re-agregar event listeners después de actualizar
    setTimeout(() => {
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn && !checkoutBtn.hasAttribute('data-listener')) {
            checkoutBtn.setAttribute('data-listener', 'true');
            checkoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('🔘 Botón checkout clickeado');
                proceedToCheckout();
            });
        }
        
        // Agregar event listener para el botón "Ver más" si no lo tiene
        const viewMoreBtn = document.querySelector('.btn-view-more');
        if (viewMoreBtn && !viewMoreBtn.hasAttribute('data-listener')) {
            viewMoreBtn.setAttribute('data-listener', 'true');
            viewMoreBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('🔘 Botón Ver más clickeado');
                viewMoreProducts();
            });
        }
    }, 100);
}

// Remover producto del carrito
function removeFromCart(index) {
    cartItems.splice(index, 1);
    cartCount = cartItems.length;
    updateCartCount();
    updateCartDisplay();
    saveCartToStorage(); // Guardar en localStorage
    showNotification('Producto removido del carrito');
}

// Vaciar carrito
function clearCart() {
    cartItems = [];
    cartCount = 0;
    updateCartCount();
    updateCartDisplay();
    saveCartToStorage(); // Guardar en localStorage
    showNotification('Carrito vaciado');
}

// Proceder al checkout
function proceedToCheckout() {
    console.log('=== FUNCIÓN PROCEEDTOCHECKOUT LLAMADA ===');
    console.log('cartItems length:', cartItems.length);
    console.log('cartItems content:', cartItems);
    
    if (cartItems.length === 0) {
        alert('Tu carrito está vacío'); // Usando alert para debug
        showNotification('Tu carrito está vacío');
        return;
    }
    
    alert('Procesando pedido...'); // Debug
    
    try {
        // Guardar los productos del carrito en localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        console.log('✅ Datos guardados en localStorage');
        
        // Usar window.location.href directamente para evitar problemas con popups
        console.log('🔄 Redirigiendo a cotizacion.html');
        showNotification('Redirigiendo a completar el pedido...');
        
        // Pequeño delay para que se vea la notificación
        setTimeout(() => {
            window.location.href = 'cotizacion.html';
        }, 500);
        
    } catch (error) {
        console.error('❌ Error en proceedToCheckout:', error);
        alert('Error: ' + error.message); // Debug
        showNotification('Error al procesar el pedido');
    }
}

// Agregar al carrito
document.addEventListener('DOMContentLoaded', function() {
    // Cargar carrito guardado
    loadCartFromStorage();
    const buyButtons = document.querySelectorAll('.btn-buy, .btn-buy-product');
    
    buyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // No interceptar productos personalizados - deben ir directo a su página
            if (this.textContent.includes('Solicitar Pedido')) {
                return; // Permitir que el enlace funcione normalmente sin preventDefault
            }
            
            // No interceptar botones de catálogo - deben ir directo a su página
            if (this.classList.contains('btn-catalog')) {
                return; // Permitir que el enlace funcione normalmente sin preventDefault
            }
            
            e.preventDefault();
            
            let productName, productIcon, productDescription, productPrice;
            
            // Verificar si es un producto de catálogo (con data attributes)
            if (this.hasAttribute('data-product')) {
                productName = this.getAttribute('data-product');
                productPrice = this.getAttribute('data-price');
                
                // Obtener información del producto de catálogo
                const productCard = this.closest('.product-card');
                if (productCard) {
                    productDescription = productCard.querySelector('.product-info p').textContent;
                    productIcon = 'fas fa-box'; // Icono genérico para productos de catálogo
                } else {
                    productDescription = 'Producto de catálogo';
                    productIcon = 'fas fa-box';
                }
            } else {
                // Para productos de la página principal (slides)
                const slide = this.closest('.slide');
                productName = slide.querySelector('h3').textContent;
                productIcon = slide.querySelector('.slide-icon i').className;
                productDescription = slide.querySelector('p').textContent;
                productPrice = null;
            }
            
            // Agregar al carrito
            cartItems.push({
                name: productName,
                icon: productIcon,
                description: productDescription.substring(0, 80) + '...',
                price: productPrice
            });
            
            cartCount = cartItems.length;
            updateCartCount();
            saveCartToStorage(); // Guardar en localStorage
            
            // Animación del botón
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Mostrar mensaje
            showNotification('Producto agregado al carrito!');
        });
    });
    
    // Manejar clic en el botón del carrito
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleCart();
        });
    } else {
        console.error('No se encontró el botón del carrito');
    }
    
    // Formulario de contacto removido - ahora solo enlaces directos
    
    // Smooth scroll para enlaces del menú
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Animación de aparición en scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos para animación
    document.querySelectorAll('.slide, .stat, .contact-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Hacer las funciones globales para que funcionen con onclick
window.toggleCart = toggleCart;
window.proceedToCheckout = proceedToCheckout;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;

// Función de prueba
function testCheckout() {
    alert('Función de prueba funcionando');
    console.log('Test checkout called');
}
window.testCheckout = testCheckout;

// Función Ver más - redirige a la sección de productos
function viewMoreProducts() {
    console.log('viewMoreProducts called');
    toggleCart(); // Cerrar carrito
    if (window.location.pathname.includes('catalogo-')) {
        window.location.href = 'WEB.html#productos';
    } else {
        document.getElementById('productos').scrollIntoView({ behavior: 'smooth' });
    }
}
window.viewMoreProducts = viewMoreProducts;

// Función para mostrar notificaciones
function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #25d366;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        transform: translateX(300px);
        transition: transform 0.3s ease;
        font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Mostrar notificación
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Ocultar y remover notificación
    setTimeout(() => {
        notification.style.transform = 'translateX(300px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 1px 0 rgba(0,0,0,0.1)';
    }
});

// Contador animado para las estadísticas
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace('+', ''));
        let current = 0;
        const increment = target / 100;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target + '+';
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current) + '+';
            }
        }, 20);
    });
}

// Iniciar animación de contadores cuando la sección sea visible
const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
}