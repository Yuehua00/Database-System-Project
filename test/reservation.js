// 菜單資料
const menuItems = [
    { id: 1, name: '香蒜培根義大利麵', price: 280 },
    { id: 2, name: '奶油蘑菇義大利麵', price: 260 },
    { id: 3, name: '番茄海鮮義大利麵', price: 320 },
    { id: 4, name: '青醬雞肉義大利麵', price: 290 },
    { id: 5, name: '臘腸番茄義大利麵', price: 270 },
    { id: 6, name: '白酒蛤蠣義大利麵', price: 300 }
];

// 購物車狀態
let cart = [];
let currentStep = 1;

// DOM 載入完成後執行
document.addEventListener('DOMContentLoaded', function() {
    initializeReservation();
});

// 初始化訂位頁面
function initializeReservation() {
    // 設定日期限制
    const dateInput = document.querySelector('input[type="date"]');
    if (dateInput) {
        const today = new Date();
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 1);
        
        dateInput.min = today.toISOString().split('T')[0];
        dateInput.max = maxDate.toISOString().split('T')[0];
    }

    // 渲染菜單項目
    renderMenuItems();
    
    // 註冊事件監聽器
    setupEventListeners();
}

// 設置事件監聽器
function setupEventListeners() {
    // 繼續按鈕
    document.querySelectorAll('.reservation-step button:last-child').forEach(button => {
        button.addEventListener('click', function() {
            if (validateStep(currentStep)) {
                moveToStep(currentStep + 1);
            }
        });
    });

    // 返回按鈕
    document.querySelectorAll('.reservation-step button:first-child').forEach(button => {
        button.addEventListener('click', function() {
            moveToStep(currentStep - 1);
        });
    });

    // 確認訂位按鈕
    const confirmButton = document.querySelector('#step3 button:last-child');
    if (confirmButton) {
        confirmButton.addEventListener('click', confirmOrder);
    }
}

// 驗證每個步驟
function validateStep(step) {
    switch(step) {
        case 1:
            const people = document.querySelector('.form-group select')?.value;
            const date = document.querySelector('input[type="date"]')?.value;
            const timeSlot = document.querySelector('.form-group select:last-child')?.value;
            
            if (!people || !date || !timeSlot) {
                alert('請填寫所有必要資訊');
                return false;
            }
            return true;

        case 2:
            if (cart.length === 0) {
                alert('請至少選擇一項餐點');
                return false;
            }
            return true;

        default:
            return true;
    }
}

// 切換步驟
function moveToStep(step) {
    // 更新進度條
    document.querySelectorAll('.progress-step').forEach(el => {
        el.classList.remove('active');
    });
    document.querySelector(`[data-step="${step}"]`).classList.add('active');

    // 切換表單
    document.querySelectorAll('.reservation-step').forEach(el => {
        el.classList.remove('active');
    });
    document.getElementById(`step${step}`).classList.add('active');

    // 如果是最後一步，更新訂單摘要
    if (step === 3) {
        updateOrderSummary();
    }

    currentStep = step;
}

// 渲染菜單項目
function renderMenuItems() {
    const container = document.querySelector('.menu-selection');
    if (container) {
        container.innerHTML = menuItems.map(item => `
            <div class="menu-item" data-id="${item.id}">
                <div class="menu-item-header">
                    <div>
                        <h3>${item.name}</h3>
                        <p class="price">NT$ ${item.price}</p>
                    </div>
                    <div class="quantity-control">
                        <button class="quantity-btn decrease" onclick="updateCart(${item.id}, -1)">-</button>
                        <span class="quantity">0</span>
                        <button class="quantity-btn increase" onclick="updateCart(${item.id}, 1)">+</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// 更新購物車
function updateCart(itemId, change) {
    const item = menuItems.find(i => i.id === itemId);
    const existingItem = cart.find(i => i.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += change;
        if (existingItem.quantity <= 0) {
            cart = cart.filter(i => i.id !== itemId);
        }
    } else if (change > 0) {
        cart.push({
            id: itemId,
            name: item.name,
            price: item.price,
            quantity: 1
        });
    }

    updateCartDisplay();
}

// 更新購物車顯示
function updateCartDisplay() {
    // 更新菜單項目的數量顯示
    cart.forEach(item => {
        const menuItem = document.querySelector(`.menu-item[data-id="${item.id}"]`);
        if (menuItem) {
            menuItem.querySelector('.quantity').textContent = item.quantity;
        }
    });

    // 更新購物車預覽
    const cartItems = document.querySelector('.cart-items');
    if (cartItems) {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <span>${item.name} x ${item.quantity}</span>
                <span>NT$ ${item.price * item.quantity}</span>
            </div>
        `).join('');
    }
}

// 更新訂單摘要
function updateOrderSummary() {
    // 更新訂位資訊
    document.getElementById('summary-people').textContent = 
        document.querySelector('.form-group select')?.value || '';
    document.getElementById('summary-date').textContent = 
        document.querySelector('input[type="date"]')?.value || '';
    document.getElementById('summary-time').textContent = 
        document.querySelector('.form-group select:last-child')?.value || '';

    // 更新訂購餐點
    const summaryItems = document.getElementById('summary-items');
    if (summaryItems) {
        summaryItems.innerHTML = cart.map(item => `
            <div class="summary-item">
                <span>${item.name} x ${item.quantity}</span>
                <span>NT$ ${item.price * item.quantity}</span>
            </div>
        `).join('');
    }

    // 計算總金額
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('subtotal').textContent = subtotal;
    document.getElementById('total').textContent = subtotal;
}

// 確認訂單
function confirmOrder() {
    if (validateStep(3)) {
        // 儲存訂單資訊
        const orderInfo = {
            reservation: {
                people: document.querySelector('.form-group select')?.value,
                date: document.querySelector('input[type="date"]')?.value,
                timeSlot: document.querySelector('.form-group select:last-child')?.value
            },
            items: cart,
            total: document.getElementById('total').textContent
        };

        // 儲存訂單資訊到 localStorage (實際應用中應該發送到伺服器)
        localStorage.setItem('lastOrder', JSON.stringify(orderInfo));

        // 導向會員頁面
        window.location.href = 'member.html';
    }
}