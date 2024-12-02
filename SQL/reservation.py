import random
from datetime import datetime, timedelta

# 隨機生成 2024 年日期
start_date = datetime(2024, 1, 1)
end_date = datetime(2024, 12, 31)

# 定義時間段
time_slots = ["午餐", "晚餐", "下午茶"]  # 包含"下午茶"時段

# 用來儲存已經使用過的桌號和顧客 ID
used_reservations = {}

# 打開檔案以寫入 SQL 語句
with open('reservation.sql', 'w', encoding='utf-8') as file:
    for i in range(1, 2001):
        # 隨機選擇一個時間段
        if random.random() < 0.2:
            timeslot = "下午茶"
        else:
            timeslot = random.choice(time_slots)

        # 隨機生成人數 1-4
        number_of_people = random.randint(1, 4)

        # 隨機生成日期
        delta = end_date - start_date
        random_time = start_date + \
            timedelta(seconds=random.randint(0, int(delta.total_seconds())))
        date = random_time.strftime('%Y/%m/%d')

        # 隨機選擇顧客ID
        customer_id = random.randint(1, 2000)

        # 根據人數確定桌號範圍
        if number_of_people <= 2:
            table_range = range(1, 21)  # 1-2人範圍為 1-20號桌
        else:
            table_range = range(21, 51)  # 3-4人範圍為 21-50號桌

        # 初始化日期和時段的儲存結構（如果尚未初始化）
        if date not in used_reservations:
            used_reservations[date] = {
                slot: {'table_ids': set(), 'customer_ids': set()} for slot in time_slots}

        # 確保同一天同一時段，桌號和顧客ID不重複
        while table_range[0] in used_reservations[date][timeslot]['table_ids'] or customer_id in used_reservations[date][timeslot]['customer_ids']:
            # 依序選擇未被使用的桌號
            table_range = range(table_range[0] + 1, table_range[-1] + 1)
            customer_id = random.randint(1, 2000)

        # 分配桌號
        table_id = next(
            table for table in table_range if table not in used_reservations[date][timeslot]['table_ids'])

        # 記錄已使用的顧客 ID 和桌號
        used_reservations[date][timeslot]['table_ids'].add(table_id)
        used_reservations[date][timeslot]['customer_ids'].add(customer_id)

        # 寫入插入語句
        file.write(f"insert into reservation values({i}, '{timeslot}', {
                   number_of_people}, '{date}', {customer_id}, {table_id});\n")
