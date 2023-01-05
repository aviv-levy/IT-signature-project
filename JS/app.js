var canvas = document.getElementById("signature-pad");
var signaturePad;
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

 signaturePad = new SignaturePad(canvas, {
 backgroundColor: 'rgba(0, 0, 0, 0.18)'
});

//Onclick clear signature pad
document.getElementById("clear").addEventListener('click', function(){
 signaturePad.clear();
})

//Onclick save user and send request to insert in database
function saveSignature(){
    let dataURL = canvas.toDataURL("image/png");

    let idworker = document.getElementById('idworker').value;
    let workername = document.getElementById('worker').value;
    let date = document.getElementById('date').value;
    let department = document.getElementById('department').value;
    let itworker = document.getElementById('itworker').value;
    let email = document.getElementById('email').value;
    let items  = document.querySelectorAll('.items:checked');
    let computer = document.getElementById('computer').value;
    let phone = document.getElementById('phone').value;
    let other = document.getElementById('other').value;
    
    let arrItems = [];
    if(validation(idworker,workername,date,department,itworker,email,items,computer,phone,other,arrItems)){
        arrItems = JSON.stringify(arrItems);
        let workerobj ={idworker,workername,date,department,itworker,email,arrItems,computer,phone,other,dataURL,onlyitems:false};
        insertUser(workerobj);
    }

}

//connect to database and insert a user
function insertUser(myWorker){
    console.log(JSON.stringify(myWorker));
    request.open('GET', 'http://localhost:8080',);
     
    request.setRequestHeader('1','2');
     request.setRequestHeader('2',encodeURI(JSON.stringify(myWorker))); // Encode and set worker object in request header.

    request.send()
    location.reload()
}

//validate inputs and return true if inputs are corrctly inserted
function validation(idworker,worker,date,department,itworker,email,items,computer,phone,other,arrItems){

    if(idworker.length<3 || idworker.length>4 ||(!/^\d+$/.test(idworker))){
        alert('מספר עובד חייב להיות 3 או 4 ספרות');
        return false;
    }
    if(worker.length<2 || (!/^[א-ת\s]*$/.test(worker))){
        alert('שם עובד לא תקין');
        return false;
    }
    
    if(date === '' || (/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/.test(date))){ 
        alert('נא להזין תאריך חתימה');
        return false;
    }
        
    if(department ==='בחר מחלקה'){
        alert('מחלקה לא תקינה');
        return false;
    }

    if(itworker.length<2 || (!/^[א-ת\s]*$/.test(itworker))){
        alert('מחתים לא תקין');
        return false;
    }
    if(!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
        alert('מייל לא תקין');
        return false;
    }

    if(items[0] === undefined){
        alert('בחר את הציוד להחתמה');
        return false;
    }

    let itemFlag = true;

    if(computer.value === '')
        computer.value = null;

    if(phone.value === '')
        phone.value = null;

    if(other.value === '')
        other.value = null;
    

        items.forEach((item)=>{
            arrItems.push(item.value);
            switch(item.value){
                case '3':
                    if(computer.length<2){
                        alert('אזור מחשב לא תקין');
                         itemFlag = false;
                    }
                    break;
                  case '4':
                    if(phone.length<2){
                        alert('אזור פלאפון לא תקין');
                        itemFlag = false;
                    }
                    break;
                  case '9':
                    if(other.length<2){
                        alert('אחר לא תקין');
                        itemFlag = false;
                    }
                    break;
            }
        })

        if(!itemFlag)
            return false;
            
        if(signaturePad.isEmpty()){
            alert('נא לחתום על מהסמך');
            return false;
        }

    return true;
}