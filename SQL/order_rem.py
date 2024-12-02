import re

dish_prices = {
    1: 270, 2: 300, 3: 280, 4: 320, 5: 260, 6: 290, 7: 270, 8: 310,
    9: 265, 10: 295, 11: 275, 12: 315, 13: 270, 14: 220, 15: 250,
    16: 80, 17: 90, 18: 180, 19: 150, 20: 60, 21: 60, 22: 50, 23: 50,
    24: 50, 25: 60, 26: 80, 27: 60, 28: 70, 29: 60, 30: 80
}

orders = {}

with open('sql/data/includes.sql', 'r', encoding='utf-8') as file:
    for line in file:
        line = line.strip()
        if line.startswith("insert into includes"):
            match = re.search(
                r"insert into includes values \((\d+),\s*(\d+)\);", line)
            if match:
                reservation_id = int(match.group(1))
                dish_id = int(match.group(2))

                if reservation_id not in orders:
                    orders[reservation_id] = []
                orders[reservation_id].append(dish_id)

with open('sql/order_rem.sql', 'w', encoding='utf-8') as file:
    for reservation_id, dish_ids in orders.items():
        total_price = 0

        for dish_id in dish_ids:
            total_price += dish_prices[dish_id]

        file.write(f"insert into order_rem values ({reservation_id}, {
                   total_price}, {reservation_id});\n")
