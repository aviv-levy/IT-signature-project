import { errorAlertMessage, successAlertMessage } from "../../Extras/swalAlert.js";

var canvas = document.getElementById("signature-pad");
var signaturePad;
//get parmas of worker from url
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const ID = urlParams.get('id');

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
    if (signatureValidate())
        insertSignature(dataURL);
}

let insertSignature = async (signature) => {
    document.querySelector('.loader').classList.remove('loader-hidden');
    await fetch('vacationForm/sign', {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: ID, signature: signature })
    }).then((result) => {
        document.querySelector('.loader').classList.add('loader-hidden');

        if (result.status === 202)
            successAlertMessage('חתימתך נרשמה בהצלחה', '');

        else if (result.status === 500)
            errorAlertMessage('ERROR 500', ' ')

    }).catch((err) => {
        document.querySelector('.loader').classList.add('loader-hidden');
        errorAlertMessage('Oops...', 'Something went wrong!\n' + err.message)
    })
}

function signatureValidate() {
    if (ID === null) {
        errorAlertMessage('Oops...', 'שגיאה בתעודת זהות');
        return false;
    }
    else if (ID.length != 9) {
        errorAlertMessage('Oops...', 'שגיאה בתעודת זהות');
        return false;
    }
    if (signaturePad.isEmpty()) {
        errorAlertMessage('Oops...', 'נא לחתום על מהסמך');
        return false;
    }
    return true;
}