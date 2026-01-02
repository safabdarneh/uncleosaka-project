// ===== helpers =====
function numberToMoney(n) {
  return `${Number(n).toFixed(1)}$`;
}

// מבאים ערכים התוך המניו לדף הסיכום
const cartitemsdiv = document.getElementById("cartitem");//המקום של הצגת האלימנטים/המשקאות
const emptydiv = document.getElementById("empty");//כאשר הסלסלה ריקה
const itemcountel = document.getElementById("itemcount");//כמות האלימנטים
const totalel = document.getElementById("total");//מחיר סופי

const clearbtn = document.getElementById("buttonclear");
const donebtn = document.getElementById("buttoncheckout");

let cart = JSON.parse(localStorage.getItem("cart")) || [];//כאשר הסלסלה בדף מניו ריקה מחזירים ][שהיא ריקה]

//  render 
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

for (let i = 0; i < cart.length; i++) {
  const item = cart[i];
  total += item.linetotal;

  const addonstext =item.addons.length > 0 ? item.addons.join(" + ") : "WITHOUT ADDONS";

  // container
  const div = document.createElement("div");
  div.className = "item";


  const span = document.createElement("span");
  span.textContent =
    `drink name: ${item.drinkname}, ` +
    `size: ${item.sizename}, ` +
    `addons: ${addonstext}, ` +
    `amount: ${item.qty} = ${numberToMoney(item.linetotal)}`;

  // כפתור delete
  const deletebtn = document.createElement("button");
  deletebtn.textContent = "delete";
  deletebtn.className = "deletebtn";

  deletebtn.addEventListener("click", function () {
    cart.splice(i, 1); 
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();      
  });

  //הסדר
  div.appendChild(span);
  div.appendChild(deletebtn);
  cartitemsdiv.appendChild(div);
}

//עדכון
  itemcountel.textContent = cart.length;
  totalel.textContent = numberToMoney(total);
}

// ===== events =====
clearbtn.addEventListener("click", function () {
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
});
// כרשר לוחצים על כפתור DONE


donebtn.addEventListener("click", function () {
//לא מאשרים ההזמנה אם היא ריקה
  if (!cart || cart.length === 0) {
    alert("Your cart is empty");
    return;
  }
//להביא הנתונים
  const saved = localStorage.getItem("lastcontactmessage");
  let customerdetails = null;

  if (saved) {
    customerdetails = JSON.parse(saved);
  }

  // אם אין פרטי לקוח – נציג ריק/Unknown (או אפשר לעצור ולהגיד למלא Contact Us)
  const namecutmsg = customerdetails.nameofcustomer || "unknown";
  const emailcutmsg = customerdetails.emailofcustomer || "unknown";
  const phonecutmsg = customerdetails.phoneofcustomer || "unknown";
  const notescutmsg = customerdetails.messageofcustomer || "-";

  //  בונים רשימת פריטים + מחשבים סך הכל
  let total = 0;
  let itemstext = "";

  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];
    total += Number(item.linetotal) || 0;

    const addonstext =
      item.addons && item.addons.length > 0 ? item.addons.join(" + ") : "WITHOUT ADDONS";

    itemstext +=
      `${i + 1}) ${item.drinkname} | size: ${item.sizename} | addons: ${addonstext} | qty: ${item.qty} | line: ${numberToMoney(item.linetotal)}\n`;
  }

  // הודעה מסכמת
  const summary =
    ` your order\n\n` +
    `customer details:\n` +
    `name: ${namecutmsg}\n` +
    `email: ${emailcutmsg}\n` +
    `phone: ${phonecutmsg}\n` +
    `Notes: ${notescutmsg}\n\n` +
    `items:\n${itemstext}\n` +
    `total price: ${numberToMoney(total)}`;

  alert(summary);
});


renderCart();


/*******************************חיבור נצ+תונים מ contact-us */

const savedataofcustomer = localStorage.getItem("lastcontactmessage");

if (savedataofcustomer) {
  const customer = JSON.parse(savedataofcustomer);

  document.getElementById("customername").textContent = customer.nameofcustomer;
  document.getElementById("customeremail").textContent = customer.emailofcustomer;
  document.getElementById("customerphonenumber").textContent = customer.phoneofcustomer;
  document.getElementById("customermessage").textContent = customer.messageofcustomer;

}



