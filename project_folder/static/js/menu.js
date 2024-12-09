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

// document.addEventListener('click', (event) => {
//     if (event.target.matches('.submit-review')) {
//         const reviewInput = event.target.previousElementSibling.value;
//         const dishId = event.target.closest('.menu-card').dataset.id;

//         if (!reviewInput) {
//             alert('請輸入評論內容');
//             return;
//         }

//         fetch('/submit_comment', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 dish_id: dishId,
//                 comment: reviewInput,
//                 star: parseInt(starRating, 10)
//             })         })
//         .then(res => res.json())
//         .then(data => {
//             if (data.status === 'success') {
//                 alert('評論已提交');
//                 // 重新調用 API 以獲取更新後的評論
//                 fetch('/get_pre_menu')
//                     .then(response => response.json())
//                     .then(data => renderMenu(data.menu));
//             } else {
//                 alert('提交失敗: ' + data.message);
//             }
//         })
//         .catch(err => console.error('評論提交錯誤:', err));
//     }
// });

// 定義缺失的函數 attachReviewEvents
function attachReviewEvents() {
    document.querySelectorAll('.submit-review').forEach(button => {
        button.addEventListener('click', async (e) => {
            const dishId = button.getAttribute('data-id');
            const reviewInput = button.previousElementSibling.value.trim();
            const starSelect = button.previousElementSibling.previousElementSibling;
            const starRating = starSelect.value;

            if (!reviewInput) {
                alert('評論內容不得為空！');
                return;
            }

            if (!starRating) {
                alert('請選擇評分！');
                return;
            }

            try {
                const response = await fetch('/submit_comment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        dish_id: dishId,
                        comment: reviewInput,
                        star: starRating,
                    }),
                });

                const result = await response.json();
                if (result.status === 'success') {
                    alert('評論提交成功！');
                    location.reload(); // 重新加载页面以更新评论
                } else {
                    alert(result.message || '提交失敗，請稍後再試。');
                }
            } catch (error) {
                console.error('提交評論时出錯:', error);
                alert('提交失敗，請稍後再試。');
            }
        });
    });
}

// 修改 renderMenu 函數以確保正確處理評論資料
function renderMenu2(menu) {
    const menuContainer = document.getElementById('menu-container');
    menuContainer.innerHTML = '';

    menu.forEach(item => {
        const nutritionInfo = (item.nutrition || [])
            .map(n => `<div>${n.name || '未知'} : ${n.amount || 0} ${n.unit || ''}</div>`)
            .join('') || '<p>尚無營養資訊</p>';

        const comments = item.comments || [];
        const firstComment = comments.length > 0 
            ? `<p>${comments[0].content || "無內容"}</p>
               <p>星級: ${comments[0].star || "無"}</p>
               <p>${comments[0].time || ""}</p>` 
            : '<p class="review-text">尚無評論</p>';

        const moreComments = comments.slice(1).map(comment => `
            <div class="review-item">
                <p class="review-text">${comment.content || '無內容'}</p>
                <p class="review-star">星級: ${comment.star || '無'}</p>
                <p class="review-time">${comment.time || ''}</p>
            </div>
        `).join('');

        const dishHTML = `
            <article class="menu-card" data-id="${item.id}">
                <div class="menu-preview">
                    <img src="/static/images/dish/${item.id}.jpg" alt="${item.name}" style="margin: 0 auto; display: block;">
                    <h3>${item.name}</h3>
                </div>
                <div class="menu-details">
                    <div class="menu-content">
                        <p class="price" style="color:orange;">NT$ ${item.price}</p>
                        <div class="nutrition">
                            <h4>營養成分:</h4>
                            ${nutritionInfo}
                        </div>
                        <textarea class="review-input" placeholder="留下您的評論..."></textarea>
                        <select class="star-input">
                            <option value="" disabled selected>請選擇評分</option>
                            <option value="1">1 星</option>
                            <option value="2">2 星</option>
                            <option value="3">3 星</option>
                            <option value="4">4 星</option>
                            <option value="5">5 星</option>
                        </select>
                        <button class="submit-review btn" data-id="${item.id}">提交評論</button>
                        <div class="reviews">
                            <h4>顧客評論:</h4>
                            <div class="first-comment">
                                ${firstComment}
                            </div>
                            <div class="more-comments" style="display: none;">
                                ${moreComments}
                            </div>
                            ${comments.length > 1 ? '<button class="view-more btn">查看更多</button>' : ''}
                        </div>
                    </div>
                </div>
            </article>
        `;
        menuContainer.innerHTML += dishHTML;
    });

    attachReviewEvents(); // 綁定評論提交事件

    document.querySelectorAll('.view-more').forEach(button => {
        button.addEventListener('click', (e) => {
            const moreComments = e.target.previousElementSibling;
            moreComments.style.display = moreComments.style.display === 'none' ? 'block' : 'none';
            e.target.textContent = moreComments.style.display === 'none' ? '查看更多評論' : '收起評論';
        });
    });
}


function attachViewMoreEvents() {
    document.querySelectorAll('.view-more').forEach(button => {
        button.addEventListener('click', () => {
            // const moreComments = button.previousElementSibling;
            // moreComments.style.display = moreComments.style.display === 'none' ? 'block' : 'none';
            // button.textContent = moreComments.style.display === 'none' ? '查看更多評論' : '隐藏評論';
            if (moreComments) {
                moreComments.style.display = moreComments.style.display === 'none' ? 'block' : 'none';
                button.textContent = moreComments.style.display === 'none' ? '查看更多評論' : '收起評論';
            }
        });
    });
}

// function attachReviewEvents() {
//     document.querySelectorAll('.submit-review').forEach(button => {
//         button.addEventListener('click', async (e) => {
//             const dishId = e.target.getAttribute('data-id');
//             const reviewInput = button.previousElementSibling.previousElementSibling.value.trim();
//             const starRating = button.previousElementSibling.value;
//             if (!reviewInput) {
//                 alert("評論內容不得為空！");
//                 return;
//             }
//             if (!dishId) {
//                 console.error('dish_id 未正確設置');
//                 alert('系統錯誤，無法提交評論');
//                 return;
//             }
//             try {
//                 const response = await fetch('/submit_comment', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({
//                         dish_id: dishId,
//                         comment: reviewInput,
//                         star: parseInt(starRating, 10)
//                     })                });
//                 const result = await response.json();
//                 if (result.status === 'success') {
//                     alert("評論提交成功！");
//                     location.reload(); // 重新加载页面
//                 } else {
//                     alert(result.message);
//                 }
//             } catch (error) {
//                 console.error("提交評論时出錯:", error);
//                 alert("提交評論失敗，請稍後重试。");
//             }
//         });
//     });
// }
// 菜單卡片點擊展開/收合
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.menu-card');
    cards.forEach(card => {
        card.addEventListener('click', (e) => {
            // 如果點擊的是評論框或提交按鈕，阻止卡片的展開/收合
            if (e.target.closest('.review-input') || e.target.closest('.submit-review')) {
                return;
            }

            // 先移除其他卡片的 active 狀態
            cards.forEach(c => {
                if (c !== card) {
                    c.classList.remove('active');
                }
            });

            // 切換當前卡片的狀態
            card.classList.toggle('active');
        });
    });
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
                // 渲染營養成分
                const nutritionInfo = (item.nutrition || [])
                    .map(n => `<div>${n.name || '未知'} : ${n.amount || 0} ${n.unit || ''}</div>`)
                    .join('') || '<p>尚無營養資訊</p>';
        
                const comments = item.comments || [];
                const firstComment = comments.length > 0 
                    ? `<p>${comments[0].content || "無內容"}</p>
                    <p>星級: ${comments[0].star || "無"}</p>
                    <p>${comments[0].time || ""}</p>` 
                    : '<p class="review-text">尚無評論</p>';

                const moreComments = comments.slice(1).map(comment => `
                    <div class="review-item">
                        <p class="review-text">${comment.content || '無內容'}</p>
                        <p class="review-star">星級: ${comment.star || '無'}</p>
                        <p class="review-time">${comment.time || ''}</p>
                    </div>
                `).join('');

        
                // 渲染菜單卡片
                const dishHTML = `
                <article class="menu-card" data-id="${item.id}">
                    <div class="menu-preview">
                        <img src="/static/images/dish/${item.id}.jpg" alt="${item.name}" style="margin: 0 auto; display: block;">
                        <h3>${item.name}</h3>
                    </div>
                    <div class="menu-details">
                        <div class="menu-content">
                            <p class="price" style="color:orange;">NT$ ${item.price}</p>
                            <div class="nutrition">
                                <h4>營養成分:</h4>
                                ${nutritionInfo || '<p>尚無營養資訊</p>'}
                            </div>
                            <textarea class="review-input" placeholder="留下您的評論..."></textarea>
                            <select class="star-input">
                                <option value="" disabled selected>請選擇評分</option>
                                <option value="1">1 星</option>
                                <option value="2">2 星</option>
                                <option value="3">3 星</option>
                                <option value="4">4 星</option>
                                <option value="5">5 星</option>
                            </select>
                            <button class="submit-review btn" data-id="${item.id}">提交評論</button>
                            <div class="reviews">
                                <h4>顧客評論:</h4>
                                <div class="first-comment">
                                    ${firstComment}
                                </div>
                                <div class="more-comments" style="display: none;">
                                    ${moreComments}
                                </div>
                                    ${comments.length > 1 ? '<button class="view-more btn">查看更多</button>' : ''}
                                </div>
                        </div>
                    </div>
                </article>
                `;
                menuContainer.innerHTML += dishHTML;
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
            });
            attachReviewEvents();
            
            document.querySelectorAll('.view-more').forEach(button => {
                button.addEventListener('click', (e) => {
                    const moreComments = e.target.previousElementSibling;
                    moreComments.style.display = moreComments.style.display === 'none' ? 'block' : 'none';
                    e.target.textContent = moreComments.style.display === 'none' ? '查看更多評論' : '收起評論';
                });
            });
        
            // document.querySelectorAll('.submit-review').forEach(button => {
            //     button.addEventListener('click', async (e) => {
            //         const dishId = button.getAttribute('data-id');
            //         const reviewInput = button.previousElementSibling.value;
            //         const starRating = 5; // 可以從 UI 獲取真實的星級評分
            
            //         if (!reviewInput.trim()) {
            //             alert('請輸入評論內容');
            //             return;
            //         }
            
            //         try {
            //             const response = await fetch('/submit_comment', {
            //                 method: 'POST',
            //                 headers: {
            //                     'Content-Type': 'application/json',
            //                 },
            //                 body: JSON.stringify({
            //                     dish_id: dishId,
            //                     comment: reviewInput,
            //                     star: starRating,
            //                 }),
            //             });
            
            //             const result = await response.json();
            //             if (result.status === 'success') {
            //                 const newComment = result.comment;
            
            //                 // 渲染新評論到評論區域
            //                 const reviewContainer = button.closest('.menu-content').querySelector('.reviews');
            //                 const firstCommentDiv = reviewContainer.querySelector('.first-comment');
            
            //                 // 插入新評論到最前面
            //                 firstCommentDiv.innerHTML = `
            //                     <p>${newComment.Conent}</p>
            //                     <p>星級: ${newComment.Star}</p>
            //                     <p>${newComment.Comment_Time}</p>
            //                 `;
            
            //                 // 清空輸入框
            //                 button.previousElementSibling.value = '';
            //             } else {
            //                 alert(result.message || '提交失敗，請稍後再試。');
            //             }
            //         } catch (error) {
            //             console.error('Error submitting comment:', error);
            //             alert('提交失敗，請稍後再試。');
            //         }
            //     });
            //});
            
            
        }
        const viewMoreButton = document.querySelector('.view-more');
        if (viewMoreButton) {
            viewMoreButton.style.display = 'block'; // 確保按鈕顯示
            viewMoreButton.addEventListener('click', () => {
                const moreComments = document.querySelector('.more-comments');
                if (moreComments) {
                    moreComments.style.display = 'block'; // 顯示更多評論
                }
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

// function attachReviewEventListeners() {
//     document.querySelectorAll('.submit-review').forEach(button => {
//         button.addEventListener('click', (e) => {
//             const dishId = button.getAttribute('data-dish-id');
//             const reviewInput = e.target.previousElementSibling.value.trim();

//             if (!reviewInput) {
//                 alert('評論內容不得為空');
//                 return;
//             }

//             // fetch('/submit_comment', {
//             //     method: 'POST',
//             //     headers: {
//             //         'Content-Type': 'application/json'
//             //     },
//             //     body: JSON.stringify({ dish_id: dishId, review: reviewInput })
//             // })
//             //     .then(response => response.json())
//             //     .then(data => {
//             //         if (data.status === 'success') {
//             //             alert('評論提交成功');
//             //             location.reload(); // 重新載入頁面
//             //         } else {
//             //             alert(data.message);
//             //         }
//             //     })
//             //     .catch(error => console.error('Error submitting review:', error));
//         });
//     });
// }

// 搜尋
function searchMenuItems() {
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    const menuItems = document.querySelectorAll('.menu-card');

    menuItems.forEach(item => {
        const itemName = item.getAttribute('data-name').toLowerCase();

        if (itemName.includes(query)) {
            item.style.display = ''; // 顯示匹配的項目
        } else {
            item.style.display = 'none'; // 隱藏不匹配的項目
        }
    });
}

// 支援即時搜尋
document.getElementById('searchInput').addEventListener('input', searchMenuItems);

