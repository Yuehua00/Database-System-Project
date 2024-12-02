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
    
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/menu')
def menu():
    return render_template('menu.html')

@app.route('/cart')
def cart():
    return render_template('cart.html')

@app.route('/reservation', methods=['GET', 'POST'])
def reservation():
    if request.method == 'POST':
        # 檢查是否登入
        if 'Customer_ID' not in session:
            return redirect(url_for('login'))  # 若未登入，跳轉到登入頁
        
        # 預約操作
        Number_of_People = request.form['Number_of_People']
        TimeSlots = request.form['TimeSlots']
        Reservation_Time = request.form['Reservation_Time']
        customer_id = session['Customer_ID']  # 從 session 獲取 Customer_ID
        
        conn_obj = conn()
        if conn_obj:
            cursor = conn_obj.cursor()
            insert_query = """
                INSERT INTO Reservation (Reservation_ID, TimeSlots, Number_of_People, Reservation_Time, Customer_ID, Table_ID)
                VALUES (?, ?, ?, ?, ?, ?)
            """
            table_id = 1  # 假設預設為桌號 1
            cursor.execute(insert_query, (None, TimeSlots, Number_of_People, Reservation_Time, customer_id, table_id))
            conn_obj.commit()
            cursor.close()
            return "預約成功"
    return render_template('reservation.html')

# 登入頁面
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        Customer_phoneNumber = request.form.get('Customer_phoneNumber')
        PWD = request.form.get('PWD')
        
        print(f"Received login data: {Customer_phoneNumber}, {PWD}")  # 確保收到資料
        
        conn_obj = conn()
        if conn_obj:
            cursor = conn_obj.cursor()
            query_check = "SELECT * FROM Customer WHERE Customer_phoneNumber = ?"
            cursor.execute(query_check, (Customer_phoneNumber,))
            existing_user = cursor.fetchone()

            if existing_user:
                # 密碼比對
                if existing_user[3] == PWD:  # 假設 PWD 在第三欄，根據您的資料庫結構可能會有所不同
                    session['Customer_phoneNumber'] = Customer_phoneNumber
                    session['Customer_ID'] = existing_user[0]  # 假設 Customer_ID 是第一欄
                    session['message'] = '登入成功！'
                    return redirect(url_for('index'))  # 成功後跳轉到主頁
                else:
                    return "密碼錯誤，請重新輸入。", 400
            else:
                return "該手機號碼尚未註冊，請先註冊。", 400
            cursor.close()
    return render_template('login.html')

if __name__ == '__main__':
    app.run(debug=True)
