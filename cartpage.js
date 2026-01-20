//פונקצית עזר שמקבלת מסבר ומחזירה אותו כמחיר
function numberToMoney(n) {
  return `${Number(n).toFixed(1)}$`;
}

// מבאים ערכים מתוך המניו לדף הסיכום
const cartitemsdiv = document.getElementById("cartitem");//המקום של הצגת המשקאות-פרטי הסל
const emptydiv = document.getElementById("empty");//כאשר הסלסלה ריקה
const itemcountel = document.getElementById("itemcount");// כמות האלימנטים 
const totalel = document.getElementById("total");//מחיר סופי
//כפתורים
const clearbtn = document.getElementById("buttonclear");
const donebtn = document.getElementById("buttoncheckout");
//******************************שלב טעינת הסל */
let cart = JSON.parse(localStorage.getItem("cart")) || [];//כאשר הסלסלה בדף מניו ריקה מחזירים שהיא ריקה]

//פונקציה מייצרת הסל בעמוד
function renderCart() {
  cartitemsdiv.innerHTML = "";

  if (cart.length === 0) {//אם הסלסלה ריקה
    emptydiv.classList.remove("hidden");
    itemcountel.textContent = "0";
    totalel.textContent = numberToMoney(0);
    return;
  }

  emptydiv.classList.add("hidden");//הסתרת הודעה שהסלסלה ריקה

  let total = 0;
//המעבר על הפרטים בסל
for (let i = 0; i < cart.length; i++) {
  const item = cart[i];
  total += item.linetotal;

  const addonstext =item.addons.length > 0 ? item.addons.join(" + ") : "WITHOUT ADDONS";//איך יופיע הטקסט של התוספת

  // יציקת קונטיינר
  const div = document.createElement("div");
  div.className = "item";

//יצירת טקסט הפריט
  const span = document.createElement("span");
  span.textContent =
    `drink name: ${item.drinkname}, ` +
    `size: ${item.sizename}, ` +
    `addons: ${addonstext}, ` +
    `amount: ${item.qty} = ${numberToMoney(item.linetotal)}`;

  //  כפתור לפריט בודדdelete
  const deletebtn = document.createElement("button");
  deletebtn.textContent = "delete";
  deletebtn.className = "deletebtn";
//מחיקת הפריט מהסל
  deletebtn.addEventListener("click", function () {
    cart.splice(i, 1); 
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();      
  });

  //הסדר- הוספת אלימנטים לעמוד
  div.appendChild(span);
  div.appendChild(deletebtn);
  cartitemsdiv.appendChild(div);
}

//עדכון
  itemcountel.textContent = cart.length;//עדכון כמות הפירטים
  totalel.textContent = numberToMoney(total);//עדכון המחיר הסופי
}
//ניקוי כל הסל
clearbtn.addEventListener("click", function () {
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();//עדכון תצוגה
});
//כראשר לוחצים על כפתור DONE

donebtn.addEventListener("click", async function () {
  // 1) לא מאשרים אם הסל ריק
  if (!cart || cart.length === 0) {
    alert("Your cart is empty");
    return;
  }

  //שליפת פרטי הלקוח
  const saved = localStorage.getItem("lastcontactmessage");
  const customerdetails = saved ? JSON.parse(saved) : null;
//בניית אובייקט הזמנה
  const order = {
    customer: {
      name: customerdetails?.nameofcustomer || "unknown",
      email: customerdetails?.emailofcustomer || "unknown",
      phone: customerdetails?.phoneofcustomer || "unknown",
      notes: customerdetails?.messageofcustomer || "-"
    },
    items: cart,
    createdAt: new Date().toISOString()
  };

  try {  // שליחת ההזמנה לשרת
    const resp = await fetch("/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order)
    });

    if (!resp.ok) {
      throw new Error("Server error: " + resp.status);
    }

    const data = await resp.json();

    //  הודעת הצלחה למשתמש
    alert("✅ Order sent!\n" + (data.message || ""));
   if (data.orderId) localStorage.setItem("lastOrderId", String(data.orderId));//לשמור מספר ההזמנה בתוך העמוד thankyou

//ניקוי הסל    
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();

//המעבר לעמוד הבא 
    window.location.href = "thankyou.html";

  } catch (err) {
    console.error(err);
    alert("❌ Failed to send order. Check the server / console.");
  }
});

renderCart();//ציור הסל בטעינת העמוד

/*******************************חיבור נתונים מ contact-us */

const savedataofcustomer = localStorage.getItem("lastcontactmessage");

if (savedataofcustomer) {
  const customer = JSON.parse(savedataofcustomer);

  document.getElementById("customername").textContent = customer.nameofcustomer;
  document.getElementById("customeremail").textContent = customer.emailofcustomer;
  document.getElementById("customerphonenumber").textContent = customer.phoneofcustomer;
  document.getElementById("customermessage").textContent = customer.messageofcustomer;

}


