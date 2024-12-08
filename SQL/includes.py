import random
import re
from collections import defaultdict

# 定義菜品列表與類別對應資料
dishes = [
    (1, '白醬野菇燻雞義大利麵', 270, '義大利麵'),
    (2, '白醬煙燻鮭魚義大利麵', 300, '義大利麵'),
    (3, '白醬香蒜培根義大利麵', 280, '義大利麵'),
    (4, '青醬野菇燻雞義大利麵', 260, '義大利麵'),
    (5, '青醬煙燻鮭魚義大利麵', 290, '義大利麵'),
    (6, '青醬香蒜培根義大利麵', 270, '義大利麵'),
    (7, '紅醬野菇燻雞義大利麵', 265, '義大利麵'),
    (8, '紅醬煙燻鮭魚義大利麵', 295, '義大利麵'),
    (9, '紅醬香蒜培根義大利麵', 275, '義大利麵'),
    (10, '白酒蛤蜊義大利麵', 270, '義大利麵'),
    (11, '番茄肉醬義大利麵', 220, '義大利麵'),
    (12, '青醬海鮮義大利麵', 250, '義大利麵'),

    (13, '玉米濃湯', 80, '湯與沙拉'),
    (14, '羅宋湯', 90, '湯與沙拉'),
    (15, '煙燻鮭魚沙拉', 180, '湯與沙拉'),
    (16, '經典凱薩沙拉', 150, '湯與沙拉'),

    (17, '雪碧', 60, '飲料'),
    (18, '可樂', 60, '飲料'),
    (19, '紅茶', 50, '飲料'),
    (20, '綠茶', 50, '飲料'),
    (21, '奶茶', 50, '飲料'),
    (22, '可爾必思', 60, '飲料'),

    (23, '焦糖烤布蕾', 80, '甜點'),
    (24, '起司蛋糕', 60, '甜點'),
    (25, '波士頓派', 70, '甜點'),
    (26, '提拉米蘇', 60, '甜點'),
    (27, '布朗尼', 80, '甜點')
]

# 時段與可選菜品類別對應
categories = {
    "午餐": ["義大利麵", "湯與沙拉"],  # 午餐時段選擇"義大利麵"和"湯與沙拉"
    "晚餐": ["義大利麵", "湯與沙拉", "飲料", "甜點"],
    "下午茶": ["飲料", "甜點"]
}

# 從 reservation.sql 讀取預定資料


def read_reservations_from_file(filename):
    reservations = []
    with open(filename, 'r', encoding='utf-8') as file:
        for line in file:
            match = re.match(
                r"insert into reservation values\('([^']+)', (\d+), '([^']+)', (\d+), (\d+)\);", line.strip())
            if match:
                period, num_people, date, customer_id, table_id = match.groups()
                reservations.append(
                    (period, int(num_people), date, int(customer_id), int(table_id)))
    return reservations

# 生成 SQL 插入語句


def generate_sql_insert(reservations):
    sql_statements = []
    order_id = 1  # 設置初始的訂單編號

    # 用來存儲每個 order_id 及其對應的菜品與數量
    orders = defaultdict(lambda: defaultdict(int))

    for reservation in reservations:
        period, num_people, date, customer_id, table_id = reservation

        # 根據時段選擇可用的菜品類別
        available_categories = categories.get(period, [])

        # 從菜品列表中篩選出符合該時段的菜品
        available_dishes = [
            dish for dish in dishes if dish[3] in available_categories]

        # 隨機選擇午餐時段的菜品（每位顧客選一個"義大利麵"和"湯與沙拉"）
        if period == "午餐":
            italian_pasta = [
                dish for dish in available_dishes if dish[3] == "義大利麵"]
            soup_and_salad = [
                dish for dish in available_dishes if dish[3] == "湯與沙拉"]

            # 為每位顧客隨機選擇一道義大利麵和湯與沙拉
            for _ in range(num_people):
                pasta = random.choice(italian_pasta)  # 隨機選擇一道義大利麵
                soup = random.choice(soup_and_salad)  # 隨機選擇一道湯與沙拉

                # 進行計數，增加數量
                orders[order_id][pasta[0]] += 1
                orders[order_id][soup[0]] += 1

        elif period == "晚餐":
            italian_pasta = [
                dish for dish in available_dishes if dish[3] == "義大利麵"]
            soup_and_salad = [
                dish for dish in available_dishes if dish[3] == "湯與沙拉"]
            drinks = [
                dish for dish in available_dishes if dish[3] == "飲料"]
            dessert = [
                dish for dish in available_dishes if dish[3] == "甜點"]

            # 為每位顧客隨機選擇一道義大利麵和湯與沙拉
            for _ in range(num_people):
                pasta = random.choice(italian_pasta)  # 隨機選擇一道義大利麵
                soup = random.choice(soup_and_salad)  # 隨機選擇一道湯與沙拉
                drink = random.choice(drinks)  # 隨機選擇一道飲料
                desserts = random.choice(dessert)  # 隨機選擇一道甜點

                # 進行計數，增加數量
                orders[order_id][pasta[0]] += 1
                orders[order_id][soup[0]] += 1
                orders[order_id][drink[0]] += 1
                orders[order_id][desserts[0]] += 1

        elif period == "下午茶":
            drinks = [
                dish for dish in available_dishes if dish[3] == "飲料"]
            dessert = [
                dish for dish in available_dishes if dish[3] == "甜點"]

            # 為每位顧客隨機選擇一道飲料和甜點
            for _ in range(num_people):
                drink = random.choice(drinks)  # 隨機選擇一道飲料
                desserts = random.choice(dessert)  # 隨機選擇一道甜點

                # 進行計數，增加數量
                orders[order_id][drink[0]] += 1
                orders[order_id][desserts[0]] += 1

        order_id += 1  # 增加訂單編號

    # 將每個 order_id 的菜品生成 SQL 語句
    for order_id, dishes_dict in orders.items():
        for dish_id, quantity in dishes_dict.items():
            # 獲取菜品的價格
            dish = next(d for d in dishes if d[0] == dish_id)
            price = dish[2]
            total_price = price * quantity  # 計算總價

            # 生成 SQL 插入語句，插入總價而非單個價格
            sql_statements.append(
                f"insert into includes values({order_id}, {dish_id}, {quantity}, {total_price});")

    return sql_statements


# 從 reservation.sql 讀取預定資料
reservations = read_reservations_from_file('reservation.sql')

# 生成 SQL 語句並輸出
sql_statements = generate_sql_insert(reservations)

# 將結果寫入 includes.sql 文件
with open('includes.sql', 'w', encoding='utf-8') as f:
    f.write("\n".join(sql_statements))

print("SQL Insert statements have been written to includes.sql")
