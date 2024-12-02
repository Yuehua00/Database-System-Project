with open('sql/data/desk.txt', 'w') as file:
    for n in range(1, 51):
        if n <= 20:
            a = 2
        else:
            a = 4
        file.write(f"insert into desk values({n}, {a});\n")
