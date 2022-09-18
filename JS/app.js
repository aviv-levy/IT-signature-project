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

//Onclick save user and send request to insert in database
function saveSignature(){
    let dataURL = canvas.toDataURL("image/png");
    //data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUoAAACZCAYAAABJ9HMwAAAAAXNSR0IArs4c6QAABWZJREFUeF7t1rERwzAMBEGx/46Z2BVYDi78VY4AC86Nzr338/gIECBA4KfAEUqvgwABAu8CQumFECBA4I+AUHoiBAgQEEpvgAABAk3AH2XzM02AwICAUA4c2YoECDQBoWx+pgkQGBAQyoEjW5EAgSYglM3PNAECAwJCOXBkKxIg0ASEsvmZJkBgQEAoB45sRQIEmoBQNj/TBAgMCAjlwJGtSIBAExDK5meaAIEBAaEcOLIVCRBoAkLZ/EwTIDAgIJQDR7YiAQJNQCibn2kCBAYEhHLgyFYkQKAJCGXzM02AwICAUA4c2YoECDQBoWx+pgkQGBAQyoEjW5EAgSYglM3PNAECAwJCOXBkKxIg0ASEsvmZJkBgQEAoB45sRQIEmoBQNj/TBAgMCAjlwJGtSIBAExDK5meaAIEBAaEcOLIVCRBoAkLZ/EwTIDAgIJQDR7YiAQJNQCibn2kCBAYEhHLgyFYkQKAJCGXzM02AwICAUA4c2YoECDQBoWx+pgkQGBAQyoEjW5EAgSYglM3PNAECAwJCOXBkKxIg0ASEsvmZJkBgQEAoB45sRQIEmoBQNj/TBAgMCAjlwJGtSIBAExDK5meaAIEBAaEcOLIVCRBoAkLZ/EwTIDAgIJQDR7YiAQJNQCibn2kCBAYEhHLgyFYkQKAJCGXzM02AwICAUA4c2YoECDQBoWx+pgkQGBAQyoEjW5EAgSYglM3PNAECAwJCOXBkKxIg0ASEsvmZJkBgQEAoB45sRQIEmoBQNj/TBAgMCAjlwJGtSIBAExDK5meaAIEBAaEcOLIVCRBoAkLZ/EwTIDAgIJQDR7YiAQJNQCibn2kCBAYEhHLgyFYkQKAJCGXzM02AwICAUA4c2YoECDQBoWx+pgkQGBAQyoEjW5EAgSYglM3PNAECAwJCOXBkKxIg0ASEsvmZJkBgQEAoB45sRQIEmoBQNj/TBAgMCAjlwJGtSIBAExDK5meaAIEBAaEcOLIVCRBoAkLZ/EwTIDAgIJQDR7YiAQJNQCibn2kCBAYEhHLgyFYkQKAJCGXzM02AwICAUA4c2YoECDQBoWx+pgkQGBAQyoEjW5EAgSYglM3PNAECAwJCOXBkKxIg0ASEsvmZJkBgQEAoB45sRQIEmoBQNj/TBAgMCAjlwJGtSIBAExDK5meaAIEBAaEcOLIVCRBoAkLZ/EwTIDAgIJQDR7YiAQJNQCibn2kCBAYEhHLgyFYkQKAJCGXzM02AwICAUA4c2YoECDQBoWx+pgkQGBAQyoEjW5EAgSYglM3PNAECAwJCOXBkKxIg0ASEsvmZJkBgQEAoB45sRQIEmoBQNj/TBAgMCAjlwJGtSIBAExDK5meaAIEBAaEcOLIVCRBoAkLZ/EwTIDAgIJQDR7YiAQJNQCibn2kCBAYEhHLgyFYkQKAJCGXzM02AwICAUA4c2YoECDQBoWx+pgkQGBAQyoEjW5EAgSYglM3PNAECAwJCOXBkKxIg0ASEsvmZJkBgQEAoB45sRQIEmoBQNj/TBAgMCAjlwJGtSIBAExDK5meaAIEBAaEcOLIVCRBoAkLZ/EwTIDAgIJQDR7YiAQJNQCibn2kCBAYEhHLgyFYkQKAJCGXzM02AwICAUA4c2YoECDQBoWx+pgkQGBAQyoEjW5EAgSYglM3PNAECAwJCOXBkKxIg0ASEsvmZJkBgQEAoB45sRQIEmoBQNj/TBAgMCAjlwJGtSIBAExDK5meaAIEBAaEcOLIVCRBoAkLZ/EwTIDAgIJQDR7YiAQJNQCibn2kCBAYEhHLgyFYkQKAJCGXzM02AwICAUA4c2YoECDQBoWx+pgkQGBAQyoEjW5EAgSbwBaufWV0LM238AAAAAElFTkSuQmCC
    //if sign empty
    let idworker = document.getElementById('idworker').value;
    let workername = document.getElementById('worker').value;
    let date = document.getElementById('date').value;
    let department = document.getElementById('department').value;
    let itworker = document.getElementById('itworker').value;
    let items  = document.querySelectorAll('.items:checked');
    let computer = document.getElementById('computer').value;
    let phone = document.getElementById('phone').value;
    let other = document.getElementById('other').value;
    
    let arrItems = [];
    if(validation(idworker,workername,date,department,itworker,items,computer,phone,other,arrItems)){
        arrItems = JSON.stringify(arrItems);
        let workerobj ={idworker,workername,date,department,itworker,arrItems,computer,phone,other,dataURL};
        insertUser(workerobj);
    }

}

//connect to database and insert a user
function insertUser(myWorker){
    console.log(JSON.stringify(myWorker));
    request.open('GET', 'http://localhost:8080',);
     
    request.setRequestHeader('1','2');
     request.setRequestHeader('2',encodeURI(JSON.stringify(myWorker))); // Encode and set worker object in request header.

    // request.onload = ()=>{
    //     let myresult = JSON.parse(request.response);
    //     document.getElementById("saveSignature").src = myresult[2].workerscol ;
    //     console.log(myresult[2].workerscol);
    // }
    request.send()
}


//validate inputs and return true if inputs are corrctly inserted
function validation(idworker,worker,date,department,itworker,items,computer,phone,other,arrItems){

    if(idworker.length<3 || idworker.length>4){
        alert('מספר עובד חייב להיות 3 או 4 ספרות');
        return false;
    }
    if(worker.length<2){
        alert('שם עובד לא תקין');
        return false;
    }
    
    if(date === ''){
        alert('נא להזין תאריך חתימה');
        return false;
    }
        
    if(department ==='בחר מחלקה'){
        alert('מחלקה לא תקינה');
        return false;
    }

    if(itworker.length<2){
        alert('מחתים לא תקין');
        return false;
    }

    if(items[0] === undefined){
        alert('בחר את הציוד להחתמה');
        return false;
    }

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
                         return false;
                    }
                    break;
                  case '4':
                    if(phone.length<2){
                        alert('אזור פלאפון לא תקין');
                       return false;
                    }
                    break;
                  case '9':
                    if(other.length<2){
                        alert('אחר לא תקין');
                         return false;
                    }
                    break;
            }
        })

    return true;
}