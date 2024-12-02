import random

# 定義菜品類別（對應的 dish_id）
pasta = {
    13: '白酒蛤蜊義大利麵', 14: '番茄肉醬義大利麵', 15: '青醬海鮮義大利麵',
    1: '白醬野菇燻雞', 2: '白醬煙燻鮭魚', 3: '白醬香蒜培根', 4: '白醬白酒蛤蜊',
    5: '青醬野菇燻雞', 6: '青醬煙燻鮭魚', 7: '青醬香蒜培根', 8: '青醬白酒蛤蜊',
    9: '紅醬野菇燻雞', 10: '紅醬煙燻鮭魚', 11: '紅醬香蒜培根', 12: '紅醬白酒蛤蜊'
}

starter = {
    16: '玉米濃湯', 17: '羅宋湯', 18: '煙燻鮭魚沙拉', 19: '經典凱薩沙拉'
}

drink = {
    20: '雪碧', 21: '可樂', 22: '紅茶', 23: '綠茶', 24: '奶茶', 25: '可爾必思'
}

dessert = {
    26: '焦糖烤布蕾', 27: '起司蛋糕', 28: '波士頓派', 29: '提拉米蘇', 30: '布朗尼'
}

# 讀取 reservation 資料
reservations = []
with open('sql/reservation.sql', 'r', encoding='utf-8') as file:
    for line in file:
        if line.strip().startswith("insert into reservation"):
            # 解析每行資料
            values_str = line.strip().split("values(")[1].split(");")[0]
            values = values_str.split(", ")

            reservation_id = int(values[0])  # 訂單 ID
            timeslot = values[1].strip("'")  # 時段
            number_of_people = int(values[2])  # 人數
            customer_id = int(values[4])  # 顧客 ID
            table_id = int(values[5])  # 桌號

            reservations.append({
                "reservation_id": reservation_id,
                "timeslot": timeslot,
                "number_of_people": number_of_people
            })

# 生成 includes.sql 資料
with open('includes.sql', 'w', encoding='utf-8') as file:
    for reservation in reservations:
        reservation_id = reservation['reservation_id']
        timeslot = reservation['timeslot']
        number_of_people = reservation['number_of_people']

        # 根據訂單的時段來選擇菜品
        dish_ids = []

        for num in range(number_of_people):

            if timeslot == "午餐":
                # 午餐：義大利麵 + 湯或沙拉
                selected_pasta = random.choice(
                    list(pasta.keys()))  # 隨機選擇一款義大利麵
                file.write(f"insert into includes values ({
                           reservation_id}, {selected_pasta});\n")

                # 隨機選擇湯或沙拉
                selected_starter = random.choice(list(starter.keys()))  # 湯或沙拉
                file.write(f"insert into includes values ({
                           reservation_id}, {selected_starter});\n")

            elif timeslot == "下午茶":
                # 下午茶：飲料 + 甜點
                selected_drink = random.choice(list(drink.keys()))  # 隨機選擇飲料
                file.write(f"insert into includes values ({
                           reservation_id}, {selected_drink});\n")

                # 隨機選擇甜點
                selected_dessert = random.choice(
                    list(dessert.keys()))  # 隨機選擇甜點
                file.write(f"insert into includes values ({
                           reservation_id}, {selected_dessert});\n")

            elif timeslot == "晚餐":
                # 晚餐：義大利麵 + 湯或沙拉 + 飲料 + 甜點
                selected_pasta = random.choice(
                    list(pasta.keys()))  # 隨機選擇一款義大利麵
                file.write(f"insert into includes values ({
                           reservation_id}, {selected_pasta});\n")

                # 隨機選擇湯或沙拉
                selected_starter = random.choice(list(starter.keys()))  # 湯或沙拉
                file.write(f"insert into includes values ({
                           reservation_id}, {selected_starter});\n")

                # 隨機選擇飲料
                selected_drink = random.choice(list(drink.keys()))  # 隨機選擇飲料
                file.write(f"insert into includes values ({
                           reservation_id}, {selected_drink});\n")

                # 隨機選擇甜點
                selected_dessert = random.choice(
                    list(dessert.keys()))  # 隨機選擇甜點
                file.write(f"insert into includes values ({
                           reservation_id}, {selected_dessert});\n")
