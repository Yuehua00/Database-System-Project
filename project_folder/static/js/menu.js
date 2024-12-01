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
document.querySelectorAll('.menu-card').forEach(card => {
    card.addEventListener('click', function(e) {
        // 檢查是否點擊了卡片內的展開內容
        if (!e.target.closest('.menu-details')) {
            this.classList.toggle('active');
        }
    });
});

// 點擊空白處收合菜單卡片
document.addEventListener('click', function(e) {
    if (!e.target.closest('.menu-card')) {
        document.querySelectorAll('.menu-card.active').forEach(card => {
            card.classList.remove('active');
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