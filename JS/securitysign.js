import { Validation } from "../Extras/validation.js";
import { successAlertMessage, errorAlertMessage } from "../Extras/swalAlert.js";

var canvas = document.getElementById("signature-pad");
document.getElementById('date').value = new Date().toISOString().split('T')[0];

console.log(document.getElementById('date').value);

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


document.getElementById('signbtn').addEventListener('click', (event) => {
    event.preventDefault();
    signclick();
})
function signclick() {
    let dataURL = canvas.toDataURL("image/png");

    let form = document.getElementById('my-form');

    let { name, idworker, department, email, date } = form.elements;
    //date.value.split("-").reverse().join("-")
    let workerobj = { name: name.value, id: idworker.value, department: department.value, email: email.value, date: date.value, pic: dataURL };
    let validateobj = { id: idworker.value, workername: name.value, date: date.value, department: department.value, email: email.value, signature: signaturePad }
    let validation = new Validation(validateobj);
    if (validation.validateNewSecuritySign())
        insertUser(workerobj);
}




async function insertUser(myWorker) {
    document.querySelector('.loader').classList.remove('loader-hidden');
    await fetch('/securitySign/security-sign', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(myWorker)
    }).then((result) => {
        clearInputs();
        document.querySelector('.loader').classList.add('loader-hidden');
        if (result.status === 201)
            successAlertMessage('עבודה טובה!', 'חתימתך נרשמה')

        else if (result.status === 500)
            errorAlertMessage('ERROR 500', ' ')

    }).catch((err) => {
        document.querySelector('.loader').classList.add('loader-hidden');
        errorAlertMessage('Oops...', 'Something went wrong!\n' + err.message)
    })
}

function clearInputs() {
    document.querySelectorAll('.myinput').forEach((input) => {
        input.value = '';
    })
    document.getElementById('department').value = 'בחר מחלקה'
    signaturePad.clear()

}