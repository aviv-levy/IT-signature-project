var canvas = document.getElementById("signature-pad");

const request = new XMLHttpRequest();


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
    document.getElementById("saveSignature").src = dataURL;

    let id = document.getElementById('idworker').value;
    let name = document.getElementById('name').value;
    let date = document.getElementById('date').value;
}




function insertUser(myWorker){
    console.log(JSON.stringify(myWorker));
    request.open('GET', 'http://localhost:8080',);
     
    request.setRequestHeader('1','2');
     request.setRequestHeader('2',encodeURI(JSON.stringify(myWorker))); // Encode and set worker object in request header.

    request.onload = ()=>{
        let myresult = JSON.parse(request.response);
        document.getElementById("saveSignature").src = myresult[2].workerscol ;
        console.log(myresult[2].workerscol);
    }
    request.send()
}