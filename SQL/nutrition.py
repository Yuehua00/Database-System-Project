import random

# 定義菜品和對應的營養成分數據
dishes = [
    (1, '白醬野菇燻雞義大利麵'),
    (2, '白醬煙燻鮭魚義大利麵'),
    (3, '白醬香蒜培根義大利麵'),
    (4, '青醬野菇燻雞義大利麵'),
    (5, '青醬煙燻鮭魚義大利麵'),
    (6, '青醬香蒜培根義大利麵'),
    (7, '紅醬野菇燻雞義大利麵'),
    (8, '紅醬煙燻鮭魚義大利麵'),
    (9, '紅醬香蒜培根義大利麵'),
    (10, '白酒蛤蜊義大利麵'),
    (11, '番茄肉醬義大利麵'),
    (12, '青醬海鮮義大利麵'),
    (13, '玉米濃湯'),
    (14, '羅宋湯'),
    (15, '煙燻鮭魚沙拉'),
    (16, '經典凱薩沙拉'),
    (17, '雪碧'),
    (18, '可樂'),
    (19, '紅茶'),
    (20, '綠茶'),
    (21, '奶茶'),
    (22, '可爾必思'),
    (23, '焦糖烤布蕾'),
    (24, '起司蛋糕'),
    (25, '波士頓派'),
    (26, '提拉米蘇'),
    (27, '布朗尼')
]

# 根據菜品名稱生成合理的營養數據


def generate_nutrition_for_dish(dish_name):
    # 這裡我們根據常見的菜品來估算營養數據
    # 預設的營養成分範圍（熱量、蛋白質、碳水化合物、脂肪）
    nutrition = {}

    if '義大利麵' in dish_name:
        nutrition['熱量'] = random.randint(450, 550)  # 熱量範圍 (kcal)
        nutrition['蛋白質'] = random.randint(20, 30)  # 蛋白質範圍 (g)
        nutrition['碳水化合物'] = random.randint(55, 65)  # 碳水化合物範圍 (g)
        nutrition['脂肪'] = random.randint(15, 25)  # 脂肪範圍 (g)

    elif '沙拉' in dish_name:
        nutrition['熱量'] = random.randint(150, 250)  # 熱量範圍 (kcal)
        nutrition['蛋白質'] = random.randint(5, 15)  # 蛋白質範圍 (g)
        nutrition['碳水化合物'] = random.randint(10, 20)  # 碳水化合物範圍 (g)
        nutrition['脂肪'] = random.randint(10, 20)  # 脂肪範圍 (g)

    elif '湯' in dish_name:
        nutrition['熱量'] = random.randint(80, 150)  # 熱量範圍 (kcal)
        nutrition['蛋白質'] = random.randint(2, 10)  # 蛋白質範圍 (g)
        nutrition['碳水化合物'] = random.randint(10, 20)  # 碳水化合物範圍 (g)
        nutrition['脂肪'] = random.randint(5, 15)  # 脂肪範圍 (g)

    elif '甜點' in dish_name:
        nutrition['熱量'] = random.randint(250, 400)  # 熱量範圍 (kcal)
        nutrition['蛋白質'] = random.randint(3, 10)  # 蛋白質範圍 (g)
        nutrition['碳水化合物'] = random.randint(40, 60)  # 碳水化合物範圍 (g)
        nutrition['脂肪'] = random.randint(10, 20)  # 脂肪範圍 (g)

    elif '飲料' in dish_name:
        nutrition['熱量'] = random.randint(30, 120)  # 熱量範圍 (kcal)
        nutrition['蛋白質'] = random.randint(0, 3)  # 蛋白質範圍 (g)
        nutrition['碳水化合物'] = random.randint(8, 30)  # 碳水化合物範圍 (g)
        nutrition['脂肪'] = random.randint(0, 5)  # 脂肪範圍 (g)

    else:
        nutrition['熱量'] = 0
        nutrition['蛋白質'] = 0
        nutrition['碳水化合物'] = 0
        nutrition['脂肪'] = 0

    return nutrition

# 生成 SQL insert 語句


def generate_sql_insert(dishes):
    sql_statements = []

    for dish_id, dish_name in dishes:
        nutrition = generate_nutrition_for_dish(dish_name)
        for nutrition_name, amount in nutrition.items():
            sql = f"insert into dish_nutrition(nutrition_name, amount, unit, Dish_ID) values('{nutrition_name}', {amount}, '{'g' if nutrition_name != '熱量' else 'kcal'}',{
                dish_id});"
            sql_statements.append(sql)

    return sql_statements


# 生成 SQL 語句
sql_statements = generate_sql_insert(dishes)

# 寫入 SQL 語句到檔案
with open('nutrition.sql', 'w', encoding='utf-8') as file:
    for sql in sql_statements:
        file.write(sql + '\n')

print("SQL 插入語句已寫入 'sql/nutrition.sql' 檔案中。")
