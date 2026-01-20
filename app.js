const express = require("express");
const path = require("path");
const pool = require("./db");

const app = express();
const port = 8080;

app.use(express.urlencoded({ extended: true }));//השרת יודע לקרוא נתונים מטפסים (form)
app.use(express.json());//והשרת יודע לקרוא JSON (כמו שנעשה להזמנות)

// להגיש קבצים סטטיים (HTML/CSS/JS/Images)
app.use(express.static(__dirname));

// דף הבית
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "project.html"));
});


app.get("/test", (req, res) => {//נוסיף נתיב בדיקה כדי לראות שהשרת מגיב.
  res.send("Server is working");
});


app.post("/order", async (req, res) => {
  try {
    const order = req.body;

    const customer = order.customer || {};
    const items = Array.isArray(order.items) ? order.items : [];

    if (items.length === 0) {
      return res.status(400).json({ status: "error", message: "Cart is empty" });
    }

    // לחשב total
    let total = 0;
    for (const it of items) total += Number(it.linetotal) || 0;

    // 1) להכניס הזמנה ל-orders
    const [result] = await pool.execute(
      `INSERT INTO orders (customer_name, customer_email, customer_phone, customer_notes, total)
       VALUES (?, ?, ?, ?, ?)`,
      [
        customer.name || "unknown",
        customer.email || "unknown",
        customer.phone || "unknown",
        customer.notes || "",
        total.toFixed(2)
      ]
    );

    const orderId = result.insertId;

    // 2) להכניס פריטים ל-order_items
    for (const it of items) {
      const addonsText = (it.addons && it.addons.length) ? it.addons.join(" + ") : "WITHOUT ADDONS";

      await pool.execute(
        `INSERT INTO order_items (order_id, drinkname, sizename, addons, qty, unitprice, linetotal)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          it.drinkname || "",
          it.sizename || "",
          addonsText,
          Number(it.qty) || 1,
          Number(it.unitprice || 0).toFixed(2),
          Number(it.linetotal || 0).toFixed(2)
        ]
      );
    }

    return res.json({ status: "ok", message: "Order saved to DB ✅", orderId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "error", message: "DB error" });
  }
});
app.post("/contact", async (req, res) => {
  try {
    const { nameofcustomer, emailofcustomer, phoneofcustomer, messageofcustomer } = req.body;

    const name = nameofcustomer || "";
    const email = emailofcustomer || "";
    const phone = phoneofcustomer || "";
    const message = messageofcustomer || "";

    // INSERT לפי השמות האמיתיים בטבלה שלך
    await pool.execute(
      `INSERT INTO contacts (name, email, phone, message, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [name, email, phone, message]
    );

    res.json({ status: "ok", message: "Contact saved ✅" });
  } catch (err) {
    console.error("contact db error:", err);
    res.status(500).json({ status: "error", message: "DB error" });
  }
});



app.listen(port, () => {
  console.log(`Server running: http://localhost:${port}`);
});


