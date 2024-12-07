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
let cart = [];

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
        container.innerHTML = '<p>請先選擇用餐時段。</p>';
        return;
    }

    fetch(`/get_menu?timeSlot=${timeSlot}`)
    .then(response => response.json())
    .then(menuItemsData => {
        menuItems = menuItemsData.menu; // 確保這裡更新全域變數
        if (Array.isArray(menuItems)) {
            const groupedMenu = menuItems.reduce((acc, item) => {
                if (!acc[item.category]) {
                    acc[item.category] = [];
                }
                acc[item.category].push(item);
                return acc;
            }, {});

            container.innerHTML = Object.entries(groupedMenu).map(([category, items]) => `
                <div class="menu-category">
                    <h2>${category}</h2>
                    <div class="menu-items">
                        ${items.map(item => `
                            <div class="menu-item" data-id="${item.id}">
                                <h3>${item.name}</h3>
                                <p>價格：NT$${item.price}</p>
                                <div class="quantity-control">
                                    <button class="quantity-btn decrease" data-id="${item.id}" data-change="-1">-</button>
                                    <span class="quantity">0</span>
                                    <button class="quantity-btn increase" data-id="${item.id}" data-change="1">+</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('');

        } else {
            console.error('菜單格式錯誤:', menuItemsData);
        }
    })
    .catch(error => console.error('獲取菜單失敗:', error));

}




document.addEventListener('DOMContentLoaded', () => {
    console.log('Menu items:', menuItems);
    const timeSlotElement = document.querySelector('#TimeSlots');
    if (timeSlotElement) {
        timeSlotElement.addEventListener('change', renderMenuItems);
    }

    const container = document.querySelector('.menu-selection');
    if (container) {
        container.addEventListener('click', event => {
            if (event.target.classList.contains('quantity-btn')) {
                const menuItemElement = event.target.closest('.menu-item');
                const itemId = parseInt(menuItemElement.dataset.id, 10);
                const change = event.target.classList.contains('increase') ? 1 : -1;
                console.log(`Item clicked: ${itemId}, Change: ${change}`);
                updateCart(itemId, change); // 呼叫更新購物車
                console.log('Cart after update:', cart);
            }
        });
    }
    renderCart(); // 渲染初始購物車
    fetch('/get_customer_info', {
        method: 'GET',
        credentials: 'include' // 確保請求攜帶 Cookie
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                console.log('顧客資料:', data);
                document.getElementById('summary-name').textContent = `姓名: ${data.name}`;
                document.getElementById('summary-phone').textContent = `電話: ${data.phone}`;
            } else {
                console.error('無法獲取顧客資料:', data.message);
                alert('無法取得顧客資訊，請檢查您的登入狀態。');
            }
        })
        .catch(error => console.error('錯誤:', error));
    
    
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
    switch (step) {
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
            // if (cart.length === 0) {
            //     alert('請選擇至少一項品項');
            //     return false;
            // }
            return true;

        default:
            return true;
    }
}


// 切換步驟
function moveToStep(step) {
    document.querySelectorAll('.reservation-step').forEach(el => {
        el.classList.remove('active');
        el.style.display = 'none';
    });

    const currentStep = document.getElementById(`step${step}`);
    currentStep.classList.add('active');
    currentStep.style.display = 'block';

    if (step === 3) {
        if (cart.length === 0) {
            alert("請選擇至少一項菜單！");
            moveToStep(2);
            return;
        }
        updateOrderSummary(); // 渲染第三步的數據
    }

    if (step === 1) {
        cart = []; // 僅在返回第一步時清空購物車
        renderCart();
    }
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

// 初始化購物車為空陣列


// 更新購物車邏輯
function updateCart(itemId, change) {
    const menuItem = menuItems.find(item => item.id === itemId);
    if (!menuItem) return;

    const existingItem = cart.find(item => item.id === itemId);

    if (existingItem) {
        existingItem.quantity += change; // 增加或減少數量
        if (existingItem.quantity <= 0) {
            cart = cart.filter(item => item.id !== itemId); // 刪除數量為 0 的項目
        }
    } else if (change > 0) {
        cart.push({
            id: menuItem.id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: 1,
        });
    }

    // 更新畫面數量
    const quantityElement = document.querySelector(`.menu-item[data-id="${itemId}"] .quantity`);
    if (quantityElement) {
        quantityElement.textContent = cart.find(item => item.id === itemId)?.quantity || 0;
    }

    // 渲染購物車
    renderCart();
}




// 渲染購物車
function renderCart() {
    const cartContainer = document.querySelector('.cart-items');
    if (!cartContainer) {
        console.error('找不到 .cart-items 容器');
        return;
    }

    cartContainer.innerHTML = cart.length > 0
        ? cart.map(item => `
            <div class="cart-item">
                <span>${item.name} x ${item.quantity}</span>
                <span>NT$ ${item.price * item.quantity}</span>
            </div>
          `).join('')
        : '<p>購物車目前沒有任何項目。</p>';
}



// 綁定事件
// document.addEventListener('DOMContentLoaded', () => {
//     const container = document.querySelector('.menu-selection');
//     if (container) {
//         container.addEventListener('click', event => {
//             if (event.target.classList.contains('quantity-btn')) {
//                 const itemId = parseInt(event.target.closest('.menu-item').dataset.id, 10);
//                 const change = event.target.classList.contains('increase') ? 1 : -1;
//                 updateCart(itemId, change);
//             }
//         });
//     }
// });



// function renderCart() {
//     const cartContainer = document.querySelector('.cart-items');
//     if (!cartContainer) {
//         console.error('找不到 .cart-items 容器');
//         return;
//     }

//     cartContainer.innerHTML = ''; // 清空現有內容

//     if (cart.length === 0) {
//         cartContainer.innerHTML = '<p>購物車目前沒有任何項目。</p>';
//         return;
//     }

//     cart.forEach(item => {
//         const cartItem = `
//             <div class="cart-item">
//                 <span>${item.name} x ${item.quantity}</span>
//                 <span>NT$ ${item.price * item.quantity}</span>
//             </div>
//         `;
//         cartContainer.innerHTML += cartItem;
//     });
// }


function submitOrder() {
    // 過濾掉數量為 0 的項目
    const order = Object.entries(selectedItems)
        .filter(([id, quantity]) => quantity > 0)
        .map(([id, quantity]) => ({ id: Number(id), quantity }));

    if (order.length === 0) {
        // alert("請選擇至少一項菜單！");
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
    // 顯示顧客資訊
    const customerName = sessionStorage.getItem('Customer_name') || '未指定';
    const customerPhone = sessionStorage.getItem('Customer_phone') || '未指定';

    document.querySelector('#summary-name').textContent = `姓名: ${customerName}`;
    document.querySelector('#summary-phone').textContent = `電話: ${customerPhone}`;

    // 渲染購物車內容
    const cartSummary = document.querySelector('#summary-items');
    if (cartSummary) {
        cartSummary.innerHTML = cart.length > 0
            ? cart.map(item => `
                <div class="cart-item">
                    <span>${item.name} x ${item.quantity}</span>
                    <span>NT$ ${item.price * item.quantity}</span>
                </div>
            `).join('')
            : '<p>購物車目前沒有任何項目。</p>';
    }

    // 更新總金額
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.querySelector('#subtotal').textContent = subtotal;
    document.querySelector('#total').textContent = subtotal;
}


// 呼叫此函式於切換到第三步時



// Fetch customer information and update on the page
// function fetchCustomerInfo() {
//     fetch('/get_customer_info', {
//         credentials: 'include' // 確保攜帶 cookie
//     })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             return response.json();
//         })
//         .then(data => {
//             console.log(data.name);
//             console.log(data.phone);
//             if (data.status === 'success') {
//                 document.getElementById('customer-name').textContent = data.name;
//                 document.getElementById('customer-phone').textContent = data.phone;
//             } else {
//                 console.error('無法獲取顧客資料:', data.message);
//                 alert('請登入以繼續。');
//             }
//         })

// }

// 在第三步顯示顧客資料及購物車內容
function updateOrderSummary() {
    // 顯示顧客資訊
    //fetchCustomerInfo();

    // 顯示訂單明細
    const summaryItems = document.getElementById('summary-items');
    const customerDetails = document.getElementById('customer-details');

    if (summaryItems) {
        summaryItems.innerHTML = cart.map(item => `
            <div class="summary-item">
                <span>${item.name} x ${item.quantity}</span>
                <span>NT$ ${item.price * item.quantity}</span>
            </div>
        `).join('');
    }

    // 總金額
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('subtotal').textContent = subtotal;
    document.getElementById('total').textContent = subtotal;
}



document.addEventListener('DOMContentLoaded', function() {
    const nextStepBtn = document.getElementById('nextStepBtn');
    const progressSteps = document.querySelectorAll('.progress-step');
    const reservationSteps = document.querySelectorAll('.reservation-step');
    let currentStep = 0;

    fetch('/get_customer_info', {
        method: 'GET',
        credentials: 'include', // 確保攜帶 Cookie
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            document.getElementById('summary-name').textContent = `姓名: ${data.name}`;
            document.getElementById('summary-phone').textContent = `電話: ${data.phone}`;
        } else {
            console.error('無法獲取顧客資料:', data.message);
            alert('無法取得顧客資訊，請檢查您的登入狀態。');
        }
    })
    .catch(error => console.error('錯誤:', error));

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
// 繼續按鈕的事件處理程序
document.addEventListener('DOMContentLoaded', () => {
    const customerName = localStorage.getItem('Customer_name') || '未指定';
    const customerPhone = localStorage.getItem('Customer_phone') || '未指定';
    document.querySelectorAll('.btn.next-step').forEach(button => {
        button.addEventListener('click', function () {
            const currentStep = document.querySelector('.reservation-step.active');

            if (currentStep.id === 'step1') {
                // 從第一步到第二步，直接跳轉
                moveToStep(2);
            } else if (currentStep.id === 'step2' && this.getAttribute('data-next') === '3') {
                // 檢查購物車是否為空
                if (cart.length === 0) {
                    alert("請選擇至少一項菜單！");
                    return; // 停止執行，防止跳轉到第三步
                }
                // 從第二步到第三步
                moveToStep(3);
            }
        });
    });

    document.querySelectorAll('.btn.prev-step').forEach(button => {
        button.addEventListener('click', function () {
            const currentStep = document.querySelector('.reservation-step.active');
            if (currentStep.id === 'step2') {
                // 從第二步返回第一步
                moveToStep(1);
            } else if (currentStep.id === 'step3') {
                // 從第三步返回第二步
                moveToStep(2);
            }
        });
    });
});




// 更新進度條邏輯
function updateProgress(stepId) {
    const progressSteps = document.querySelectorAll('.progress-step');
    progressSteps.forEach(step => step.classList.remove('active'));

    // 根據當前步驟更新進度條
    const stepIndex = stepId === 'step1' ? 0 : stepId === 'step2' ? 1 : 2;
    for (let i = 0; i <= stepIndex; i++) {
        progressSteps[i].classList.add('active');
    }
}

document.getElementById("nextStepBtn").addEventListener("click", async () => {
    const reservationForm = document.getElementById("reservationForm");
    const formData = new FormData(reservationForm);

    const numberOfPeople = formData.get('Number_of_People');
    const reservationTime = formData.get('Reservation_Time');
    const timeSlots = formData.get('TimeSlots');

    if (!numberOfPeople || !reservationTime || !timeSlots) {
        alert("請確保已填寫所有必填欄位.");
        return;
    }

    try {
        const saveReservationResponse = await fetch('/save_reservation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Number_of_People: numberOfPeople,
                Reservation_Time: reservationTime,
                TimeSlots: timeSlots,
            }),
        });
    
        if (!saveReservationResponse) {
            console.error('saveReservationResponse is undefined.');
            alert('未能收到伺服器響應，請稍後重試。');
            return;
        }
    
        console.log('saveReservationResponse:', saveReservationResponse);
    
        if (!saveReservationResponse.ok) {
            const errorText = await saveReservationResponse.text();
            console.error('Error response from server:', errorText);
            throw new Error(`HTTP error! status: ${saveReservationResponse.status}`);
        }
    
        const saveReservationResult = await saveReservationResponse.json();
        console.log('saveReservationResult:', saveReservationResult);
    
        if (saveReservationResult.status === 'success') {
            document.getElementById('step1').classList.remove('active');
            document.getElementById('step2').classList.add('active');
        } else {
            alert(saveReservationResult.message || '提交訂位信息時發生錯誤。');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('查询或提交订位信息时发生错误。');
    }
    
    
});
