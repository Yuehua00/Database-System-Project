# -*- coding: utf-8 -*-

a = ["野菇燻雞", "煙燻鮭魚", "香蒜培根", "白酒蛤蜊"]
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
        "time_slot": "午餐, 晚餐"
    },
    "湯與沙拉": {
        "category": "湯與沙拉",
        "time_slot": "午餐, 晚餐"
    },
    "飲料": {
        "category": "飲料",
        "time_slot": "下午茶, 晚餐"
    },
    "甜點": {
        "category": "甜點",
        "time_slot": "下午茶, 晚餐"
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
            time_slot = categories["義大利麵"]["time_slot"]  # 義大利麵的時段
            file.write(f"insert into dish values({cnt}, '{n}', {
                       price}, '{category}', '{time_slot}');\n")
    for i in c:
        cnt += 1
        price = prices[i]  # 取得對應的價格總和
        category = categories["義大利麵"]["category"]  # 義大利麵類別
        time_slot = categories["義大利麵"]["time_slot"]  # 義大利麵的時段
        file.write(f"insert into dish values({cnt}, '{i}', {
                   price}, '{category}', '{time_slot}');\n")

    # 處理湯與沙拉項目
    for i in d:
        cnt += 1
        price = prices[i]  # 取得湯或沙拉的價格
        category = categories["湯與沙拉"]["category"]  # 湯與沙拉類別
        time_slot = categories["湯與沙拉"]["time_slot"]  # 湯與沙拉的時段
        file.write(f"insert into dish values({cnt}, '{i}', {
                   price}, '{category}', '{time_slot}');\n")

    # 處理飲料項目
    for i in e:
        cnt += 1
        price = prices[i]  # 取得飲料的價格
        category = categories["飲料"]["category"]  # 飲料類別
        time_slot = categories["飲料"]["time_slot"]  # 飲料的時段
        file.write(f"insert into dish values({cnt}, '{i}', {
                   price}, '{category}', '{time_slot}');\n")

    # 處理甜點項目
    for i in f:
        cnt += 1
        price = prices[i]  # 取得甜點的價格
        category = categories["甜點"]["category"]  # 甜點類別
        time_slot = categories["甜點"]["time_slot"]  # 甜點的時段
        file.write(f"insert into dish values({cnt}, '{i}', {
                   price}, '{category}', '{time_slot}');\n")
