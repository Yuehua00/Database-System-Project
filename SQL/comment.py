import random
from datetime import datetime, timedelta

# 隨機生成時間的範圍設置，這裡假設我們會生成 2022 年到 2025 年之間的隨機時間
start_date = datetime(2022, 1, 1)
end_date = datetime(2025, 1, 1)
last_comment_time = start_date

# 預設的一些評論，根據評分來分為兩組：負面評論與正面評論
negative_comments = [
    "味道奇怪", "不喜歡", "難吃", "太貴", "價格太高", "太乾", "份量太少", "太小份", "太小", "太鹹", "不新鮮", "上菜時間太久", "不合我的口味", "太油膩"
]

positive_comments = [
    "推", "讚", "美味100分", "下次會再來", "味道不錯", "非常美味", "服務很好", "份量夠大", "價格合理", "很好吃", "非常好吃", "好吃", "值得再來", "調味適中", "不錯的選擇"
]

# 中立評論（可以用於 3 顆星的情況）
neutral_comments = [
    "吃起來有點淡", "有點重鹹", "太甜"
]

with open('sql/comment.sql', 'w', encoding='utf-8') as file:
    for id in range(1, 1001):

        # 根據評論內容決定星等
        if random.random() < 0.15:
            # 15% 機率選擇負面評論，並給予 1 或 2 顆星
            star = random.randint(1, 2)
            comment = random.choice(negative_comments)
        elif random.random() < 0.4:
            # 25% 機率選擇中立評論，並給予 3 顆星
            star = 3
            comment = random.choice(neutral_comments)
        else:
            # 60% 機率選擇正面評論，並給予 4 或 5 顆星
            star = random.randint(4, 5)
            comment = random.choice(positive_comments)

        # 隨機選擇顧客ID
        customer_id = random.randint(1, 2000)

        # 確保評論時間遞增，並且不超過結束日期
        delta_days = random.randint(0, 2)  # 生成 0 到 2 天之間的隨機時間差
        last_comment_time += timedelta(days=delta_days)  # 新的評論時間加上隨機天數

        # 確保最後的時間不超過 end_date
        if last_comment_time > end_date:
            last_comment_time = end_date  # 如果超過了結束日期，則設置為結束日期

        comment_time = last_comment_time.strftime('%Y/%m/%d')

        dish_id = random.randint(1, 30)

        # 寫入 SQL 插入語句，加入評語欄
        file.write(f"insert into comment values({id}, '{comment}', {
                   star}, '{comment_time}', {dish_id}, {customer_id});\n")
