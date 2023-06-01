import { Validation } from "../Extras/validation.js";
import { successAlertMessage, errorAlertMessage } from "../Extras/swalAlert.js";

document.getElementById('date').value = new Date().toISOString().split('T')[0];

var canvas = document.getElementById("signature-pad");
var signaturePad;

//Signature Pad
function resizeCanvas() {
    var ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d").scale(ratio, ratio);
}
window.onresize = resizeCanvas;
resizeCanvas();

signaturePad = new SignaturePad(canvas, {
  backgroundColor: 'rgb(192, 192, 192)'
});

//Onclick clear signature pad
document.getElementById("clear").addEventListener('click', function () {
    signaturePad.clear();
})

//Onclick save user and send request to insert in database
document.getElementById('save').addEventListener('click', () => {
    saveSignature();
})
function saveSignature() {
    let dataURL = canvas.toDataURL("image/png");

    let idworker = document.getElementById('idworker').value;
    let workername = document.getElementById('worker').value;
    let date = document.getElementById('date').value;
    let department = document.getElementById('department').value;
    let itworker = document.getElementById('itworker').value;
    let email = document.getElementById('email').value;
    let items = document.querySelectorAll('.items:checked');
    let computer = document.getElementById('computer').value;
    let phone = document.getElementById('phone').value;
    let other = document.getElementById('other').value;
    
    let validateobj = { id: idworker, workername: workername, date, department, itworker, email, items, signature: signaturePad, computer, phone, other }
      
    let validation = new Validation(validateobj);
    if (validation.validateNewWorkerItems()) {
        let arrItems = JSON.stringify(validation.getArrItems());
        let workerobj = { idworker, workername, date, department, itworker, email, arrItems, computer, phone, other, dataURL, onlyitems: false };
        insertUser(workerobj);
    }

}

//connect to database and insert a user
async function insertUser(myWorker) {
    document.querySelector('.loader').classList.remove('loader-hidden');
    await fetch('/newWorker/sign', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(myWorker)
    }).then(() => {
        clearInputs();
        document.querySelector('.loader').classList.add('loader-hidden');
        successAlertMessage('עבודה טובה!', 'חתימתך נרשמה')
    }).catch((err) => {
        document.querySelector('.loader').classList.add('loader-hidden');
        errorAlertMessage('Oops...', err.message);
    })
}


function clearInputs() {
    document.querySelectorAll('.myInput').forEach(element => {
        element.value = '';
    });
    document.querySelectorAll('.myCheck').forEach(element => {
        element.checked = false;
    });
    signaturePad.clear();
}