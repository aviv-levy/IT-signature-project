import "jspdf/dist/polyfills.es.js";
const URL = 'http://localhost:8080';
var canvas = document.getElementById("signature-pad");


//Signature Pad
function resizeCanvas() {
    var ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d").scale(ratio, ratio);
}
window.onresize = resizeCanvas;
resizeCanvas();

var signaturePad = new SignaturePad(canvas, {
    backgroundColor: '#ffffff'
});

//Onclick clear signature pad
document.getElementById("clear").addEventListener('click', function () {
    signaturePad.clear();
})



function signclick() {
    let dataURL = canvas.toDataURL("image/png");

    let form = document.getElementById('my-form');

    let { name, idworker, department, email, date } = form.elements;
    //date.value.split("-").reverse().join("-")
    let workerobj = { name: name.value, id: idworker.value, department: department.value, email: email.value, date: date.value, pic: dataURL };
    if (validation(name.value, idworker.value, department.value, email.value, date.value))
        insertUser(workerobj);
}




async function insertUser(myWorker) {
    document.querySelector('.loader').classList.remove('loader-hidden');
    await fetch(URL + '/security-sign', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(myWorker)
    }).then(() => {
        clearInputs();
        document.querySelector('.loader').classList.add('loader-hidden');
        Swal.fire(
            'עבודה טובה!',
            'חתימתך נרשמה',
            'success'
        )
    }).catch((err) => {
        document.querySelector('.loader').classList.add('loader-hidden');
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!'
        })
    })
}

function clearInputs() {
    document.querySelectorAll('.myinput').forEach((input) => {
        input.value = '';
    })
    document.getElementById('department').value = 'בחר מחלקה'
    signaturePad.clear()

}

function pdfPrint(){
    console.log('pdff');
    const doc = new jsPDF();
    doc.save("test.pdf")
}


//validate inputs and return true if inputs are corrctly inserted
function validation(worker, idworker, department, email, date) {

    if (worker.length < 2 || (!/^[א-ת\s]*$/.test(worker))) {
        alert('שם עובד לא תקין');
        return false;
    }

    if (idworker.length < 3 || idworker.length > 4 || (!/^\d+$/.test(idworker))) {
        alert('מספר עובד חייב להיות 3 או 4 ספרות');
        return false;
    }


    if (department === 'בחר מחלקה') {
        alert('מחלקה לא תקינה');
        return false;
    }

    if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
        alert('מייל לא תקין');
        return false;
    }

    if (date === '' || (/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/.test(date))) {
        alert('נא להזין תאריך חתימה');
        return false;
    }


    if (signaturePad.isEmpty()) {
        alert('נא לחתום על מהסמך');
        return false;
    }

    return true;
}