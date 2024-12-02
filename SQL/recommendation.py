import re
from collections import defaultdict


# 用來儲存所有評論資料的列表
comments_data = []

# 用來儲存每個 dish_id 的所有星等
dish_ratings = defaultdict(list)

# 讀取 comment.sql 文件的內容
with open('sql/comment.sql', 'r', encoding='utf-8') as file:
    lines = file.readlines()  # 讀取所有行

# 使用正則表達式解析每條插入語句
for line in lines:

    # 匹配 insert into comment values(18, '服務很好', 5, '2022/01/21', 2, 1664);
    match = re.match(
        r"insert into comment values\((\d+), '(.*?)', (\d+), '(.*?)', (\d+), (\d+)\);", line.strip())
    if match:
        comment_id = int(match.group(1))  # 評論ID
        comment_text = match.group(2)  # 評論內容
        rating = int(match.group(3))  # 星等
        date = match.group(4)  # 評論日期
        dish_id = int(match.group(5))  # dish_id
        user_id = int(match.group(6))  # 用戶ID

        # 將解析出來的資料儲存到 comments_data 列表
        comments_data.append({
            'comment_id': comment_id,
            'comment_text': comment_text,
            'rating': rating,
            'date': date,
            'user_id': user_id,
            'dish_id': dish_id
        })

        # 將每條評論的 rating 加入對應的 dish_id
        dish_ratings[dish_id].append(rating)

# 計算每個 dish_id 的平均星等
recommendations = []
for dish_id, ratings in dish_ratings.items():
    avg_rating = sum(ratings) / len(ratings)  # 計算平均星等
    avg_rating = round(avg_rating, 2)  # 保留兩位小數
    recommendations.append((dish_id, avg_rating))

# 按照 dish_id 排序
recommendations.sort(key=lambda x: x[0])  # 根據 dish_id 排序


# 將每個 dish_id 的平均星等寫入 recommendation.sql
with open('sql/recommendation.sql', 'w', encoding='utf-8') as file:
    for dish_id, avg_rating in recommendations:
        # 格式化並寫入 recommendation.sql
        file.write(f"insert into recommendation values({
                   dish_id}, {avg_rating});\n")
