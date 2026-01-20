
const form = document.getElementById("contactform");

const nameinput = document.getElementById("name");
const emailinput = document.getElementById("email");
const phoneinput = document.getElementById("phonenumber");
const msginput = document.getElementById("message");

const nameerror = document.getElementById("nameerror");
const emailerror = document.getElementById("emailerror");
const phoneerror = document.getElementById("phoneerror");
const msgerror = document.getElementById("messageerror");

const successmsg = document.getElementById("succmsg");
function seterror(el, msg) {//פונקציה שיופיע לנו הערה שקיים טעות 
  el.textContent = msg;
}
function clearerror(el) {//מוחקת ההערה
  el.textContent = "";
}
//פונקציה בודקת אם הכנסת המייל נכונה
function isvalidemail(email) {return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());}

function isvalidphone(phone) {
  const cleaned = phone.replace(/[^\d]/g, "");//מוחק אם לא הוכנס מספר
  return cleaned.length >= 9 && cleaned.length <= 15;//אורך המספר
}
//כדי שנבדוק שהכל הוכנס לפי משצריך מניחים שהכל הוכנסס נכון
function validate() {
  let ok = true;

  if (nameinput.value.trim().length < 1) {
    seterror(nameerror, "Name must be at least 1 characters.");
    ok = false;
  } else clearerror(nameerror);

  if (!isvalidemail(emailinput.value)) {
    seterror(emailerror, "Please enter a valid email.");
    ok = false;
  } else clearerror(emailerror);

  if (!isvalidphone(phoneinput.value)) {
    seterror(phoneerror, "Please enter a valid phone number.");
    ok = false;
  } else clearerror(phoneerror);

  clearerror(msgerror);//שדה לא חובה

  return ok;
}

// live validation
const inputs = [nameinput, emailinput, phoneinput, msginput];//מחרוזת מכילה כל הערכים שהכנסנו

for (let i = 0; i < inputs.length; i++) {
  inputs[i].addEventListener("input", () => {
    successmsg.style.display = "none";//אין הערה אם הצלחנו
    validate();//בדיקה עוד פעם
  });
}

form.addEventListener("submit", async (e) => {
  //E מכיל מידע על משקורה עכשיו

  e.preventDefault();//עצירת התנהגות רגילה שקורת אחרי לחיצה על SUBMIT והיא הסרת נתונים

  successmsg.style.display = "none";//הסרת הודעת הצלחה מוקדמת
  if (!validate()) return;//כאשר יש לנו ביעה באחד השלבים עוצרים ויוצאים מהפונקציה עוזרת כדי לא לשמור מידע לא תקין
//שמירת הנתונים בלי רווחים כוללת תאריך
 
    const dataofcustomer = {
    nameofcustomer: nameinput.value.trim(),
    emailofcustomer: emailinput.value.trim(),
    phoneofcustomer: phoneinput.value.trim(),
    messageofcustomer: msginput.value.trim(),
    createdatofcustomer: new Date().toISOString()
  };

  try {
    const resp = await fetch("/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataofcustomer)
    });
     
    console.log("STATUS:", resp.status);
      const txt = await resp.text();
      console.log("RESPONSE:", txt);


    if (!resp.ok) throw new Error("Server error: " + resp.status);

    // אם הצליח - ממשיכים כרגיל
    localStorage.setItem("lastcontactmessage", JSON.stringify(dataofcustomer));
    successmsg.style.display = "block";
    form.reset();

    setTimeout(() => {
      window.location.href = "project.html";
    }, 1500);

  } catch (err) {
    console.error(err);
    alert("❌ Failed to send contact details to server.");
  }

});
