import names
import random
import string

words_list = [
    "apple", "banana", "orange", "grape", "sunshine", "storm", "moon", "cloud",
    "coffee", "keyboard", "mountain", "river", "forest", "sky", "wind", "light",
    "star", "ocean", "earth", "space"
]


def generate_password():
    # 隨機選擇 2 到 5 個單字
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
    phone_number = '09' + \
        ''.join([str(random.randint(0, 9)) for _ in range(8)])
    return phone_number


# 生成並將 10 個唯一的台灣電話號碼輸出到 output.txt 檔案
unique_phone_numbers = set()  # 用集合來存儲唯一的電話號碼

# 生成電話號碼直到集合中有 10 個唯一的電話號碼
while len(unique_phone_numbers) < 2000:
    taiwan_phone_number = generate_taiwan_phone_number()
    unique_phone_numbers.add(taiwan_phone_number)

i = 0

# 將唯一的電話號碼寫入 output.txt
with open("sql/data/customer.txt", "w") as file:
    for phone_number in unique_phone_numbers:

        i += 1

        if (i % 2):
            # 生成隨機男性名字
            name = names.get_first_name(gender='male')
        else:
            # 生成隨機女性名字
            name = names.get_first_name(gender='female')

        # 使用概率生成 0-100 之間的數字，80% 概率
        if random.random() < 0.8:
            point = random.randint(0, 100)
        else:
            # 使用 20% 概率生成 101-500 之間的數字
            point = random.randint(101, 500)

        password = generate_password()

        file.write(f"insert into customer values({i}, '{
                   name}', '{phone_number}', '{password}', {point});\n")
