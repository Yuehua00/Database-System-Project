# 定義菜品資料
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

# 定義時間段資料
categories = {
    "義大利麵": ["lunch", "dinner"],
    "湯與沙拉": ["lunch", "dinner"],
    "飲料": ["afternoon", "dinner"],
    "甜點": ["afternoon", "dinner"]
}

# 用來儲存生成的 SQL 插入語句
insert_statements = []
cnt = 0

# 生成 dish_timeslot 的插入語句
for dish_id, dish_name, dish_price, category in dishes:
    if category in categories:
        for time_slot in categories[category]:
            cnt += 1
            insert_statements.append(f"insert into dish_timeslot(TimeSlot_ID, Dish_ID, TimeSlot) values({
                                     cnt}, {dish_id}, '{time_slot}');")

# 將 SQL 語句寫入到 'dish_timeslot.sql' 檔案
with open('dish_timeslot.sql', 'w', encoding='utf-8') as file:
    for statement in insert_statements:
        file.write(statement + '\n')

print("SQL 插入語句已寫入 'dish_timeslot.sql' 檔案中")
