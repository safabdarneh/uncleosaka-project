//חיבור ל database
const mysql = require("mysql2/promise");

const pool = mysql.createPool({//יצירת מאגר חיבורים למסד הנתונים
  host: "localhost",//כתובת השרת
  user: "root",//שתמש ברירת מחדל
  password: "SAfa#2001",
  database: "uncle_osaka_db",//שם מסד הנתונים
  waitForConnections: true,
  connectionLimit: 10,//משפר חיבורים מקסימלי בו זמנית
  queueLimit: 0//אין הגבלה להכנסת בקשות לתור
});

module.exports = pool;
