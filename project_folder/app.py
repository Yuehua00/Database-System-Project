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
def reservation():  # Change the function name here to 'reservation'
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

    return render_template('reservation.html')  # Render the correct reservation template

# 註冊頁面
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        # 獲取用戶資料
        Customer_name = request.form.get('Customer_name')
        Customer_phoneNumber = request.form.get('Customer_phoneNumber')
        PWD = request.form.get('PWD')

        # 檢查用戶是否已經存在
        conn_obj = conn()
        if conn_obj:
            cursor = conn_obj.cursor()
            query_check = "SELECT * FROM Customer WHERE Customer_phoneNumber = ?"
            cursor.execute(query_check, (Customer_phoneNumber,))
            existing_user = cursor.fetchone()

            if existing_user:
                # 用戶已經註冊
                return "該手機號碼已經註冊，請直接登入。", 400
            else:
                # 用戶未註冊，執行註冊操作
                insert_query = """
                    INSERT INTO Customer (Customer_name, Customer_phoneNumber, PWD)
                    VALUES (?, ?, ?)
                """
                cursor.execute(insert_query, (Customer_name, Customer_phoneNumber, PWD))
                conn_obj.commit()
                cursor.close()
                return redirect(url_for('login'))  # 註冊成功後跳轉到登入頁面
    return render_template('register.html')  # 顯示註冊頁面





if __name__ == '__main__':
    app.run(debug=True)
