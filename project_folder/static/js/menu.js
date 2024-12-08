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
});

document.addEventListener('DOMContentLoaded', () => {
    const menuContainer = document.getElementById('menu-container');

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
      console.error('Error in response data:', data.message);
    }
  })
  .catch(error => {
    console.error('Error fetching menu:', error);
  });

function renderMenu(menu) {
    const container = document.querySelector('.menu-container');
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