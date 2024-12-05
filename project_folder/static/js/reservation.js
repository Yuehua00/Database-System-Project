// 菜單資料
// const menuItems = [
//     { id: 1, name: '香蒜培根義大利麵', price: 280 },
//     { id: 2, name: '奶油蘑菇義大利麵', price: 260 },
//     { id: 3, name: '番茄海鮮義大利麵', price: 320 },
//     { id: 4, name: '青醬雞肉義大利麵', price: 290 },
//     { id: 5, name: '臘腸番茄義大利麵', price: 270 },
//     { id: 6, name: '白酒蛤蠣義大利麵', price: 300 }
// ];
let menuItems = [];  // 定義 menuItems 變數

// 更新菜單項目，從資料庫中抓取資料
function renderMenuItems() {
    const container = document.querySelector('.menu-selection');
    if (!container) {
        console.error('找不到 .menu-selection 容器');
        return;
    }

    const timeSlotElement = document.querySelector('#TimeSlots');
    const timeSlot = timeSlotElement ? timeSlotElement.value.trim() : null;

    if (!timeSlot) {
        console.log('尚未選擇時段');
        container.innerHTML = '<p>請先選擇用餐時段。</p>';
        return;
    }

    fetch(`/get_menu?timeSlot=${timeSlot}`)
        .then(response => response.json())
        .then(menuItems => {
            const menuData = menuItems.menu;

            if (Array.isArray(menuData)) {
                // 按 Category 分組
                const groupedMenu = menuData.reduce((acc, item) => {
                    if (!acc[item.category]) {
                        acc[item.category] = [];
                    }
                    acc[item.category].push(item);
                    return acc;
                }, {});

                // 渲染分組菜單
                container.innerHTML = Object.entries(groupedMenu).map(([category, items]) => `
                    <div class="menu-category">
                        <h2>${category}</h2>
                        <div class="menu-items">
                            ${items.map(item => `
                                <div class="menu-item" data-id="${item.id}">
                                    <h3>${item.name}</h3>
                                    <p>NT$ ${item.price}</p>
                                    <div class="quantity-control">
                                        <button class="quantity-btn decrease" onclick="updateCart(${item.id}, -1)">-</button>
                                        <span class="quantity">0</span>
                                        <button class="quantity-btn increase" onclick="updateCart(${item.id}, 1)">+</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <hr class="category-divider">
                    </div>
                `).join('');
            } else {
                console.error('menuItems.menu 不是陣列:', menuItems);
                container.innerHTML = '<p>菜單載入失敗。</p>';
            }
        })
        .catch(error => {
            console.error('無法獲取菜單資料:', error);
            container.innerHTML = '<p>無法載入菜單，請稍後再試。</p>';
        });
}


document.addEventListener('DOMContentLoaded', () => {
    const timeSlotElement = document.querySelector('#TimeSlots');
    if (timeSlotElement) {
        timeSlotElement.addEventListener('change', renderMenuItems);
    }
});



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
                // alert('請填寫所有必要資訊');
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

// // 渲染菜單項目
// function renderMenuItems() {
//     const container = document.querySelector('.menu-selection');
//     if (container) {
//         container.innerHTML = menuItems.map(item => `
//             <div class="menu-item" data-id="${item.id}">
//                 <div class="menu-item-header">
//                     <div>
//                         <h3>${item.name}</h3>
//                         <p class="price">NT$ ${item.price}</p>
//                     </div>
//                     <div class="quantity-control">
//                         <button class="quantity-btn decrease" onclick="updateCart(${item.id}, -1)">-</button>
//                         <span class="quantity">0</span>
//                         <button class="quantity-btn increase" onclick="updateCart(${item.id}, 1)">+</button>
//                     </div>
//                 </div>
//             </div>
//         `).join('');
//     }
// }

// 更新購物車
// function updateCart(itemId, change) {
//     const item = menuItems.find(i => i.id === itemId);
//     const existingItem = cart.find(i => i.id === itemId);
    
//     if (existingItem) {
//         existingItem.quantity += change;
//         if (existingItem.quantity <= 0) {
//             cart = cart.filter(i => i.id !== itemId);
//         }
//     } else if (change > 0) {
//         cart.push({
//             id: itemId,
//             name: item.name,
//             price: item.price,
//             quantity: 1
//         });
//     }

//     updateCartDisplay();
// }
function updateCart(itemId, change) {
    // 檢查該餐點是否已在購物車中
    if (!cart[itemId]) {
        cart[itemId] = 0; // 如果不存在，初始化數量為 0
    }

    // 更新數量，並確保數量不低於 0
    cart[itemId] = Math.max(cart[itemId] + change, 0);

    // 更新數量顯示
    const quantityElement = document.querySelector(`.menu-item[data-id="${itemId}"] .quantity`);
    if (quantityElement) {
        quantityElement.textContent = cart[itemId];
    }

    // 更新購物車顯示
    renderCart();
}

function renderCart() {
    const cartContainer = document.querySelector('.cart-items');
    cartContainer.innerHTML = ''; // 清空現有的購物車內容

    Object.keys(cart).forEach(itemId => {
        if (cart[itemId] > 0) { // 只顯示數量大於 0 的項目
            const item = menuItems.find(menuItem => menuItem.id == itemId); // 假設 menuItems 是菜單資料
            const cartItem = `
                <div class="cart-item">
                    <span>${item.name}</span>
                    <span>數量: ${cart[itemId]}</span>
                </div>
            `;
            cartContainer.innerHTML += cartItem;
        }
    });
}


function submitOrder() {
    // 過濾掉數量為 0 的項目
    const order = Object.entries(selectedItems)
        .filter(([id, quantity]) => quantity > 0)
        .map(([id, quantity]) => ({ id: Number(id), quantity }));

    if (order.length === 0) {
        alert("請選擇至少一項菜單！");
        return;
    }

    // 將資料送到伺服器
    fetch('/submit_order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('訂單送出成功！');
            selectedItems = {}; // 清空選擇資料
            document.querySelectorAll('.quantity').forEach(el => el.textContent = 0); // 重置數量顯示
        } else {
            alert('訂單送出失敗，請稍後再試！');
        }
    })
    .catch(error => {
        console.error('訂單送出失敗:', error);
        alert('伺服器錯誤，請稍後再試！');
    });
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

document.addEventListener('DOMContentLoaded', function() {
    const nextStepBtn = document.getElementById('nextStepBtn');
    const progressSteps = document.querySelectorAll('.progress-step');
    const reservationSteps = document.querySelectorAll('.reservation-step');
    let currentStep = 0;

    nextStepBtn.addEventListener('click', function() {
        // 驗證當前步驟的表單
        const currentStepElement = reservationSteps[currentStep];
        const inputs = currentStepElement.querySelectorAll('input, select');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value) {
                isValid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });

        if (isValid) {
            // 移除當前步驟的 active 狀態
            progressSteps[currentStep].classList.remove('active');
            reservationSteps[currentStep].classList.remove('active');

            // 移動到下一步
            currentStep++;

            // 添加下一步的 active 狀態
            progressSteps[currentStep].classList.add('active');
            reservationSteps[currentStep].classList.add('active');
        }
    });
});


// 繼續按鈕
document.querySelectorAll('.btn.next-step').forEach(button => {
    button.addEventListener('click', function () {
        const nextStep = this.getAttribute('data-next');  // 獲取下一步驟
        const currentStep = document.querySelector('.reservation-step.active');  // 當前步驟

        // 隱藏當前步驟
        currentStep.classList.remove('active');

        // 顯示下一個步驟
        const stepToShow = document.getElementById('step' + nextStep);
        stepToShow.classList.add('active');

        // 更新進度條
        const progressSteps = document.querySelectorAll('.progress-step');
        progressSteps.forEach(step => {
            step.classList.remove('active');
        });
        document.querySelector(`.progress-step[data-step="${nextStep}"]`).classList.add('active');
    });
});

// 返回按鈕
document.querySelectorAll('.btn.prev-step').forEach(button => {
    button.addEventListener('click', function () {
        const prevStep = this.getAttribute('data-prev');  // 獲取上一個步驟
        const currentStep = document.querySelector('.reservation-step.active');  // 當前步驟

        // 隱藏當前步驟
        currentStep.classList.remove('active');

        // 顯示上一個步驟
        const stepToShow = document.getElementById('step' + prevStep);
        stepToShow.classList.add('active');

        // 更新進度條
        const progressSteps = document.querySelectorAll('.progress-step');
        progressSteps.forEach(step => {
            step.classList.remove('active');
        });
        document.querySelector(`.progress-step[data-step="${prevStep}"]`).classList.add('active');
    });
});
document.getElementById("nextStepBtn").addEventListener("click", async () => {
    const reservationForm = document.getElementById("reservationForm");
    const formData = new FormData(reservationForm);

    const numberOfPeople = formData.get('Number_of_People');
    const reservationTime = formData.get('Reservation_Time');
    const timeSlots = formData.get('TimeSlots');

    if (!numberOfPeople || !reservationTime || !timeSlots) {
        alert("Please fill in all required fields.");
        return;
    }

    try {
        const response = await fetch('/save_reservation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Number_of_People: numberOfPeople,
                Reservation_Time: reservationTime,
                TimeSlots: timeSlots
            }),
        });

        const result = await response.json();

        if (response.ok && result.status === 'success') {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error submitting reservation:', error);
        alert('An error occurred. Please try again later.');
    }
});
