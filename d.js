//פונקיה ממירה את המחיר למספר רגיל
function moneyToNumber(str) {
  if (!str) return 0;
  return Number(String(str).replace("$", "").trim());
}
// משמיט $ ומגדיר אותו כמספר

function numberToMoney(n) {
  return `${Number(n).toFixed(1)}$`;
}

// ***********************בחירת המשקה
const cards = document.querySelectorAll(".card");//נשמור את כל המשקאות במקום אחד
const selectedname = document.getElementById("selectedname");//נשמור את שם המשקה שבחרנו בDRINK NAME במקום הקו 

// שמירת שם המשקה 
        function selectdrink(card) {
        const drinkname = card.dataset.name; //drinkname הוא משתנה שישמור בתוכו את את שם המשקה שבחרנו
        selectedname.textContent = drinkname;
                                   }
//אחרי הלחיצה על המשקה שבחנו ישמור השם בDRUNKNAME במקום הקו
     for (let i = 0; i < cards.length; i++) {
  cards[i].addEventListener("click", function () {//כדי להוריד הבחירה
    for (let j = 0; j < cards.length; j++) {
      cards[j].classList.remove("selected");
    }
    // אם בחרנו אותו יופיע קו מסביב
    cards[i].classList.add("selected");
    selectdrink(cards[i]);
  });
}

//כדי שנראה איזה משקה בחרנו
for (let i = 0; i < cards.length; i++) {
  cards[i].addEventListener("click", function () {

    for (let j = 0; j < cards.length; j++) cards[j].classList.remove("selected");
    cards[i].classList.add("selected");

    selectdrink(cards[i]);
  });
}

//************************************ the choice */


const selectedprice = document.getElementById("selectedprice");//הגדרת משתנה שישמור בתוכו המחיר של 
const sizeoptions = document.querySelectorAll(".sizeoption");// כל הגדלים במקום אחד

let selectedsize = null;//משתנה לשמור גודל המשקה

for (let i = 0; i < sizeoptions.length; i++) {
  sizeoptions[i].addEventListener("change", function () {
//שמירת הגודל
   selectedsize = {
      name: sizeoptions[i].dataset.name,
      price: sizeoptions[i].dataset.price
    };
        //איפה המחיר יופיע
    selectedprice.textContent = selectedsize.price;//הצגה
     justsizeprice=Number(sizeoptions[i].dataset.price.replace("$",""));
     updateprice(); //שינוי הגודל אחרי בחירת התוספת מעדכן המחיר

  });
}

//**********תןספות */

const addonoptions = document.querySelectorAll(".addon");//מחרוזת מכילה כל התוספות

//שמירת הבחירות של התוספות
let selectedaddons = [];   // ["Extra shot", "Soy milk", ...] תוספות שבחרנו
let addonstotal = 0;       // מחיר התוספות שבחרנו

function updateaddons() {//שמירת התוספות וחישוב המחיר הסופי של התוספות שנבחרו
  selectedaddons = [];
  addonstotal = 0;

  for (let i = 0; i < addonoptions.length; i++) {
    if (addonoptions[i].checked) {
      selectedaddons.push(addonoptions[i].dataset.name);
      addonstotal += Number(addonoptions[i].dataset.price.replace("$", ""));
    }
  }

  updateprice(); // עדכון המחיר אחרי חישוב התוספות
}

// קשור ל checkbox
for (let i = 0; i < addonoptions.length; i++) {
  addonoptions[i].addEventListener("change", updateaddons);
}
 
let justsizeprice = 0; // נגדיר המשתנים כגלובלי
let finalprice = 0;

function updateprice() {
  finalprice = justsizeprice + addonstotal;
  selectedprice.textContent = finalprice.toFixed(1) + "$";
}
const qty = Number(document.getElementById("qty").value) || 1;
const linetotal = finalprice * qty;



// ********************* CART ***************
const addbtn = document.getElementById("addtocart");
const cartlist = document.getElementById("cartList");
const totalel = document.getElementById("total");
const clearbtn = document.getElementById("clearcart");

let cart = []; // האלימנטים בסלסלה 
// تحميل السلة من التخزين (مرة وحدة عند فتح الصفحة)
const saved = localStorage.getItem("cart");
if (saved) {
  cart = JSON.parse(saved);
}


function rendertotal() {
  let sum = 0;
  for (let i = 0; i < cart.length; i++) sum += cart[i].linetotal;
  totalel.textContent = numberToMoney(sum);
}

function resetchoices() {//פונקצעה שמוחקת משנבחר
  // מחיקת המשקה
  selectedname.textContent = "________";
  updateprice();
  // נמחק הCLASS שנבחר מהפרום
  for (let i = 0; i < cards.length; i++) cards[i].classList.remove("selected");

  // מחיקת הגודל שנבחר
  for (let i = 0; i < sizeoptions.length; i++) sizeoptions[i].checked = false;

  // מחירת התוספות שנבחרו
  for (let i = 0; i < addonoptions.length; i++) addonoptions[i].checked = false;

  // מחיקת הכמות הנבחרת
  document.getElementById("qty").value = 1;

  // מחיקת הערכים שנשמרו
  selectedsize = null;
  selectedaddons = [];
  addonstotal = 0;
  justsizeprice = 0;
  finalprice = 0;

  // update UI price
  selectedprice.textContent = "________";
}

addbtn.addEventListener("click", function () {
  const drinkname = selectedname.textContent.trim();
  if (!drinkname || drinkname === "________") {
    alert("select drink first!");//לא יתווסף לסלסה אם לא בחרנו המשקה
    return;
  }

  if (!selectedsize) {//לא יתווסף לסלסלה אם לא בחרנו הגודל
    alert("select size first !!");
    return;
  }

  const qty = Number(document.getElementById("qty").value) || 1;//נשמור הכמות כמספר כדי שנוכל להשתמש בו בפעילות הארתמטיות


  const linetotal = finalprice * qty;// מחיר סופי המחיר של הגודל והתוספות כפול הכמות 
//הכתיב של התוספות 
  let addonsText = "WITHOUT ADDONS ";
  if (selectedaddons.length > 0) addonsText = selectedaddons.join(" + ");

  // אלימנט חדש בסלסלה -עוד משקה
  const item = {
    drinkname: drinkname,
    sizename: selectedsize.name,
    addons: [...selectedaddons],
    qty: qty,
    unitprice: finalprice, // מחיר המשקה הגודל והתוספות
    linetotal: linetotal
  };

  cart.push(item);
  saveCart();
// שמירת הערכית בתוך הסלסלה

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}


  // ******************************הצגה ב CART

 

  const li = document.createElement("li");
  li.textContent =
    `${item.drinkname} / ${item.sizename} / ADDONS: ${addonsText} ` +
    `x${item.qty} = ${numberToMoney(item.linetotal)}`;

  cartlist.appendChild(li);

  rendertotal();
  resetchoices();
});

clearbtn.addEventListener("click", function () {
  cart = [];
  cartlist.innerHTML = "";
  rendertotal();
});
//**********************addbtu
const donebtn = document.getElementById("doneBtn");

donebtn.addEventListener("click", function () {
  // خزّني السلة بالـ localStorage عشان صفحة الملخص تقراها
  localStorage.setItem("cart", JSON.stringify(cart));
  // המידע בסלסלה יועבר לעמוד הבא של הSUMMARY 
  window.location.href = "cartpage.html";
});




