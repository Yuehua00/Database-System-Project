import names
import random
import string
from werkzeug.security import generate_password_hash

words_list = [
    "apple", "banana", "orange", "grape", "sunshine", "storm", "moon", "cloud",
    "coffee", "keyboard", "mountain", "river", "forest", "sky", "wind", "light",
    "star", "ocean", "earth", "space"
]

def generate_password():
    # 隨機選擇 2 到 3 個單字
    num_words = random.randint(1, 3)
    words = random.sample(words_list, num_words)

    # 隨機生成數字來增強密碼的安全性
    num_digits = random.randint(2, 4)  # 至少包含 2 個數字
    digits = ''.join(random.choice(string.digits) for _ in range(num_digits))

    # 混合單字和數字，並隨機排列
    password = ''.join(words) + digits

    if random.random() < 0.9:
        password = ''.join(random.sample(password, len(password)))  # 打亂密碼順序

    return password

def generate_taiwan_phone_number():
    # 台灣的手機號碼以 09 開頭，接著是 8 位隨機數字
    phone_number = '09' + ''.join([str(random.randint(0, 9)) for _ in range(8)])
    return phone_number

# 生成並將 2000 個唯一的台灣電話號碼輸出到 sql/customer.sql 檔案
unique_phone_numbers = set()  # 用集合來存儲唯一的電話號碼

# 生成電話號碼直到集合中有 2000 個唯一的電話號碼
while len(unique_phone_numbers) < 2000:
    taiwan_phone_number = generate_taiwan_phone_number()
    unique_phone_numbers.add(taiwan_phone_number)

# 初始化 SQL 文件
with open("customer.sql", "w", encoding="utf-8") as sql_file, open("test_passwords.txt", "w", encoding="utf-8") as test_file:
    for i, phone_number in enumerate(unique_phone_numbers, start=1):
        print(i)
        if i > 2000 :
            break
        # 生成名字
        name = names.get_first_name(gender='male' if i % 2 else 'female')

        # 使用概率生成 0-100 或 101-500 之間的數字
        point = random.randint(0, 100) if random.random() < 0.8 else random.randint(101, 500)

        # 生成明文密碼並加密
        raw_password = generate_password()
        hashed_password = generate_password_hash(raw_password)

        # 寫入 SQL 文件
        sql_file.write(f"INSERT INTO Customer (Customer_name, Customer_phoneNumber, PWD, Points) VALUES ('{name}', '{phone_number}', '{hashed_password}', {point});\n")

        # 寫入測試文件（儲存明文密碼）
        test_file.write(f"Account: {name}, Phone: {phone_number}, Password: {raw_password}\n")

print("SQL 文件和測試密碼文件生成完成。")
