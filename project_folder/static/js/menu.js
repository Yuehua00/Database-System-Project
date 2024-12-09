document.addEventListener('DOMContentLoaded', () => {
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

    // 加載菜單數據
    fetch('/get_pre_menu')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                renderMenu(data.menu); // 渲染菜單
            } else {
                showError(`Error in response data: ${data.message}`);
            }
        })
        .catch(error => {
            showError('無法加載菜單，請稍後重試。');
            console.error('Error fetching menu:', error);
        });

    // 渲染菜單
    function renderMenu(menu) {
        const container = document.getElementById('menu-container');
        container.innerHTML = '';
        menu.forEach(item => {
            const nutritionInfo = item.nutrition.map(n => 
                `${n.name}: ${n.amount}${n.unit}`).join(', ');

            const dishElement = `
                <div class="menu-item">
                    <h3>${item.name}</h3>
                    <p>價格: NT$${item.price}</p>
                    <p>推薦指數: ${item.recommendation}</p>
                    <p>分類: ${item.category}</p>
                    ${nutritionInfo ? `<p>營養成分: ${nutritionInfo}</p>` : ''}
                </div>
            `;
            container.innerHTML += dishElement;
        });
    }

    // 顯示錯誤訊息
    function showError(message) {
        const container = document.getElementById('menu-container');
        container.innerHTML = `<p class="error-message">${message}</p>`;
    }

    // 搜尋功能
    document.getElementById('searchInput').addEventListener('input', filterMenu);

    function filterMenu() {
        const query = document.getElementById('searchInput').value.trim().toLowerCase();
        const menuItems = document.querySelectorAll('.menu-item');

        menuItems.forEach(item => {
            const itemName = item.querySelector('h3').textContent.toLowerCase();

            if (itemName.includes(query)) {
                item.style.display = ''; // 顯示匹配項
            } else {
                item.style.display = 'none'; // 隱藏不匹配項
            }
        });
    }
});
