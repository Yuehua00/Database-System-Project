from flask import Flask, render_template, request, redirect, url_for, session
import pyodbc

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # 設定 session 加密密鑰

# 資料庫連接
def conn():
    try:
        connect = pyodbc.connect(
            'DRIVER={SQL Server};'
            'SERVER=WIN-SQL5CNC3OSL\\SQLEXPRESS;'
            'DATABASE=resturant;'
            'Trusted_Connection=yes;'
        )
        return connect
    except Exception as e:
        print(f"連線失敗: {e}")
        return None

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        # 檢查是否登入
        if 'Customer_ID' not in session:
            # 如果未登入，跳轉到登入頁面
            return redirect(url_for('login'))
        
        # 如果已登入，進行預約操作
        Number_of_People = request.form['Number_of_People']
        TimeSlots = request.form['TimeSlots']
        Reservation_Time = request.form['Reservation_Time']
        customer_id = session['Customer_ID']  # 從 session 獲取 Customer_ID
        
        # 進行預約操作（插入資料）
        conn_obj = conn()
        if conn_obj:
            cursor = conn_obj.cursor()
            insert_query = """
                INSERT INTO Reservation (Reservation_ID, TimeSlots, Number_of_People, Reservation_Time, Customer_ID, Table_ID)
                VALUES (?, ?, ?, ?, ?, ?)
            """
            # 假設 table_id 是事先查詢到的有效桌號
            table_id = 1  
            cursor.execute(insert_query, (None, TimeSlots, Number_of_People, Reservation_Time, customer_id, table_id))
            conn_obj.commit()
            cursor.close()
            return "預約成功"

    return render_template('index.html')

# 登錄頁面
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        # 假設資料庫有一個用戶表格，檢查用戶名和密碼是否匹配
        conn_obj = conn()
        if conn_obj:
            cursor = conn_obj.cursor()
            query = "SELECT Customer_ID FROM Customer WHERE username = ? AND password = ?"
            cursor.execute(query, (username, password))
            user = cursor.fetchone()
            if user:
                # 登錄成功，存儲 session 並跳轉回預約頁面
                session['Customer_ID'] = user.Customer_ID
                return redirect(url_for('index'))
            else:
                # 登錄失敗
                return "無效的用戶名或密碼"
    return render_template('login.html')


if __name__ == '__main__':
    app.run(debug=True)
