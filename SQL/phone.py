import random


def generate_taiwan_phone_number():
    # 台灣的手機號碼以 09 開頭，接著是 8 位隨機數字
    phone_number = '09' + \
        ''.join([str(random.randint(0, 9)) for _ in range(8)])
    return phone_number


# 生成並將 10 個唯一的台灣電話號碼輸出到 output.txt 檔案
unique_phone_numbers = set()  # 用集合來存儲唯一的電話號碼

# 生成電話號碼直到集合中有 10 個唯一的電話號碼
while len(unique_phone_numbers) < 2000:
    taiwan_phone_number = generate_taiwan_phone_number()
    unique_phone_numbers.add(taiwan_phone_number)

# 將唯一的電話號碼寫入 output.txt
with open("customer_phonenumber.txt", "w") as file:
    for phone_number in unique_phone_numbers:
        file.write(phone_number + ", ")
