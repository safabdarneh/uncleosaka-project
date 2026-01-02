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

  if (nameinput.value.trim().length < 2) {
    seterror(nameerror, "Name must be at least 2 characters.");
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

  if (msginput.value.trim().length < 5) {
    seterror(msgerror, "Message must be at least 5 characters.");
    ok = false;
  } else clearerror(msgerror);

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

form.addEventListener("submit", (e) => {
  e.preventDefault();

  successmsg.style.display = "none";
  if (!validate()) return;
//שמירת הנתונים
  const dataofcustomer = {
    nameofcustomer: nameinput.value.trim(),
    emailofcustomer: emailinput.value.trim(),
    phoneofcustomer: phoneinput.value.trim(),
    messageofcustomer: msginput.value.trim(),
    createdatofcustomer: new Date().toISOString()
  };

  localStorage.setItem("lastcontactmessage", JSON.stringify(dataofcustomer));
 window.location.href="project.html";//אם כל משהכנסנו נכון נעבור לדף הבית
  form.reset();
  successmsg.style.display = "block";
});
