from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask import request, flash, redirect, url_for
import pyodbc
from flask_cors import CORS
import datetime


app = Flask(__name__)
app.secret_key = 'your_secret_key'  # 設定 session 加密密鑰
CORS(app, supports_credentials=True)

# 資料庫連接


def conn():
    try:
        connect = pyodbc.connect(
            'DRIVER={SQL Server};'
            'SERVER=WIN-SQL5CNC3OSL\\SQLEXPRESS;'
            'DATABASE=resturant;'
            'Trusted_Connection=yes;'
        )
        print("Hello Database")
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
    if 'Customer_name' not in session:
        return redirect(url_for('login', next=url_for('reservation'), alert="請先登入"))
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
            cursor.execute(insert_query, (None, TimeSlots,
                           Number_of_People, Reservation_Time, customer_id, table_id))
            conn_obj.commit()
            cursor.close()
            return "預約成功"

    # Render the correct reservation template
    return render_template('reservation.html')

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
                stored_password = existing_user[3]
                if check_password_hash(stored_password, PWD):
                    # 登入成功，儲存用戶名稱到 session
                    session['Customer_phoneNumber'] = Customer_phoneNumber
                    session['Customer_name'] = existing_user[1]  # 假設用戶名是第二個欄位
                    session['Customer_ID'] = existing_user[0]
                    # print("Login Success: Session Data:", session)
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
        Ori_PWD = request.form.get('PWD')
        PWD = generate_password_hash(Ori_PWD)

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
                cursor.execute(insert_query, (Customer_name,
                               Customer_phoneNumber, PWD))
                conn_obj.commit()
                cursor.close()
                return jsonify({'status': 'success', 'message': '註冊成功，請登入。'})
        return jsonify({'status': 'error', 'message': '資料庫連接失敗。'})


@app.route('/logout')
def logout():
    session.pop('Customer_phoneNumber', None)  # 清除登入的電話號碼
    session.pop('Customer_name', None)  # 清除用戶名
    return redirect(url_for('index'))  # 重新導向到首頁


@app.route('/change-password', methods=['POST'])
def change_password():
    # 確保使用者已登入
    if 'Customer_ID' not in session:
        return jsonify({"success": False, "message": "請先登入"})

    customer_id = session.get('Customer_ID')
    new_password = request.json.get('new_password')

    # 驗證新密碼的合法性
    if not new_password or len(new_password) < 6:
        return jsonify({"success": False, "message": "密碼長度必須大於6個字符"})

    try:
        # 更新密碼到資料庫
        conn_obj = conn()  # 資料庫連接
        if not conn_obj:
            return jsonify({"success": False, "message": "資料庫連接失敗"})

        cursor = conn_obj.cursor()
        query = """
            UPDATE Customer
            SET PWD = ?
            WHERE Customer_ID = ?
        """
        cursor.execute(query, (new_password, customer_id))
        conn_obj.commit()  # 提交更改
        cursor.close()
        conn_obj.close()

        return jsonify({"success": True, "message": "密碼修改成功"})

    except Exception as e:
        print(f"Error changing password: {e}")
        return jsonify({"success": False, "message": "修改密碼時出錯"})


@app.route('/save_reservation', methods=['POST'])
def save_reservation():
    try:
        data = request.get_json()
        table_number = data.get('Table_Number')
        cart = data.get('Cart')
        print("接收到的數據:", data)  # 調試用
        if not data:
            return jsonify({"status": "error", "message": "缺少請求數據"}), 400

        # 檢查必要字段
        required_fields = ['Number_of_People',
                           'Reservation_Time', 'TimeSlots', 'Table_Number', 'Cart']
        missing_fields = [
            field for field in required_fields if field not in data or not data[field]]
        if missing_fields:
            return jsonify({
                "status": "error",
                "message": f"缺少必要字段: {', '.join(missing_fields)}"
            }), 400

        # 獲取字段
        customer_id = session.get('Customer_ID')
        number_of_people = data['Number_of_People']
        reservation_time = data['Reservation_Time']
        time_slots = data['TimeSlots']
        table_number = data['Table_Number']
        cart = data['Cart']

        print("Customer_ID:", customer_id)

        # 驗證字段是否完整
        if not all([customer_id, number_of_people, reservation_time, time_slots, table_number]):
            return jsonify({"status": "error", "message": "缺少必要字段"}), 400

        conn_obj = conn()
        if not conn_obj:
            return jsonify({"status": "error", "message": "資料庫連接失敗"}), 500

        cursor = conn_obj.cursor()

        # 插入 Reservation 並獲取 Reservation_ID
        cursor.execute("""
            INSERT INTO Reservation (Number_of_People, Reservation_Time, TimeSlots, Customer_ID, Table_ID)
            OUTPUT INSERTED.Reservation_ID
            VALUES (?, ?, ?, ?, ?);
        """, (number_of_people, reservation_time, time_slots, customer_id, table_number))
        reservation_id_row = cursor.fetchone()
        if not reservation_id_row:
            raise Exception("無法獲取 Reservation_ID")
        reservation_id = reservation_id_row[0]
        print("Reservation_ID:", reservation_id)

        # 計算總價
        total_price = sum(item['quantity'] * item['price'] for item in cart)

        # 插入 Order_rem 並獲取 Order_ID
        cursor.execute("""
            INSERT INTO Order_rem (Reservation_ID, Total_price)
            OUTPUT INSERTED.Order_ID
            VALUES (?, ?);
        """, (reservation_id, total_price))
        order_id_row = cursor.fetchone()
        if not order_id_row:
            raise Exception("無法獲取 Order_ID")
        order_id = order_id_row[0]
        print("Order_ID:", order_id)

        # 插入 Includes
        for item in cart:
            cursor.execute("""
                INSERT INTO Includes (Order_ID, Dish_ID, Quantity, Price)
                VALUES (?, ?, ?, ?);
            """, (order_id, item['id'], item['quantity'], item['price']))

        # 提交交易
        conn_obj.commit()

        return jsonify({"status": "success", "message": "訂位成功"})

    except Exception as e:
        print(f"保存訂位信息時發生錯誤: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route('/get_customer_info')
def get_customer_info():
    customer_id = session.get('Customer_ID')
    if 'Customer_name' in session and 'Customer_phoneNumber' in session:
        return jsonify({
            'status': 'success',
            'name': session['Customer_name'],
            'phone': session['Customer_phoneNumber'],
            'customer_id': session['Customer_ID']
        })
    else:
        return jsonify({'status': 'fail', 'message': 'User not logged in'}), 401


@app.route('/available_tables', methods=['GET'])
def available_tables():
    people_count = request.args.get('people_count')
    reservation_time = request.args.get('reservation_time')
    time_slot = request.args.get('time_slot')

    print("查詢參數:", (people_count, reservation_time, time_slot))

    conn_obj = conn()
    if not conn_obj:
        print("資料庫連接失敗")
        return jsonify({'status': 'error', 'message': '資料庫連接失敗'}), 500

    available_tables = []  # 初始化 available_tables

    try:
        cursor = conn_obj.cursor()
        query = """
        SELECT Table_ID
        FROM desk d
        WHERE d.Number_of_Seat >= ?
        AND d.Table_ID NOT IN (
            SELECT r.Table_ID
            FROM Reservation r
            WHERE r.Reservation_Time = ?
            AND r.TimeSlots = ?
        )
        """
        cursor.execute(query, (people_count, reservation_time, time_slot))
        available_tables = [row[0] for row in cursor.fetchall()]
        print("可用桌子:", available_tables)
    except Exception as e:
        print("Error fetching available tables:", e)
        return jsonify({'status': 'error', 'message': '查詢可用桌子失敗'}), 500
    finally:
        conn_obj.close()

    return jsonify({'status': 'success', 'available_tables': available_tables})

# 預約後呼叫品項提供選擇


@app.route('/get_menu', methods=['GET'])
def get_menu():
    try:
        conn_obj = conn()
        if not conn_obj:
            return jsonify({'status': 'error', 'message': '資料庫連接失敗'}), 500

        cursor = conn_obj.cursor()

        time_slot = request.args.get('timeSlot')
        if not time_slot:
            return jsonify({'status': 'error', 'message': '缺少時段參數'}), 400

        cursor.execute("""
            SELECT DISTINCT d.Dish_ID, d.Dish_name, d.Dish_price, d.Category, t.TimeSlot, d.Recommendation
            FROM Dish d
            JOIN Dish_TimeSlot t ON d.Dish_ID = t.Dish_ID
            WHERE t.TimeSlot = ?
        """, (time_slot,))
        dishes = cursor.fetchall()

        if not dishes:
            return jsonify({'status': 'error', 'message': f'無此時段({time_slot})的菜單資料'}), 404

        menu_data = [
            {
                'id': dish[0],
                'name': dish[1],
                'price': float(dish[2]),
                'category': dish[3],
                'timeSlots': dish[4],
                'recommendation': float(dish[5])
            }
            for dish in dishes
        ]

        cursor.close()
        conn_obj.close()

        return jsonify({'status': 'success', 'menu': menu_data})
    except Exception as e:
        print("Error:", e)
        return jsonify({'status': 'error', 'message': '資料庫操作失敗', 'error': str(e)}), 500


@app.route('/get_pre_menu', methods=['GET'])
def get_pre_menu():
    try:
        conn_obj = conn()
        if not conn_obj:
            raise Exception("資料庫連接失敗")

        cursor = conn_obj.cursor()
        query = """
            SELECT d.Dish_ID, d.Dish_name, d.Dish_price, d.Category, d.Recommendation, 
                   n.Nutrient_Name, n.Amount, n.Unit,
                   c.Conent, c.Star, c.Comment_Time
            FROM Dish d
            LEFT JOIN Nutrition n ON d.Dish_ID = n.Dish_ID
            LEFT JOIN Comment c ON d.Dish_ID = c.Dish_ID
        """
        cursor.execute(query)
        rows = cursor.fetchall()

        # Process rows to prevent duplicate entries
        menu = {}
        for row in rows:
            dish_id = row[0]
            if dish_id not in menu:
                menu[dish_id] = {
                    "id": dish_id,
                    "name": row[1],
                    "price": float(row[2]),
                    "category": row[3],
                    "recommendation": float(row[4]) if row[4] else None,
                    "nutrition": [],
                    "comments": []
                }
            # Add nutrition data if not already added
            nutrition_entry = {
                "name": row[5],
                "amount": float(row[6]) if row[6] else None,
                "unit": row[7] if row[7] else ""
            }
            if nutrition_entry not in menu[dish_id]["nutrition"]:
                menu[dish_id]["nutrition"].append(nutrition_entry)

            # Add comment data if not already added
            if row[8]:  # Ensure comment exists
                comment_entry = {
                    "content": row[8],
                    "star": int(row[9]) if row[9] else None,
                    "time": row[10].strftime("%Y-%m-%d") if row[10] else ""
                }
                if comment_entry not in menu[dish_id]["comments"]:
                    menu[dish_id]["comments"].append(comment_entry)

        return jsonify({"status": "success", "menu": list(menu.values())}), 200
    except Exception as e:
        print(f"Error in /get_pre_menu: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500



# def query_customer_data(customer_id):
#     try:
#         conn_obj = conn()  # 建立資料庫連線
#         if not conn_obj:
#             return None

#         cursor = conn_obj.cursor()
#         query = """
#             SELECT Customer_name, Customer_phoneNumber, PWD, Points
#             FROM Customer
#             WHERE Customer_ID = ?
#         """
#         cursor.execute(query, (customer_id,))
#         customer_data = cursor.fetchone()
#         cursor.close()
#         conn_obj.close()

#         if customer_data:
#             return {
#                 'name': customer_data[0],
#                 'phone': customer_data[1],
#                 'PWD': customer_data[2],
#                 'point': customer_data[3],
#             }
#         return None
#     except Exception as e:
#         print(f"Error querying customer data: {e}")
#         return None


@app.route('/member')
def member():
    try:
        # 獲取當前用戶 ID
        customer_id = session.get('Customer_ID')
        if not customer_id:
            return redirect(url_for('login'))

        conn_obj = conn()
        cursor = conn_obj.cursor()

        # 獲取會員資料
        cursor.execute(
            "SELECT Customer_name, Customer_phoneNumber, Points FROM Customer WHERE Customer_ID = ?", (customer_id,))
        customer = cursor.fetchone()
        if not customer:
            return jsonify({"status": "error", "message": "找不到會員資料"}), 404

        customer_data = {
            "name": customer[0],
            "phone": customer[1],
            "point": customer[2]
        }

        # 獲取訂單資訊
        cursor.execute("""
            SELECT o.Order_ID, r.Reservation_Time, o.Total_price
            FROM Order_rem o
            JOIN Reservation r ON o.Reservation_ID = r.Reservation_ID
            WHERE r.Customer_ID = ?
            ORDER BY r.Reservation_Time DESC
        """, (customer_id,))
        orders = cursor.fetchall()

        order_list = []
        for order in orders:
            cursor.execute("""
                SELECT d.Dish_name, oi.Quantity, oi.Price
                FROM Includes oi
                JOIN Dish d ON oi.Dish_ID = d.Dish_ID
                WHERE oi.Order_ID = ?
            """, (order[0],))
            items = cursor.fetchall()

            order_list.append({
                "id": order[0],
                "date": order[1],
                "total": order[2],
                "items": [{"name": item[0], "quantity": item[1], "price": item[2]} for item in items]
            })

        return render_template('member.html', customer=customer_data, orders=order_list)
    except Exception as e:
        print(f"Error fetching member or order data: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500


# 修改密碼
@app.route('/update_password', methods=['POST'])
def update_password():
    if 'Customer_ID' not in session:
        return jsonify({'success': False, 'message': '請先登入'}), 403  # 未登入

    customer_id = session.get('Customer_ID')

    # 接收 JSON 數據
    data = request.get_json()
    new_password = data.get('new_password')
    confirm_password = data.get('confirm_password')

    # 檢查密碼是否一致
    if new_password != confirm_password:
        return jsonify({'success': False, 'message': '密碼不一致，請重新輸入。'}), 400

    if not new_password or len(new_password) < 6:
        return jsonify({'success': False, 'message': '密碼不得為空，且至少需6個字元'}), 400

    # 將密碼加密後再存入資料庫
    hashed_password = generate_password_hash(new_password)

    try:
        # 更新密碼
        conn_obj = conn()  # 建立資料庫連線
        if not conn_obj:
            return jsonify({'success': False, 'message': '資料庫連線失敗'}), 500

        cursor = conn_obj.cursor()
        query = """
            UPDATE Customer
            SET PWD = ?
            WHERE Customer_ID = ?
        """
        cursor.execute(query, (hashed_password, customer_id))
        conn_obj.commit()
        cursor.close()
        conn_obj.close()

        return jsonify({'success': True, 'message': '密碼已成功修改'}), 200
    except Exception as e:
        print(f"Error updating password: {e}")
        return jsonify({'success': False, 'message': '修改密碼失敗'}), 500


@app.route('/update_customer_info', methods=['POST'])
def update_customer_info():
    # 檢查是否已登入
    if 'Customer_ID' not in session:
        return jsonify({'success': False, 'message': '未登入，請先登入！'})

    customer_id = session['Customer_ID']
    data = request.json

    name = data.get('name')
    phone = data.get('phone')
    new_password = data.get('password')

    try:
        # 資料庫連接
        conn_obj = conn()
        if not conn_obj:
            return jsonify({'success': False, 'message': '資料庫連線失敗！'})

        cursor = conn_obj.cursor()

        # 更新姓名和手機號碼，並確保手機號碼未被其他用戶使用
        update_query = """
            UPDATE Customer
            SET Customer_name = ?,
                Customer_phoneNumber = ?
            WHERE Customer_ID = ?
                AND NOT EXISTS (
                    SELECT 1 FROM Customer
                    WHERE Customer_phoneNumber = ?
                      AND Customer_ID != ?
                );
        """
        params = [name, phone, customer_id, phone, customer_id]

        # 如果提供了新密碼，則加密後一起更新
        if new_password:
            hashed_password = generate_password_hash(new_password)
            update_query = """
                UPDATE Customer
                SET Customer_name = ?,
                    Customer_phoneNumber = ?,
                    PWD = ?
                WHERE Customer_ID = ?
                    AND NOT EXISTS (
                        SELECT 1 FROM Customer
                        WHERE Customer_phoneNumber = ?
                          AND Customer_ID != ?
                    );
            """
            params = [name, phone, hashed_password, customer_id, phone, customer_id]

        cursor.execute(update_query, params)
        conn_obj.commit()

        # 判斷更新是否成功
        if cursor.rowcount > 0:
            response = {'success': True, 'message': '會員資料更新成功！'}
        else:
            response = {'success': False, 'message': '該電話號碼已被使用，更新失敗！'}

        cursor.close()
        conn_obj.close()

        return jsonify(response)

    except Exception as e:
        print(f"Error updating customer info: {e}")
        return jsonify({'success': False, 'message': '更新失敗，請稍後重試。'})


@app.route('/submit_order', methods=['POST'])
def submit_order():
    try:
        order_data = request.get_json()  # 接收訂單資料
        # 例如： [{"id": 1, "quantity": 2}, {"id": 3, "quantity": 1}]

        if not order_data:
            return jsonify({'status': 'error', 'message': '訂單資料為空'}), 400

        # 處理訂單資料，儲存到資料庫或執行其他操作
        for item in order_data:
            dish_id = item['id']
            quantity = item['quantity']
            # 在此處執行儲存或更新資料庫的操作

        return jsonify({'status': 'success', 'message': '訂單已送出'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# 取消訂單


@app.route('/cancel_order/<int:order_id>', methods=['DELETE'])
def cancel_order(order_id):
    try:
        conn_obj = conn()
        if not conn_obj:
            return jsonify({"status": "error", "message": "資料庫連接失敗"}), 500

        cursor = conn_obj.cursor()

        # 刪除訂單明細
        delete_Includes_query = "DELETE FROM Includes WHERE Order_ID = ?"
        cursor.execute(delete_Includes_query, (order_id,))

        # 刪除訂單總表
        delete_order_query = "DELETE FROM Order_rem WHERE Order_ID = ?"
        cursor.execute(delete_order_query, (order_id,))

        conn_obj.commit()
        return jsonify({"status": "success", "message": "訂單已成功取消"})
    except Exception as e:
        print(f"取消訂單時發生錯誤: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route('/submit_comment', methods=['POST'])
def submit_comment():
    try:
        data = request.get_json()
        content = data.get('comment', '').strip()
        star = data.get('star')
        dish_id = data.get('dish_id')
        customer_id = session.get('Customer_ID')
        print(data)
        star = int(star)
        # 驗證必要參數
        if not all([content, star, dish_id, customer_id]):
            return jsonify({'status': 'error', 'message': '缺少必要的參數'}), 400

        comment_time = datetime.datetime.now()  # 獲取當前時間

        conn_obj = conn()
        cursor = conn_obj.cursor()
        cursor.execute("INSERT INTO Comment (Conent, Star, Comment_Time, Dish_ID, Customer_ID) VALUES (?, ?, ?, ?, ?)",
                       (content, star, comment_time, dish_id, customer_id))
        conn_obj.commit()
        cursor.close()

        return jsonify({'status': 'success', 'message': '評論提交成功', 'data': {
            'content': content,
            'star': star,
            'comment_time': comment_time.strftime('%Y-%m-%d %H:%M:%S'),
            'dish_id': dish_id,
            'customer_id': customer_id
        }})
    except Exception as e:
        print(f"提交評論時發生錯誤: {e}")
        return jsonify({'status': 'error', 'message': '伺服器錯誤'}), 500


if __name__ == '__main__':
    app.run(debug=True)
