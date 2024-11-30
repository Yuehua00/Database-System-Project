# -*- coding: utf-8 -*-

a = ["野菇燻雞", "蘆筍燻鮭魚", "萵苣培根", "白酒蛤蜊"]
b = ["白醬", "青醬", "紅醬"]
c = ["玉米濃湯", "羅宋湯", "煙燻鮭魚沙拉", "經典凱薩沙拉"]
d = ["雪碧", "可樂", "紅茶", "綠茶", "奶茶", "可爾必思"]
e = ["焦糖烤布蕾", "起司蛋糕", "波士頓派", "提拉米蘇", "布朗尼"]

# 假設這些是每個項目的價格
prices = {
    "野菇燻雞": 220, "蘆筍燻鮭魚": 250, "萵苣培根": 230, "白酒蛤蜊": 270,
    "白醬": 50, "青醬": 40, "紅醬": 45,
    "玉米濃湯": 80, "羅宋湯": 90, "煙燻鮭魚沙拉": 180, "經典凱薩沙拉": 150,
    "雪碧": 60, "可樂": 60, "紅茶": 50, "綠茶": 50, "奶茶": 50, "可爾必思": 60,
    "焦糖烤布蕾": 80, "起司蛋糕": 60, "波士頓派": 70, "提拉米蘇": 60, "布朗尼": 80
}

cnt = 0

with open('dish.txt', 'w', encoding='utf-8') as file:
    # 處理義大利麵項目
    for i in b:
        for j in a:
            n = i + j
            cnt += 1
            price = prices[j] + prices[i]  # 取得對應的價格總和
            file.write(f"insert into dish values({cnt}, '{n}', {price});\n")

    # 處理湯與沙拉項目
    for i in c:
        cnt += 1
        price = prices[i]  # 取得湯或沙拉的價格
        file.write(f"insert into dish values({cnt}, '{i}', {price});\n")

    # 處理飲料項目
    for i in d:
        cnt += 1
        price = prices[i]  # 取得飲料的價格
        file.write(f"insert into dish values({cnt}, '{i}', {price});\n")

    # 處理甜點項目
    for i in e:
        cnt += 1
        price = prices[i]  # 取得甜點的價格
        file.write(f"insert into dish values({cnt}, '{i}', {price});\n")
