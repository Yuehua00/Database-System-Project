// 菜單資料
// const menuItems = [
//     { id: 1, name: '香蒜培根義大利麵', price: 280 },
//     { id: 2, name: '奶油蘑菇義大利麵', price: 260 },
//     { id: 3, name: '番茄海鮮義大利麵', price: 320 },
//     { id: 4, name: '青醬雞肉義大利麵', price: 290 },
//     { id: 5, name: '臘腸番茄義大利麵', price: 270 },
//     { id: 6, name: '白酒蛤蠣義大利麵', price: 300 }
// ];


document.addEventListener("DOMContentLoaded", () => {
    console.log("DOMContentLoaded event triggered");
    const nextStepBtn = document.getElementById("nextStepBtn");
    console.log("Next step button found:", nextStepBtn);
    if (nextStepBtn) {
        console.log("here");
        nextStepBtn.addEventListener("click", async () => {
            const reservationForm = document.getElementById("reservationForm");
            const formData = new FormData(reservationForm);

            // 獲取用戶填寫的數據
            const numberOfPeople = formData.get('Number_of_People');
            const reservationTime = formData.get('Reservation_Time');
            const timeSlots = formData.get('TimeSlots');

            // 確認所有字段是否正確填寫
            if (!numberOfPeople || !reservationTime || !timeSlots) {
                alert("請填寫所有必填項目");
                return;
            }

            try {
                console.log("開始請求 /available_tables");
                // 查詢可用桌子
                const availableTablesResponse = await fetch(`/available_tables?people_count=${numberOfPeople}&reservation_time=${reservationTime}&time_slot=${timeSlots}`);
                if (!availableTablesResponse.ok) {
                    throw new Error(`HTTP error! status: ${availableTablesResponse.status}`);
                }

                const availableTablesResult = await availableTablesResponse.json();
                console.log("Available Tables Result Structure:", availableTablesResult);
                console.log("API 回應:", availableTablesResult); // 調試輸出
                if (availableTablesResult.status === 'success' && availableTablesResult.available_tables.length > 0) {
                    // 分配第一個可用桌號
                    const assignedTable = availableTablesResult.available_tables[0];
                    sessionStorage.setItem('Table_Number', assignedTable); // 儲存桌號到 sessionStorage

                    console.log("分配的桌號:", assignedTable);

                    // 進入下一步
                    document.getElementById('step1').classList.remove('active');
                    document.getElementById('step2').classList.add('active');
                } else {
                    alert("目前無可用桌，請重新選擇時間或人數。");
                }
            } catch (error) {
                console.error("查詢可用桌子時發生錯誤:", error);
                alert("查詢可用桌子時發生錯誤，請稍後再試。");
            }
        });
    }
    // 確認訂單按鈕的邏輯
    const confirmOrderButton = document.querySelector('.confirm-order');
    if (!confirmOrderButton) {
        console.error('找不到 .confirm-order 按鈕');
    }
    confirmOrderButton.addEventListener('click', async () => {
        const numberOfPeople = sessionStorage.getItem('Number_of_People');
        const reservationTime = sessionStorage.getItem('Reservation_Time');
        const timeSlots = sessionStorage.getItem('TimeSlots');
        const tableNumber = sessionStorage.getItem('Table_Number');
        const cartItems = cart;
        const customerId = await ensureCustomerID();
        // Debug 輸出提交數據
        console.log("Submitting reservation data:", {
            Customer_ID: customerId,
            Number_of_People: numberOfPeople,
            Reservation_Time: reservationTime,
            TimeSlots: timeSlots,
            Table_Number: tableNumber,
            Cart: cartItems,
        });
    
        // 檢查是否有缺少必要字段
        if (!numberOfPeople || !reservationTime || !timeSlots || !tableNumber || !customerId) {
            alert('請確認所有資訊已完整填寫。');
            return;
        }
    
        try {
            // 發送訂單數據
            const response = await fetch('/save_reservation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Customer_ID: customerId, 
                    Number_of_People: numberOfPeople,
                    Reservation_Time: reservationTime,
                    TimeSlots: timeSlots,
                    Table_Number: tableNumber,
                    Cart: cartItems,
                }),
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                alert('儲存訂單時發生錯誤，請稍後再試。');
                return;
            }
    
            const result = await response.json();
            if (result.status === 'success') {
                alert('訂位成功！');
                window.location.href = '/member';
            } else {
                alert(result.message || '儲存失敗，請稍後再試。');
            }
        } catch (error) {
            console.error('提交訂單時發生錯誤:', error);
            //alert('伺服器錯誤，請稍後再試。');
        }
    });
    
    
});
let menuItems = [];  // 定義 menuItems 變數
let cart = [];


// 更新菜單項目，從資料庫中抓取資料
function renderMenuItems() {
    const container = document.querySelector('.menu-selection');
    if (!container) {
        console.error('找不到 .menu-selection 容器');
        return;
    }
    // 渲染前清空舊內容
    container.innerHTML = '';
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
                                <p class="price">價格：NT$${item.price}</p>
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
        updateButtonStyle();
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
    document.querySelectorAll('.reservation-step').forEach(el => el.classList.remove('active'));
    document.getElementById(`step${step}`).classList.add('active');

    //隱藏所有步驟
    document.querySelectorAll('.reservation-step').forEach(el => {
        el.classList.remove('active');
        el.style.display = 'none';
    });    

    //顯示當前步驟
    const currentStep = document.getElementById(`step${step}`);
    currentStep.classList.add('active');
    currentStep.style.display = 'block';

    if (step === 3) {
        console.log("3");
        if (cart.length === 0) {
            alert("請選擇至少一項菜單！");
            moveToStep(2);
            return;
        }
        updateOrderSummary(); // 渲染第三步的數據
        //updateOrderSummary(); // 更新數據顯示
    }
    if (step === 2) {
        console.log("2");
        const numberOfPeople = document.querySelector('[name="Number_of_People"]').value;
        const reservationTime = document.querySelector('[name="Reservation_Time"]').value;
        const timeSlot = document.querySelector('[name="TimeSlots"]').value;
    
        // 存儲用餐資訊
        sessionStorage.setItem('Number_of_People', numberOfPeople);
        sessionStorage.setItem('Reservation_Time', reservationTime);
        sessionStorage.setItem('TimeSlots', timeSlot);
    
        console.log('Saved to sessionStorage:', {
            numberOfPeople,
            reservationTime,
            timeSlot,
        });
    }
    
    if (step === 1) {
        console.log("1");
        cart = []; // 僅在返回第一步時清空購物車
        renderCart();
    }
    // 更新進度條
    updateProgress(`step${step}`);
}


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

    // 更新畫面數量和樣式
    const menuItemElement = document.querySelector(`.menu-item[data-id="${itemId}"]`);
    if (menuItemElement) {
        const quantityElement = menuItemElement.querySelector('.quantity');
        const decreaseButton = menuItemElement.querySelector('.decrease');
        const increaseButton = menuItemElement.querySelector('.increase');
        const priceElement = menuItemElement.querySelector('.price'); // 找到價錢的元素

        const currentQuantity = cart.find(item => item.id === itemId)?.quantity || 0;
        quantityElement.textContent = currentQuantity;

        // 修改樣式
        if (currentQuantity >= 1) {
            menuItemElement.style.backgroundColor = '#fff3e6'; // 淺橘色背景
            menuItemElement.style.color = '#2c3e50'; // 深灰藍色文字
            decreaseButton.style.backgroundColor = '#e67e22'; // 原橘色按鈕
            decreaseButton.style.color = '#FFFFFF';
            increaseButton.style.backgroundColor = '#e67e22';
            increaseButton.style.color = '#FFFFFF';
            if (priceElement) {
                priceElement.style.color = '#27ae60';
            }
        } else {
            menuItemElement.style.backgroundColor = ''; // 還原背景
            menuItemElement.style.color = ''; // 還原文字顏色
            decreaseButton.style.backgroundColor = ''; // 還原按鈕背景
            decreaseButton.style.color = ''; // 還原按鈕文字顏色
            increaseButton.style.backgroundColor = ''; // 還原按鈕背景
            increaseButton.style.color = ''; // 還原按鈕文字顏色
            if (priceElement) {
                priceElement.style.color = ''; // 還原價錢顏色
            }
        }
    }

    // 渲染購物車
    renderCart();
}

// 更新按鈕與背景顏色
function updateButtonStyle() {
    const button = document.querySelector('.btn');
    const cartCount = document.querySelectorAll('.cart-item').length;

    if (cartCount >= 1) {
        button.classList.add('active');
    } else {
        button.classList.remove('active');
    }
}

// 每次購物車內容變更時執行
document.querySelector('.cart').addEventListener('change', updateButtonStyle);



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
    console.log('Number_of_People:', sessionStorage.getItem('Number_of_People'));
    console.log('Reservation_Time:', sessionStorage.getItem('Reservation_Time'));
    console.log('TimeSlots:', sessionStorage.getItem('TimeSlots'));
    console.log('Table_Number:', sessionStorage.getItem('Table_Number'));

    // 更新用餐人數
    const numberOfPeople = sessionStorage.getItem('Number_of_People') || '未指定';
    document.getElementById('summary-people').textContent = `用餐人數: ${numberOfPeople}`;

    // 更新用餐日期
    const reservationTime = sessionStorage.getItem('Reservation_Time') || '未指定';
    document.getElementById('summary-date').textContent = `用餐日期: ${reservationTime}`;

    // 更新用餐時段
    const timeSlot = sessionStorage.getItem('TimeSlots') || '未指定';
    document.getElementById('summary-time').textContent = `用餐時段: ${timeSlot}`;

    // 更新桌號（如果已選定）
    const tableNumber = sessionStorage.getItem('Table_Number') || '未指定';
    document.getElementById('summary-table').textContent = `桌號: ${tableNumber}`;
    
    // 更新購物車
    const cartSummary = document.getElementById('summary-items');
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
    document.getElementById('subtotal').textContent = subtotal;
    document.getElementById('total').textContent = subtotal;
}

function saveReservationData() {
    const numberOfPeople = document.querySelector('[name="Number_of_People"]').value;
    const reservationTime = document.querySelector('[name="Reservation_Time"]').value;
    const timeSlot = document.querySelector('[name="TimeSlots"]').value;
    const tableNumber = "A01"; // 示例桌號，可以根據實際分配的桌號修改

    // 保存數據到 sessionStorage
    sessionStorage.setItem('Number_of_People', numberOfPeople);
    sessionStorage.setItem('Reservation_Time', reservationTime);
    sessionStorage.setItem('TimeSlots', timeSlot);
    sessionStorage.setItem('Table_Number', tableNumber);
    console.log('Reservation data saved:', {
        numberOfPeople,
        reservationTime,
        timeSlot,
        tableNumber,
    });
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


async function ensureCustomerID() {
    let customerId = sessionStorage.getItem('Customer_ID');
    if (!customerId) {
        try {
            const response = await fetch('/get_customer_info', {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data.status === 'success') {
                customerId = data.Customer_ID;
                sessionStorage.setItem('Customer_ID', customerId); // 存入 sessionStorage
                console.log("Customer_ID 已更新:", customerId);
            } else {
                console.error("無法獲取顧客資訊:", data.message);
            }
        } catch (error) {
            console.error("獲取 Customer_ID 時發生錯誤:", error);
        }
    }
    return customerId;
}
document.addEventListener("DOMContentLoaded", async () => {
    const customerId = await ensureCustomerID();
    if (!customerId) {
        alert("無法獲取顧客資訊，請重新登入。");
    }
});




// 更新進度條邏輯
function updateProgress(stepId) {
    // 更新進度條
    const progressSteps = document.querySelectorAll('.progress-step');
    //progressSteps.forEach(step => step.classList.remove('active'));

    const stepMap = { 'step1': 0, 'step2': 1, 'step3': 2 };
    const stepIndex = stepMap[stepId] ?? -1;

    /*for (let i = 0; i <= stepIndex; i++) {
        progressSteps[i].classList.add('active');
    }*/
   // 移除所有步驟的 active 類
    progressSteps.forEach((step, index) => {
        step.classList.remove('active');
        if (index === stepIndex) {
            step.classList.add('active'); // 當前步驟加上 active 類
        }
    });

    // 更新相應的內容區塊
    const steps = document.querySelectorAll('.reservation-step');
    steps.forEach(step => step.classList.remove('active')); // 移除所有步驟的active類

    const currentStep = document.getElementById(stepId);
    if (currentStep) {
        currentStep.classList.add('active'); // 顯示當前步驟的section
    }
}

// 監聽 "繼續" 按鈕的點擊事件
document.getElementById('nextStepBtn').addEventListener('click', function() {
    // 根據data-next屬性獲取下一步
    const nextStep = this.getAttribute('data-next');
    const stepId = `step${nextStep}`; // 生成步驟的ID，例如 'step2'

    // 更新進度條和顯示相應的內容區塊
    updateProgress(stepId);

    // 更新下一步的data-next屬性
    const nextStepBtn = document.getElementById('nextStepBtn');
    const nextStepValue = parseInt(nextStep) + 1; // 增加1，進入下一步
    if (nextStepValue <= 3) {
        nextStepBtn.setAttribute('data-next', nextStepValue);
    } else {
        nextStepBtn.disabled = true; // 如果已經是最後一步，禁用按鈕
    }
});

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
        const tableNumber = sessionStorage.getItem('Table_Number') || '未指定';
        if (!tableNumber) {
            console.error('Table_Number 未分配');
            alert('桌號尚未分配，請重新選擇時間或人數。');
            return;
        }
        const cartItems = cart || [];

        // Debug 輸出提交數據
        console.log("Submitting reservation data:", {
            Number_of_People: numberOfPeople,
            Reservation_Time: reservationTime,
            TimeSlots: timeSlots,
            Table_Number: tableNumber,
            Cart: cartItems,
        });
        const customerID = sessionStorage.getItem('Customer_ID');
        if (!customerID) {
            alert("請先登入");
            return;
        }
        const saveReservationResponse = await fetch('/save_reservation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Customer_ID: customerID,
                Number_of_People: numberOfPeople,
                Reservation_Time: reservationTime,
                TimeSlots: timeSlots,
                Table_Number: tableNumber || '未指定',
                Cart: cartItems || [], // 確保 Cart 是數組
            }),
        });
    
        console.log("提交數據:", {
            Number_of_People: numberOfPeople,
            Reservation_Time: reservationTime,
            TimeSlots: timeSlots,
            Table_Number: tableNumber,
            Cart: cartItems || [],
        });

        if (!saveReservationResponse.ok) {
            const errorText = await saveReservationResponse.text();
            console.error('Error response:', errorText);
            //alert('提交訂單時發生錯誤，請檢查您的輸入資訊並稍後再試。');
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


// 當數量改變時
if (quantity > 0) {
    menuCard.classList.add('selected');
} else {
    menuCard.classList.remove('selected');
}