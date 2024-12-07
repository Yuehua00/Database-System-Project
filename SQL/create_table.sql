use resturant;

drop table Customer;
drop table Reservation;
drop table desk;
drop table Order_rem;
drop table Dish;
drop table Includes;
drop table Nutrition;
drop table Comment;
drop table Order_Items;

CREATE TABLE Customer (
	Customer_ID INT IDENTITY(1,1),  /* 每次增加 1 */
	Customer_name VARCHAR(100) NOT NULL,
	Customer_phoneNumber VARCHAR(15) NOT NULL,
	PWD VARCHAR(500) NOT NULL,
	Points INT DEFAULT 0,
	PRIMARY KEY(Customer_ID),
);

CREATE TABLE desk (
	Table_ID INT,
	Number_of_Seat INT NOT NULL,
	PRIMARY KEY(Table_ID)
);
	
CREATE TABLE Reservation (
	Reservation_ID INT IDENTITY(1,1),
	TimeSlots VARCHAR(100) NOT NULL,  /* 中午 下午 晚上 */
	Number_of_People INT NOT NULL,
	Reservation_Time DATE NOT NULL, /* 格式 : YYYY-MM-DD */
	PRIMARY KEY(Reservation_ID),
	Customer_ID INT FOREIGN KEY REFERENCES Customer,
	Table_ID INT FOREIGN KEY REFERENCES desk
	UNIQUE (Reservation_Time, TimeSlots, Table_ID)
);

	
CREATE TABLE Order_rem (
	Order_ID INT IDENTITY(1,1),
	Total_price DECIMAL(10, 2) DEFAULT 0,
	PRIMARY KEY(Order_ID),
	Reservation_ID INT FOREIGN KEY REFERENCES Reservation
);

-- 點餐明細表
CREATE TABLE Order_Items (
    Order_Item_ID INT IDENTITY(1,1) PRIMARY KEY, -- 自增主鍵
    Order_ID INT FOREIGN KEY REFERENCES Order_rem(Order_ID), -- 與 Order_rem 表關聯
    Dish_ID INT FOREIGN KEY REFERENCES Dish(Dish_ID), -- 與菜單關聯
    Quantity INT NOT NULL, -- 點的數量
    Price DECIMAL(10, 2) NOT NULL -- 單價
);

CREATE TABLE Dish (
    Dish_ID INT IDENTITY(1,1),         -- 餐點唯一識別碼
    Dish_name VARCHAR(100) NOT NULL,  -- 餐點名稱
    Dish_price DECIMAL(10, 2) NOT NULL, -- 價格
    Category VARCHAR(100),            -- 分類，例如：義大利麵、飲料等
    Recommendation DECIMAL(10, 2) DEFAULT 0,     -- 推薦指數
    PRIMARY KEY(Dish_ID)
);

CREATE TABLE Dish_TimeSlot (
    TimeSlot_ID INT IDENTITY(1,1),    -- 唯一識別碼
    Dish_ID INT NOT NULL,             -- 餐點的 ID（對應到 Dish 表）
    TimeSlot VARCHAR(100) NOT NULL,  -- 時段，例如：lunch、dinner
    FOREIGN KEY (Dish_ID) REFERENCES Dish(Dish_ID) -- 外鍵
);

CREATE TABLE Includes (
	Order_ID INT,
	Dish_ID INT,
	PRIMARY KEY (Order_ID, Dish_ID),
	FOREIGN KEY (Order_ID) REFERENCES Order_rem,
	FOREIGN KEY (Dish_ID) REFERENCES Dish
);
	
CREATE TABLE Nutrition (
	Nutrition_ID INT,
	Nutrient_Name VARCHAR(50),
	Amount DECIMAL(10, 2),  
	Unit VARCHAR(10),
	PRIMARY KEY(Nutrition_ID),
	Dish_ID INT FOREIGN KEY REFERENCES Dish
);
CREATE TABLE Comment (
	Comment_ID INT,
	Conent VARCHAR(500),
	Star INT,
	Comment_Time DATETIME NOT NULL,
	PRIMARY KEY(Comment_ID),
	Dish_ID INT,
	Customer_ID INT FOREIGN KEY REFERENCES Customer
);
