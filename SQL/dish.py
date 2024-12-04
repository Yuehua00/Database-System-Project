# -*- coding: utf-8 -*-

import re
from collections import defaultdict

# 用來儲存所有評論資料的列表
comments_data = []

# 用來儲存每個 dish_id 的所有星等
dish_ratings = defaultdict(list)

# 讀取 comment.sql 文件的內容
with open('comment.sql', 'r', encoding='utf-8') as file:
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

# 將每個 dish_id 的平均星等以字典形式保存，以便後續查詢
dish_avg_ratings = {dish_id: avg_rating for dish_id,
                    avg_rating in recommendations}

# ------ Dish data generation starts here ------

a = ["野菇燻雞", "煙燻鮭魚", "香蒜培根"]
b = ["白醬", "青醬", "紅醬"]
c = ["白酒蛤蜊義大利麵", "番茄肉醬義大利麵", "青醬海鮮義大利麵"]
d = ["玉米濃湯", "羅宋湯", "煙燻鮭魚沙拉", "經典凱薩沙拉"]
e = ["雪碧", "可樂", "紅茶", "綠茶", "奶茶", "可爾必思"]
f = ["焦糖烤布蕾", "起司蛋糕", "波士頓派", "提拉米蘇", "布朗尼"]

# 假設這些是每個項目的價格
prices = {
    "野菇燻雞": 220, "煙燻鮭魚": 250, "香蒜培根": 230, "白酒蛤蜊": 270,
    "白醬": 50, "青醬": 40, "紅醬": 45,
    "白酒蛤蜊義大利麵": 270, "番茄肉醬義大利麵": 220, "青醬海鮮義大利麵": 250,
    "玉米濃湯": 80, "羅宋湯": 90, "煙燻鮭魚沙拉": 180, "經典凱薩沙拉": 150,
    "雪碧": 60, "可樂": 60, "紅茶": 50, "綠茶": 50, "奶茶": 50, "可爾必思": 60,
    "焦糖烤布蕾": 80, "起司蛋糕": 60, "波士頓派": 70, "提拉米蘇": 60, "布朗尼": 80
}

# 定義每個類別和對應的時段
categories = {
    "義大利麵": {
        "category": "義大利麵",
        "time_slot": "lunch, dinner"
    },
    "湯與沙拉": {
        "category": "湯與沙拉",
        "time_slot": "lunch, dinner"
    },
    "飲料": {
        "category": "飲料",
        "time_slot": "afternoon, dinner"
    },
    "甜點": {
        "category": "甜點",
        "time_slot": "afternoon, dinner"
    }
}

cnt = 0

with open('dish.sql', 'w', encoding='utf-8') as file:
    # 處理義大利麵項目
    for i in b:
        for j in a:
            n = i + j
            cnt += 1
            price = prices[j] + prices[i]  # 取得對應的價格總和
            category = categories["義大利麵"]["category"]  # 義大利麵類別
            avg_rating = dish_avg_ratings.get(
                cnt, 'NULL')  # 取得平均星等，若無則為 'NULL'
            # 寫入兩個時間段的 insert 語句
            file.write(f"insert into dish (Dish_ID, Dish_name, Dish_price, Category, TimeSlots, Recommendation) values({
                       cnt}, '{n}義大利麵', {price}, '{category}', 'lunch', {avg_rating});\n")
            file.write(f"insert into dish (Dish_ID, Dish_name, Dish_price, Category, TimeSlots, Recommendation) values({
                       cnt}, '{n}義大利麵', {price}, '{category}', 'dinner', {avg_rating});\n")

    for i in c:
        cnt += 1
        price = prices[i]  # 取得對應的價格
        category = categories["義大利麵"]["category"]  # 義大利麵類別
        avg_rating = dish_avg_ratings.get(cnt, 'NULL')  # 取得平均星等，若無則為 'NULL'
        # 寫入兩個時間段的 insert 語句
        file.write(f"insert into dish (Dish_ID, Dish_name, Dish_price, Category, TimeSlots, Recommendation) values({
                   cnt}, '{i}', {price}, '{category}', 'lunch', {avg_rating});\n")
        file.write(f"insert into dish (Dish_ID, Dish_name, Dish_price, Category, TimeSlots, Recommendation) values({
                   cnt}, '{i}', {price}, '{category}', 'dinner', {avg_rating});\n")

    # 處理湯與沙拉項目
    for i in d:
        cnt += 1
        price = prices[i]  # 取得湯或沙拉的價格
        category = categories["湯與沙拉"]["category"]  # 湯與沙拉類別
        avg_rating = dish_avg_ratings.get(cnt, 'NULL')  # 取得平均星等，若無則為 'NULL'
        # 寫入兩個時間段的 insert 語句
        file.write(f"insert into dish (Dish_ID, Dish_name, Dish_price, Category, TimeSlots, Recommendation) values({
                   cnt}, '{i}', {price}, '{category}', 'lunch', {avg_rating});\n")
        file.write(f"insert into dish (Dish_ID, Dish_name, Dish_price, Category, TimeSlots, Recommendation) values({
                   cnt}, '{i}', {price}, '{category}', 'dinner', {avg_rating});\n")

    # 處理飲料項目
    for i in e:
        cnt += 1
        price = prices[i]  # 取得飲料的價格
        category = categories["飲料"]["category"]  # 飲料類別
        avg_rating = dish_avg_ratings.get(cnt, 'NULL')  # 取得平均星等，若無則為 'NULL'
        # 寫入三個時間段的 insert 語句
        file.write(f"insert into dish (Dish_ID, Dish_name, Dish_price, Category, TimeSlots, Recommendation) values({
                   cnt}, '{i}', {price}, '{category}', 'afternoon', {avg_rating});\n")
        file.write(f"insert into dish (Dish_ID, Dish_name, Dish_price, Category, TimeSlots, Recommendation) values({
                   cnt}, '{i}', {price}, '{category}', 'dinner', {avg_rating});\n")
        file.write(f"insert into dish (Dish_ID, Dish_name, Dish_price, Category, TimeSlots, Recommendation) values({
                   cnt}, '{i}', {price}, '{category}', 'lunch', {avg_rating});\n")

    # 處理甜點項目
    for i in f:
        cnt += 1
        price = prices[i]  # 取得甜點的價格
        category = categories["甜點"]["category"]  # 甜點類別
        avg_rating = dish_avg_ratings.get(cnt, 'NULL')  # 取得平均星等，若無則為 'NULL'
        # 寫入三個時間段的 insert 語句
        file.write(f"insert into dish (Dish_ID, Dish_name, Dish_price, Category, TimeSlots, Recommendation) values({
                   cnt}, '{i}', {price}, '{category}', 'afternoon', {avg_rating});\n")
        file.write(f"insert into dish (Dish_ID, Dish_name, Dish_price, Category, TimeSlots, Recommendation) values({
                   cnt}, '{i}', {price}, '{category}', 'dinner', {avg_rating});\n")
        file.write(f"insert into dish (Dish_ID, Dish_name, Dish_price, Category, TimeSlots, Recommendation) values({
                   cnt}, '{i}', {price}, '{category}', 'lunch', {avg_rating});\n")


print("Dish data has been written to dish.sql")
