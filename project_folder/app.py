from flask import Flask, render_template, request, redirect, url_for, session, jsonify
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

# 登錄頁面
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        Customer_phoneNumber = request.form.get('Customer_phoneNumber')
        PWD = request.form.get('PWD')
        
        conn_obj = conn()
        if conn_obj:
            cursor = conn_obj.cursor()
            query_check = "SELECT * FROM Customer WHERE Customer_phoneNumber = ?"
            cursor.execute(query_check, (Customer_phoneNumber,))
            existing_user = cursor.fetchone()

            if existing_user:
                if existing_user[3] == PWD:
                    # 登入成功，儲存用戶名稱到 session
                    session['Customer_phoneNumber'] = Customer_phoneNumber
                    session['Customer_name'] = existing_user[1]  # 假設用戶名是第二個欄位
                    # session['Customer_ID'] = existing_user[0]
                    return jsonify({'status': 'success', 'message': '登入成功！'})
                else:
                    return jsonify({'status': 'error', 'message': '密碼錯誤，請重新輸入。'})
            else:
                return jsonify({'status': 'error', 'message': '該手機號碼尚未註冊，請先註冊。'})
            cursor.close()
    return render_template('login.html')



@app.route('/register', methods=['POST'])
def register():
    if request.method == 'POST':
        Customer_name = request.form.get('Customer_name')
        Customer_phoneNumber = request.form.get('Customer_phoneNumber')
        PWD = request.form.get('PWD')
        
        conn_obj = conn()
        if conn_obj:
            cursor = conn_obj.cursor()
            query_check = "SELECT * FROM Customer WHERE Customer_phoneNumber = ?"
            cursor.execute(query_check, (Customer_phoneNumber,))
            existing_user = cursor.fetchone()

            if existing_user:
                return jsonify({'status': 'error', 'message': '該手機號碼已被註冊，請使用其他號碼。'})
            else:
                insert_query = "INSERT INTO Customer (Customer_name, Customer_phoneNumber, PWD) VALUES (?, ?, ?)"
                cursor.execute(insert_query, (Customer_name, Customer_phoneNumber, PWD))
                conn_obj.commit()
                cursor.close()
                return jsonify({'status': 'success', 'message': '註冊成功，請登入。'})
        return jsonify({'status': 'error', 'message': '資料庫連接失敗。'})

@app.route('/logout')
def logout():
    session.pop('Customer_phoneNumber', None)  # 清除登入的電話號碼
    session.pop('Customer_name', None)  # 清除用戶名
    return redirect(url_for('index'))  # 重新導向到首頁

@app.route('/member')
def member():
    if 'Customer_name' not in session:
        return redirect(url_for('login'))  # 未登入則跳轉到登入頁面
    return render_template('member.html', customer_name=session['Customer_name'])

@app.route('/save_reservation', methods=['POST'])
def save_reservation():
    if 'Customer_name' not in session:
        return jsonify({'status': 'error', 'message': '請先登入'})

    # 獲取訂位信息
    Number_of_People = request.form.get('Number_of_People')
    Reservation_Time = request.form.get('Reservation_Time')
    TimeSlots = request.form.get('TimeSlots')
    Customer_ID = session.get('Customer_ID')  # 使用 session 中的用户 ID

    print("Received Data:", {
        'Number_of_People': Number_of_People,
        'Reservation_Time': Reservation_Time,
        'TimeSlots': TimeSlots,
        'Customer_ID': Customer_ID,
    })

    try:
        conn_obj = conn()
        if not conn_obj:
            return jsonify({'status': 'error', 'message': '資料庫連線失敗'})

        cursor = conn_obj.cursor()

        # 查詢空桌
        query_available_table = """
            SELECT TOP 1 Table_ID
            FROM desk d
            WHERE d.Number_of_Seat >= ?  -- 確保桌子有足夠的座位
            AND d.Table_ID NOT IN (
                SELECT r.Table_ID
                FROM Reservation r
                WHERE r.Reservation_Time = ?  -- 只匹配日期部分
                AND r.TimeSlots = ?  -- 查找指定時段
            )
            ORDER BY d.Number_of_Seat ASC;  -- 優先分配最小的合適桌位
        """
        cursor.execute(query_available_table, (Number_of_People, Reservation_Time, TimeSlots))
        available_table = cursor.fetchone()

        if not available_table:
            return jsonify({'status': 'error', 'message': '無可用桌位，請選擇其他時間'})

        Table_ID = available_table[0]

        # 插入訂位資訊到資料庫
        query_insert_reservation = """
            INSERT INTO Reservation (TimeSlots, Number_of_People, Reservation_Time, Customer_ID, Table_ID)
            VALUES (?, ?, ?, ?, ?)
        """
        cursor.execute(query_insert_reservation, (TimeSlots, Number_of_People, Reservation_Time, Customer_ID, Table_ID))
        conn_obj.commit()

        cursor.close()
        conn_obj.close()

        return jsonify({'status': 'success', 'message': '訂位成功，桌號已分配', 'Table_ID': Table_ID})
    except Exception as e:
        print("Error:", e)
        return jsonify({'status': 'error', 'message': '資料庫操作失敗'}), 500

@app.route('/available_tables', methods=['GET'])
def available_tables():
    # 獲取請求參數
    people_count = request.args.get('people_count')
    reservation_date = request.args.get('reservation_time')
    time_slot = request.args.get('time_slot')  # 接收時段參數
    # print("Received parameters:", people_count, reservation_date, time_slot)
    # print("Received GET parameters:", request.args)

    if not people_count or not reservation_date or not time_slot:
        return jsonify({'status': 'error', 'message': '缺少參數'}), 400
    
    try:
        conn_obj = conn()  # 連接資料庫
        cursor = conn_obj.cursor()

        # 查詢空桌
        query = """
            SELECT Table_ID
            FROM desk d
            WHERE d.Number_of_Seat >= ?  -- 確保桌子有足夠的座位
            AND d.Table_ID NOT IN (
                SELECT r.Table_ID
                FROM Reservation r
                WHERE r.Reservation_Time = ?  -- 只匹配日期部分
                AND r.TimeSlots = ?  -- 查找指定時段
            );


        """
        cursor.execute(query, (people_count, reservation_date, time_slot))
        available_tables = cursor.fetchall()

        cursor.close()
        conn_obj.close()

        # 回傳可用桌
        if available_tables:
            table_ids = [row[0] for row in available_tables]
            return jsonify({'status': 'success', 'available_tables': table_ids})
        else:
            return jsonify({'status': 'success', 'available_tables': []})
    except Exception as e:
        print("Error:", e)
        return jsonify({'status': 'error', 'message': '資料庫查詢失敗'}), 500





if __name__ == '__main__':
    app.run(debug=True)
