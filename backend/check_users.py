import sqlite3

def check_users():
    conn = sqlite3.connect('issue_tracker.db')
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT email FROM users;")
        rows = cursor.fetchall()
        if not rows:
            print("No users found in database.")
        for row in rows:
            print(f"User found: {row[0]}")
    except sqlite3.OperationalError as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    check_users()
