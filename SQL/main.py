import re
from collections import defaultdict

# 假設 comment.sql 的內容如下 (模擬文件內容)
comments = [
    "insert into comment values(18, '服務很好', 5, '2022/01/21', 2, 1664);",
    "insert into comment values(19, '美味100分', 4, '2022/01/23', 28, 1022);",
    "insert into comment values(20, '吃起來有點淡', 3, '2022/01/25', 17, 1519);"
]

# 用來儲存每個 dish_id 的所有星等
dish_ratings = defaultdict(list)

# 解析 comment.sql 中的數據並收集星等
for comment in comments:
    # 使用正則表達式從每條評論中提取出 dish_id 和 rating (星等)
    match = re.search(
        r"insert into comment values\(\d+, '.*?', (\d), '.*?', (\d), (\d+)\);", comment)
    if match:
        rating = int(match.group(1))
        dish_id = int(match.group(3))
        dish_ratings[dish_id].append(rating)

# 計算每個 dish_id 的平均星等
recommendations = []
for dish_id, ratings in dish_ratings.items():
    avg_rating = sum(ratings) / len(ratings)  # 計算平均星等
    avg_rating = round(avg_rating, 2)  # 保留兩位小數
    recommendations.append((dish_id, avg_rating))

# 寫入 recommendation.sql 文件
with open('sql/recommendation.sql', 'w', encoding='utf-8') as file:
    cnt = 0
    for dish_id, avg_rating in recommendations:
        cnt += 1
        file.write(f"insert into recommendation values({
                   cnt}, {dish_id}, {avg_rating});\n")

print("recommendation.sql 已生成。")
