import { Validation } from "../../Extras/validation.js";
import { errorAlertMessage } from "../../Extras/swalAlert.js";

var canvas = document.getElementById("signature-pad");
var signaturePad;
document.getElementById('date').valueAsDate = new Date();

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
    backgroundColor: 'rgba(0, 0, 0, 0.18)'
});

//Onclick clear signature pad
document.getElementById("clear").addEventListener('click', function () {
    signaturePad.clear();
})


document.getElementById('signbtn').addEventListener('click', () => signAndRedirect())

let signAndRedirect = () => {
    let dataURL = canvas.toDataURL("image/png");

    let form = document.getElementById('my-form');

    let { id, name, date } = form.elements;

    let workerobj = { id: id.value, workername: name.value, date: date.value, signature: signaturePad }

    let validation = new Validation(workerobj);
    if (validation.validateHRSecret()) {
        workerobj.signature = dataURL;
        insertWorker(workerobj);
    }
}

let insertWorker = async (worker) => {
    document.querySelector('.loader').classList.remove('loader-hidden');
    await fetch('secretform/sign', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(worker)
    }).then((result) => {
        document.querySelector('.loader').classList.add('loader-hidden');
        if (result.status === 201)
            location.href = `vacationForm?id=${worker.id}`

        else if (result.status === 500)
            errorAlertMessage('ERROR 500', ' ')

        else if (result.status === 409)
            errorAlertMessage('ת.ז קיים במערכת', ' ')

    }).catch((err) => {
        document.querySelector('.loader').classList.add('loader-hidden');
        errorAlertMessage('Oops...', 'Something went wrong!\n' + err.message)
    })
}

// document.getElementById('test').addEventListener('click', () => send())
// let send = async () => {


//     // fetch('https://localhost/createPDF', {
//     //     method: 'GET'
//     // })
//     //     .then(res => res.blob())
//     //     .then(data => {
//     //         var a = document.createElement("a");
//     //         a.href = window.URL.createObjectURL(data);
//     //         a.download = "FILENAME";
//     //         a.click();

//     //     });

//     location.href = 'https://localhost/createPDF';

// }