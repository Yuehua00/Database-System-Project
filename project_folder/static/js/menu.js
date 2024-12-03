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
document.querySelectorAll('.menu-preview').forEach(preview => {
    preview.addEventListener('click', function(e) {
        // 關閉其他已開啟的卡片
        document.querySelectorAll('.menu-card.active').forEach(card => {
            if(card !== this.parentElement) {
                card.classList.remove('active');
            }
        });
        
        // 切換當前卡片
        this.parentElement.classList.toggle('active');
        
        e.stopPropagation(); // 防止事件冒泡
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