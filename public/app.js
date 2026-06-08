// --- Configuration & State ---
const API_BASE = 'http://localhost:5000/api'; // Your Node.js Backend URL

const state = {
    products: [],
    cart: JSON.parse(localStorage.getItem('uw_cart')) || [],
    user: JSON.parse(localStorage.getItem('uw_user')) || null,
    filters: { category: 'All', search: '' },
    selectedProduct: null,
    selectedSize: null
};

// --- Toast Notifications ---
const showToast = (message, type = 'success') => {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3000);
};

// --- API Service Layer (Connects Frontend to Backend) ---
const api = {
    // Fetch products from DB. Falls back to mock data if backend is offline.
    getProducts: async () => {
        try {
            const res = await fetch(`${API_BASE}/products?category=${state.filters.category}&search=${state.filters.search}`);
            if (!res.ok) throw new Error('Network response was not ok');
            return await res.json();
        } catch (error) {
            console.warn("Backend offline, using mock data.");
            return mockData.filter(p => 
                (state.filters.category === 'All' || p.category === state.filters.category) &&
                p.name.toLowerCase().includes(state.filters.search.toLowerCase())
            );
        }
    },
    getProductById: async (id) => {
        try {
            const res = await fetch(`${API_BASE}/products/${id}`);
            if (!res.ok) throw new Error('Network response was not ok');
            return await res.json();
        } catch (error) {
            return mockData.find(p => p._id === id);
        }
    },
    login: async (email, password) => {
    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        // IMPORTANT FIX
        if (!res.ok) {
            return { msg: data.msg || "Login failed" };
        }

        return data;

    } catch (error) {
        return { msg: "Backend not running / server error" };
    }
},
    register: async (name, email, password) => {
        try {
            const res = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            return await res.json();
        } catch (error) { return { msg: "Network error" }; }
    },
    placeOrder: async (orderData) => {
        try {
            const res = await fetch(`${API_BASE}/orders`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });
            return await res.json();
        } catch (error) { return { msg: "Order failed to place" }; }
    }
};

// --- Mock Data (Used if backend is down - features real Unsplash images) ---
const mockData = [
    { _id: "1", name: "Cashmere Overcoat", price: 450, category: "Women", badge: "New", image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800", rating: 4.9, sizes: ['XS','S','M','L'] },
    { _id: "2", name: "Urban Leather Jacket", price: 380, category: "Men", badge: "Trending", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800", rating: 4.8, sizes: ['S','M','L','XL'] },
    { _id: "3", name: "Silk Evening Dress", price: 290, category: "Women", badge: "", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800", rating: 5.0, sizes: ['XS','S','M'] },
    { _id: "4", name: "Tailored Wool Suit", price: 520, category: "Men", badge: "", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800", rating: 4.7, sizes: ['M','L','XL'] },
    { _id: "5", name: "Minimalist Watch", price: 220, category: "Accessories", badge: "New", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800", rating: 4.9, sizes: ['One Size'] },
    { _id: "6", name: "Premium Sneakers", price: 180, category: "Accessories", badge: "Sale", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800", rating: 4.8, sizes: ['8','9','10','11'] }
];

// --- SPA Router ---
const router = {
    navigate: (path) => {
        window.location.hash = path;
    },
    handleRoute: async () => {
        const hash = window.location.hash.slice(1) || '/';
        const pathParts = hash.split('?');
        const path = pathParts[0];
        const queryParams = new URLSearchParams(pathParts[1] || '');

        // Close mobile menu on route change
const menu = document.getElementById('mobile-menu');
if (menu) menu.classList.remove('active');

        if (path.startsWith('/product/')) {
            const id = path.split('/')[2];
            await renderProductPage(id);
        } else if (path === '/shop') {
            state.filters.category = queryParams.get('category') || 'All';
            await renderShopPage();
        } else if (path === '/cart') {
            renderCartPage();
        } else if (path === '/auth') {
            renderAuthPage();
        } else {
            renderHomePage();
        }
        window.scrollTo(0,0);
    }
};

// --- Global UI Functions ---
function toggleSearch() { document.getElementById('search-bar').classList.toggle('active'); }
function toggleMobileMenu() { document.getElementById('mobile-menu').classList.toggle('active'); }
function handleSearch(event) {
    if(event.key === 'Enter') {
        state.filters.search = event.target.value;
        router.navigate('/shop');
    }
}
function handleUserIcon() { state.user ? alert(`Logged in as: ${state.user.name}`) : router.navigate('/auth'); }
function updateCartBadge() {
    const badge = document.getElementById('cart-badge');

    const totalItems = state.cart.reduce((sum, item) => sum + item.qty, 0);

    if (badge) {
        badge.textContent = totalItems;
    }
}

// --- Cart Logic (Client-Side + API Sync) ---
function addToCart(id, name, price, image, size) {
    if (!size) {
        showToast("Please select a size", "error");
        return;
    }

    const existing = state.cart.find(item => item.id === id && item.size === size);

    if (existing) {
        existing.qty += 1;
    } else {
        state.cart.push({
            id,
            name,
            price,
            image,
            size,
            qty: 1
        });
    }

    localStorage.setItem('uw_cart', JSON.stringify(state.cart));
    updateCartBadge();
    showToast(`${name} (${size}) added to bag!`);
}
function updateQty(id, size, newQty) {
    const item = state.cart.find(i => i.id === id && i.size === size);

    if (item) {
        item.qty = Number(newQty);

        if (item.qty <= 0) {
            state.cart = state.cart.filter(i => !(i.id === id && i.size === size));
        }

        localStorage.setItem('uw_cart', JSON.stringify(state.cart));
        renderCartPage();
        updateCartBadge();
    }
}
// --- Render Pages ---
function renderHomePage() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <section class="hero">
            <div class="hero-content">
                <h1>Redefine Your Style</h1>
                <p>Curated luxury fashion for the modern individual. Connects to your Node.js backend.</p>
                <div class="hero-btns">
                    <button class="btn-primary" onclick="router.navigate('/shop')">Shop Now</button>
                    <button class="btn-outline" onclick="router.navigate('/shop?badge=New')">New Arrivals</button>
                </div>
            </div>
        </section>
        <section class="section">
            <div class="container">
                <div class="section-header"><h2>Featured Categories</h2><p>Explore our diverse collections</p></div>
                <div class="product-grid" style="grid-template-columns: repeat(3, 1fr); gap: 20px;">
                    <div class="product-card" style="cursor:pointer" onclick="router.navigate('/shop?category=Women')">
                        <div class="product-img"><img src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800" alt="Women"><div class="product-actions" style="bottom:0; background:rgba(0,0,0,0.6)"><h3 style="color:#fff; font-family:'Playfair Display'">Women</h3></div></div>
                    </div>
                    <div class="product-card" style="cursor:pointer" onclick="router.navigate('/shop?category=Men')">
                        <div class="product-img"><img src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800" alt="Men"><div class="product-actions" style="bottom:0; background:rgba(0,0,0,0.6)"><h3 style="color:#fff; font-family:'Playfair Display'">Men</h3></div></div>
                    </div>
                    <div class="product-card" style="cursor:pointer" onclick="router.navigate('/shop?category=Accessories')">
                        <div class="product-img"><img src="https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=800" alt="Accessories"><div class="product-actions" style="bottom:0; background:rgba(0,0,0,0.6)"><h3 style="color:#fff; font-family:'Playfair Display'">Accessories</h3></div></div>
                    </div>
                </div>
            </div>
        </section>
    `;
}

async function renderShopPage() {
    const app = document.getElementById('app');
    app.innerHTML = `<div class="container shop-container"><div class="loading" style="padding:50px">Fetching products...</div></div>`;
    
    state.products = await api.getProducts();
    
    app.innerHTML = `
        <div class="container shop-container">
            <aside class="filters">
                <div class="filter-group">
                    <h4>Categories</h4>
                    <button class="filter-btn ${state.filters.category==='All'?'active':''}" onclick="state.filters.category='All'; router.navigate('/shop')">All</button>
                    <button class="filter-btn ${state.filters.category==='Men'?'active':''}" onclick="state.filters.category='Men'; router.navigate('/shop?category=Men')">Men</button>
                    <button class="filter-btn ${state.filters.category==='Women'?'active':''}" onclick="state.filters.category='Women'; router.navigate('/shop?category=Women')">Women</button>
                    <button class="filter-btn ${state.filters.category==='Accessories'?'active':''}" onclick="state.filters.category='Accessories'; router.navigate('/shop?category=Accessories')">Accessories</button>
                </div>
            </aside>
            <main>
                <h2 style="margin-bottom: 30px">${state.filters.category === 'All' ? 'All Products' : state.filters.category}</h2>
                <div class="product-grid" id="product-list"></div>
            </main>
        </div>
    `;
    
    document.getElementById('product-list').innerHTML = state.products.map(p => createProductCard(p)).join('');
}

async function renderProductPage(id) {
    const app = document.getElementById('app');
    app.innerHTML = `<div class="container" style="padding:100px 20px">Loading product details...</div>`;
    
    const p = await api.getProductById(id);
    if(!p) { app.innerHTML = `<div class="container" style="padding:100px 20px">Product not found.</div>`; return; }
    
    state.selectedSize = p.sizes ? p.sizes[0] : null; // Default to first size

    app.innerHTML = `
        <div class="container detail-grid">
            <div style="aspect-ratio: 3/4; overflow: hidden; background: var(--bg-secondary); border-radius: 4px;">
                <img src="${p.image}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="padding-top: 20px;">
                <p style="color:var(--text-secondary); text-transform:uppercase; font-size:12px; letter-spacing:1px; margin-bottom:10px;">${p.category}</p>
                <h2 style="font-size: 2.5rem; margin-bottom: 15px;">${p.name}</h2>
                <div class="price" style="font-size: 1.5rem; margin-bottom: 20px; color: var(--accent-color);">$${p.price.toFixed(2)}</div>
                <div class="rating" style="margin-bottom: 20px; color: #f5c518;">${'★'.repeat(Math.floor(p.rating))} (${p.rating})</div>
                <p style="color: var(--text-secondary); margin-bottom: 30px; line-height: 1.6;">Premium quality fabric designed for comfort and style. This piece is a staple in modern luxury fashion, perfect for any occasion.</p>
                <div style="margin-bottom: 30px;">
                    <label style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 10px; font-weight: 600;">Size</label>
                    <div id="size-selector">
                        ${p.sizes.map(s => `<button class="size-btn ${s === state.selectedSize ? 'active' : ''}" onclick="selectSize('${s}', this)">${s}</button>`).join('')}
                    </div>
                </div>
                <button class="btn-primary" onclick="addToCart('${p._id}', '${p.name.replace(/'/g, "\\'")}', ${p.price}, '${p.image}', '${state.selectedSize}')" style="width: 100%; text-align: center;">Add to Bag</button>
            </div>
        </div>
    `;
}

function selectSize(size, element) {
    state.selectedSize = size;
    document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
}

function renderCartPage() {
    const app = document.getElementById('app');
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const shipping = subtotal > 150 ? 0 : 15;
    
    if(state.cart.length === 0) {
        app.innerHTML = `<div class="container" style="padding: 100px 20px; text-align: center;">
            <i class="fas fa-shopping-bag" style="font-size: 48px; color: var(--text-secondary); margin-bottom: 20px;"></i>
            <h2 style="margin-bottom: 10px;">Your bag is empty</h2>
            <p style="margin-bottom: 20px; color: var(--text-secondary);">Looks like you haven't added anything yet.</p>
            <button class="btn-primary" onclick="router.navigate('/shop')">Continue Shopping</button>
        </div>`;
        return;
    }

    app.innerHTML = `
        <div class="container" style="padding: 40px 20px 80px;">
            <h2 style="margin-bottom: 40px;">Shopping Bag</h2>
            <div style="display: grid; grid-template-columns: 1fr 350px; gap: 40px;">
                <div>
                    <table class="cart-table">
                        <thead><tr><th>Product</th><th>Size</th><th>Quantity</th><th>Total</th></tr></thead>
                        <tbody>
                            ${state.cart.map(item => `
                                <tr>
                                    <td style="display:flex;align-items:center;gap:15px;">
                                        <img src="${item.image}" class="cart-item-img" alt="">
                                        <div><h4 style="font-family:'Inter',sans-serif; font-size:14px;">${item.name}</h4><p style="font-size:12px;color:var(--text-secondary);margin-top:5px;">$${item.price.toFixed(2)}</p></div>
                                    </td>
                                    <td>${item.size}</td>
                                    <td><div class="qty-control"><button class="qty-btn" onclick="updateQty('${item.id}', '${item.size}', ${item.qty - 1})">-</button><span class="qty-num">${item.qty}</span><button class="qty-btn" onclick="updateQty('${item.id}', '${item.size}', ${item.qty + 1})">+</button></div></td>
                                    <td style="font-weight: 600;">$${(item.price * item.qty).toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <div class="cart-summary">
                    <h3 style="margin-bottom: 20px; font-family: 'Inter', sans-serif;">Order Summary</h3>
                    <div style="display:flex;justify-content:space-between;margin-bottom:10px;"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
                    <div style="display:flex;justify-content:space-between;margin-bottom:20px;"><span>Shipping</span><span>${shipping === 0 ? 'FREE' : '$'+shipping.toFixed(2)}</span></div>
                    <div style="display:flex;justify-content:space-between;font-weight:bold;border-top:1px solid #ddd;padding-top:10px;font-size:1.2rem;margin-bottom:30px;"><span>Total</span><span>$${(subtotal+shipping).toFixed(2)}</span></div>
                    <button class="btn-primary" style="width:100%;text-align:center;background:var(--accent-color);border-color:var(--accent-color);" onclick="handleCheckout()">Proceed to Checkout</button>
                </div>
            </div>
        </div>
    `;
}

function renderAuthPage() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="container" style="max-width: 500px; padding: 80px 20px;">
            <div style="background: var(--bg-secondary); padding: 40px; border-radius: 8px;">
                <h2 style="text-align: center; margin-bottom: 30px;">My Account</h2>
                <div id="auth-form-container">
                    <form onsubmit="handleLogin(event)">
                        <div class="form-group"><input type="email" class="form-input" placeholder="Email Address" required id="login-email"></div>
                        <div class="form-group"><input type="password" class="form-input" placeholder="Password" required id="login-pass"></div>
                        <button type="submit" class="btn-primary" style="width: 100%; text-align: center;">Sign In</button>
                    </form>
                    <p style="margin-top: 20px; text-align: center; font-size: 14px;">
                        Don't have an account? <a href="#" onclick="toggleAuthView('register')" style="color: var(--accent-color); font-weight: 600;">Register</a>
                    </p>
                </div>
                <div id="register-form-container" style="display:none;">
                    <form onsubmit="handleRegister(event)">
                        <div class="form-group"><input type="text" class="form-input" placeholder="Full Name" required id="reg-name"></div>
                        <div class="form-group"><input type="email" class="form-input" placeholder="Email Address" required id="reg-email"></div>
                        <div class="form-group"><input type="password" class="form-input" placeholder="Password" required id="reg-pass"></div>
                        <button type="submit" class="btn-primary" style="width: 100%; text-align: center;">Create Account</button>
                    </form>
                    <p style="margin-top: 20px; text-align: center; font-size: 14px;">
                        Already have an account? <a href="#" onclick="toggleAuthView('login')" style="color: var(--accent-color); font-weight: 600;">Sign In</a>
                    </p>
                </div>
            </div>
        </div>
    `;
}

// --- Helper Functions ---
function createProductCard(p) {
    return `
        <div class="product-card">
            <div class="product-img">
                ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ''}
                <img src="${p.image}" alt="${p.name}" loading="lazy">
                <div class="product-actions">
                    <button class="action-btn" onclick="addToCart('${p._id}', '${p.name.replace(/'/g, "\\'")}', ${p.price}, '${p.image}', '${p.sizes ? p.sizes[0] : 'One Size'}')" title="Add to Bag"><i class="fas fa-shopping-bag"></i></button>
                    <button class="action-btn" onclick="router.navigate('/product/' + encodeURIComponent('${p._id}'))" title="Quick View"><i class="fas fa-eye"></i></button>
                </div>
            </div>
            <div class="product-info">
                <h4 onclick="router.navigate('/product/${p._id}')">${p.name}</h4>
                <div class="price">$${p.price.toFixed(2)}</div>
                <div class="rating">${'★'.repeat(Math.floor(p.rating))} (${p.rating})</div>
            </div>
        </div>`;
}

function toggleAuthView(view) {
    document.getElementById('auth-form-container').style.display = view === 'login' ? 'block' : 'none';
    document.getElementById('register-form-container').style.display = view === 'register' ? 'block' : 'none';
}

// --- API Action Handlers ---
async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-pass').value;

    const data = await api.login(email, password);

    console.log("LOGIN RESPONSE:", data);

    if (data.token) {
        state.user = data.user;

        localStorage.setItem('uw_user', JSON.stringify(state.user));

        showToast(`Welcome back ${state.user.name}`);
        router.navigate('/shop');
    } else {
        showToast(data.msg || "User not found / Invalid credentials", "error");
    }
}
async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-pass').value;
    const data = await api.register(name, email, password);
    
    if (data.token || data.user) {
    showToast("Account created! Please log in.");
    toggleAuthView('login');
} else {
    showToast(data.msg || "Registration failed", "error");
}
}

async function handleCheckout() {
    if(!state.user) {
        showToast("Please login to proceed", "error");
        router.navigate('/auth');
        return;
    }
    
    const orderData = {
        user: state.user.id,
        items: state.cart.map(item => ({ productId: item.id, size: item.size, qty: item.qty })),
        total: state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0),
        shippingAddress: "123 Default St (Simulated)"
    };
    
    const result = await api.placeOrder(orderData);
    if(result.msg) {
        state.cart = [];
        localStorage.setItem('uw_cart', JSON.stringify(state.cart));
        updateCartBadge();
        showToast(result.msg);
        router.navigate('/');
    } else {
        showToast("Checkout failed", "error");
    }
}

// --- Initialization ---
window.addEventListener('hashchange', router.handleRoute);
window.onload = () => {
    updateCartBadge();
    router.handleRoute();
};
function toggleDarkMode() {
    const isDark = document.body.classList.toggle("dark-mode");

    const icon = document.querySelector("#dark-toggle i");

    if (isDark) {
        localStorage.setItem("theme", "dark");
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
    } else {
        localStorage.setItem("theme", "light");
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
    }
}

// Load saved theme
window.addEventListener("load", () => {
    const theme = localStorage.getItem("theme");
    const icon = document.querySelector("#dark-toggle i");

    if (theme === "dark") {
        document.body.classList.add("dark-mode");
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
    }
});