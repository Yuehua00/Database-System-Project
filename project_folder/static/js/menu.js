// // 選單圖示點擊事件
// document.querySelector('.menu-icon').addEventListener('click', function() {
//     this.classList.toggle('active');
//     document.querySelector('.dropdown-menu').classList.toggle('active');
// });

// // 點擊其他地方關閉選單
// document.addEventListener('click', function(e) {
//     if (!e.target.closest('.menu-icon') && !e.target.closest('.dropdown-menu')) {
//         document.querySelector('.menu-icon').classList.remove('active');
//         document.querySelector('.dropdown-menu').classList.remove('active');
//     }
// });

// // 菜單卡片點擊展開/收合
// // document.addEventListener('DOMContentLoaded', () => {
    
// // });

// document.addEventListener('DOMContentLoaded', () => {
//     const menuContainer = document.getElementById('menu-container'); 

//     if (!menuContainer) {
//         console.error('Error: No element with class "menu-container" found in the DOM.');
//         return;
//     }

//     fetch('/get_pre_menu')
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             return response.json();
//         })
//         .then(data => {
//             if (data.status === 'success') {
//                 renderMenu(data.menu); // 渲染菜單
//             } else {
//                 console.error('Error in response data:', data.message);
//             }
//         })
//         .catch(error => {
//             console.error('Error fetching menu:', error);
//         });
        

//     function renderMenu(menu) {
//         menuContainer.innerHTML = '';
//         menu.forEach(item => {
//             const nutritionInfo = item.nutrition
//                 .map(n => `${n.name}: ${n.amount}${n.unit}`)
//                 .join(', ');

//             const dishHTML = `
//                 <article class="menu-card">
//                     <div class="menu-preview">
//                         <img src="static/images/主餐/${item.image}" alt="${item.name}">
//                         <h3>${item.name}</h3>
//                     </div>
//                     <div class="menu-details">
//                         <div class="menu-content">
//                             <p class="price">NT$ ${item.price}</p>
//                             <div class="nutrition">
//                                 <h4>營養標示</h4>
//                                 <p>${nutritionInfo}</p>
//                             </div>
//                             <textarea class="review-input" placeholder="留下您的評論..."></textarea>
//                             <button class="submit-review btn">提交評論</button>
//                             <div class="reviews">
//                                 <h4>顧客評論</h4>
//                                 <div class="review-item">
//                                     <p class="review-text">「${item.review || "尚無評論"}」</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </article>
//             `;
//             menuContainer.innerHTML += dishHTML;
//         });
//     }
//     const cards = document.querySelectorAll('.menu-card');
    
//     cards.forEach(card => {
//         card.addEventListener('click', (e) => {
//             // 如果點擊的是評論框或提交按鈕，阻止卡片的展開/收合
//             if (e.target.closest('.review-input') || e.target.closest('.submit-review')) {
//                 return;
//             }

//             // 先移除其他卡片的 active 狀態
//             cards.forEach(c => {
//                 if (c !== card) {
//                     c.classList.remove('active');
//                 }
//             });
            
//             // 切換當前卡片的狀態
//             card.classList.toggle('active');
//         });
//     });

// });


// // 登入/註冊頁面標籤切換
// document.querySelectorAll('.auth-tab').forEach(tab => {
//     tab.addEventListener('click', function() {
//         // 移除所有標籤的啟用狀態
//         document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
//         // 移除所有表單的啟用狀態
//         document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
        
//         // 啟用被點擊的標籤
//         this.classList.add('active');
//         // 啟用對應的表單
//         const formId = this.getAttribute('data-form');
//         document.getElementById(formId).classList.add('active');
//     });
// });

// 選單圖示點擊事件
document.querySelector('.menu-icon').addEventListener('click', function() {
    this.classList.toggle('active');
    document.querySelector('.dropdown-menu').classList.toggle('active');
});

// 點擊其他地方關閉選單
document.addEventListener('click', function(e) {
    if (!e.target.closest('.menu-icon') && !e.target.closest('.dropdown-menu')) {
        document.querySelector('.menu-icon').classList.remove('active');
        document.querySelector('.dropdown-menu').classList.remove('active');
    }
});


// 菜單卡片點擊展開/收合
document.addEventListener('DOMContentLoaded', () => {
    const menuContainer = document.getElementById('menu-container'); 

    if (!menuContainer) {
        console.error('Error: No element with ID "menu-container" found in the DOM.');
        return;
    }

    fetch('/get_pre_menu')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Menu data:", data);
            if (data.status === 'success') {
                renderMenu(data.menu); // 渲染菜單
            } else {
                console.error('Error in response data:', data.message);
            }
        })
        .catch(error => {
            console.error('Error fetching menu:', error);
        });

        // function renderMenu(menu) {
        //     menuContainer.innerHTML = '';
        //     menu.forEach(item => {
        //         const nutritionInfo = item.nutrition
        //             .map(n => {
        //                 // Ensure name, amount, and unit are defined
        //                 const nutrientName = n.name || 'Unknown';
        //                 const nutrientAmount = n.amount || 0;
        //                 const nutrientUnit = n.unit || '';
        //                 return `${nutrientName}: ${nutrientAmount}${nutrientUnit}`;
        //             })
        //             .join(', ');
        
        //         const dishHTML = `
        //             <article class="menu-card">
        //                 <div class="menu-preview">
        //                     <img src="/static/images/dish/${item.id}.jpg" alt="${item.name}">
        //                     <h3>${item.name}</h3>
        //                 </div>
        //                 <div class="menu-details">
        //                     <div class="menu-content">
        //                         <p class="price" style="color:blue;">NT$ ${item.price}</p>
        //                         <div class="nutrition">
        //                             <h4>營養標示</h4>
        //                             ${nutritionInfo ? `<p>營養成分: ${nutritionInfo}</p>` : ''}
        //                         </div>
        //                         <textarea class="review-input" placeholder="留下您的評論..."></textarea>
        //                         <button class="submit-review btn">提交評論</button>
        //                         <div class="reviews">
        //                             <h4>顧客評論</h4>
        //                             <div class="review-item">
        //                                 <p class="review-text">「${item.review || "尚無評論"}」</p>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </article>
        //         `;
        //         menuContainer.innerHTML += dishHTML;
        //     });
        
        //     const cards = document.querySelectorAll('.menu-card');
        //     cards.forEach(card => {
        //         card.addEventListener('click', (e) => {
        //             if (e.target.closest('.review-input') || e.target.closest('.submit-review')) {
        //                 return;
        //             }
        //             cards.forEach(c => {
        //                 if (c !== card) {
        //                     c.classList.remove('active');
        //                 }
        //             });
        //             card.classList.toggle('active');
        //         });
        //     });
        // }
        function renderMenu(menu) {
            const menuContainer = document.getElementById('menu-container');
            menuContainer.innerHTML = '';
            menu.forEach(item => {
                // 修正營養數據字段
                const nutritionInfo = item.nutrition
                    .map(n => {
                        // 判斷數據格式是否錯位
                        const isNameNumeric = !isNaN(parseFloat(n.name));
                        const nutrientName = isNameNumeric ? n.amount : n.name;
                        const nutrientAmount = isNameNumeric ? n.name : n.amount;
                        const nutrientUnit = n.unit || '';
                        return `${nutrientName}: ${nutrientAmount}${nutrientUnit}`;
                    })
                    .join(', ');
        
                const dishHTML = `
                    <article class="menu-card">
                        <div class="menu-preview">
                            <img src="/static/images/dish/${item.id}.jpg" alt="${item.name}">
                            <h3>${item.name}</h3>
                        </div>
                        <div class="menu-details">
                            <div class="menu-content">
                                <p class="price" style="color:blue;">NT$ ${item.price}</p>
                                <div class="nutrition">
                                    <h4>營養標示</h4>
                                    ${nutritionInfo ? `<p>營養成分: ${nutritionInfo}</p>` : ''}
                                </div>
                                <textarea class="review-input" placeholder="留下您的評論..."></textarea>
                                <button class="submit-review btn">提交評論</button>
                                <div class="reviews">
                                    <h4>顧客評論</h4>
                                    <div class="review-item">
                                        <p class="review-text">「${item.review || "尚無評論"}」</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>
                `;
                menuContainer.innerHTML += dishHTML;
            });
        
            const cards = document.querySelectorAll('.menu-card');
            cards.forEach(card => {
                card.addEventListener('click', (e) => {
                    if (e.target.closest('.review-input') || e.target.closest('.submit-review')) {
                        return;
                    }
                    cards.forEach(c => {
                        if (c !== card) {
                            c.classList.remove('active');
                        }
                    });
                    card.classList.toggle('active');
                });
            });
        }
        
});

// 登入/註冊頁面標籤切換
document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        // 移除所有標籤的啟用狀態
        document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        // 移除所有表單的啟用狀態
        document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));

        // 啟用被點擊的標籤
        this.classList.add('active');
        // 啟用對應的表單
        const formId = this.getAttribute('data-form');
        document.getElementById(formId).classList.add('active');
    });
});
