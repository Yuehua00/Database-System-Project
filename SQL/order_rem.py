import re

# 定義菜品價格字典 (這裡的價格是你所提供的價格)
dish_prices = {
    1: 270, 2: 300, 3: 280, 4: 320, 5: 260, 6: 290, 7: 270, 8: 310,
    9: 265, 10: 295, 11: 275, 12: 315, 13: 270, 14: 220, 15: 250,
    16: 80, 17: 90, 18: 180, 19: 150, 20: 60, 21: 60, 22: 50, 23: 50,
    24: 50, 25: 60, 26: 80, 27: 60, 28: 70, 29: 60, 30: 80
}

# 儲存每個訂單的菜品與份量
orders = {}

# 讀取 'includes.sql' 檔案並解析
with open('includes.sql', 'r', encoding='utf-8') as file:
    for line in file:
        line = line.strip()
        if line.startswith("insert into includes"):
            # 使用正則表達式抓取資料：reservation_id, dish_id, quantity, price
            match = re.search(
                r"insert into includes values\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)\);", line)
            if match:
                reservation_id = int(match.group(1))  # 訂單編號
                dish_id = int(match.group(2))  # 菜品編號
                quantity = int(match.group(3))  # 份量
                price = int(match.group(4))  # 單價

                # 計算這個訂單的菜品總價
                total_dish_price = price * quantity

                # 將訂單資料加入到字典中
                if reservation_id not in orders:
                    orders[reservation_id] = 0  # 初始化該訂單的總價
                orders[reservation_id] += total_dish_price

# 寫入 'order_rem.sql' 檔案
with open('order_rem.sql', 'w', encoding='utf-8') as file:
    for reservation_id, total_price in orders.items():
        # 寫入每個訂單的總價
        file.write(f"insert into order_rem values ({
                   total_price}, {reservation_id});\n")
