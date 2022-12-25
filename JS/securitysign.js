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
document.getElementById("clear").addEventListener('click', function(){
 signaturePad.clear();
})




function signclick(){
    let dataURL = canvas.toDataURL("image/png");

    let form = document.getElementById('my-form');

    let {name,idworker,department,date} = form.elements;
    console.log(department.value);
    //date.value.split("-").reverse().join("-")
    let workerobj = {name:name.value, id:idworker.value,department:department.value,date:date.value,pic:dataURL };

    insertUser(workerobj);
}




function insertUser(myWorker){
    const request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:8080',);
     
    request.setRequestHeader('1','4');
     request.setRequestHeader('2',encodeURI(JSON.stringify(myWorker))); // Encode and set worker object in request header.

    request.send()
}