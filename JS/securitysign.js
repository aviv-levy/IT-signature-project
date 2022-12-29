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
    backgroundColor: 'rgb(250,250,250)'
});

//Onclick clear signature pad
document.getElementById("clear").addEventListener('click', function () {
    signaturePad.clear();
})




function signclick() {
    let dataURL = canvas.toDataURL("image/png");

    let form = document.getElementById('my-form');

    let { name, idworker, department, date } = form.elements;
    //date.value.split("-").reverse().join("-")
    let workerobj = { name: name.value, id: idworker.value, department: department.value, date: date.value, pic: dataURL };
    if (validation(name.value, idworker.value, department.value, date.value))
          insertUser(workerobj);
}




function insertUser(myWorker) {
    const request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:8080',);

    request.setRequestHeader('1', '4');
    request.setRequestHeader('2', encodeURI(JSON.stringify(myWorker))); // Encode and set worker object in request header.

    request.send()
    location.reload()
}


//validate inputs and return true if inputs are corrctly inserted
function validation(worker, idworker, department, date) {

    if(worker.length<2 || (!/^[א-ת\s]*$/.test(worker))){
        alert('שם עובד לא תקין');
        return false;
    }

    if(idworker.length<3 || idworker.length>4 ||(!/^\d+$/.test(idworker))){
        alert('מספר עובד חייב להיות 3 או 4 ספרות');
        return false;
    }

    
    if (department === 'בחר מחלקה') {
        alert('מחלקה לא תקינה');
        return false;
    }

    if(date === '' || (/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/.test(date))){ 
        alert('נא להזין תאריך חתימה');
        return false;
    }


    if (signaturePad.isEmpty()) {
        alert('נא לחתום על מהסמך');
        return false;
    }

    return true;
}