//get parmas of worker from url
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const ID = urlParams.get('worker');
const NAME = urlParams.get('name');
const DEPARTMENT = urlParams.get('department');
var canvas = document.getElementById("signature-pad");


requestItemsFromDatabase(ID);

//Signature Pad
function resizeCanvas() {
    var ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = 365;
    canvas.height = 175;
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

//Get all items from database by worker id and shows it
function requestItemsFromDatabase(idworker) {
    const request = new XMLHttpRequest();
    let display = document.getElementById('display');
    let securitydisp = document.getElementById('securitydisp');
    request.open('GET', 'http://localhost:8080',);
    request.setRequestHeader('1', '3');
    request.setRequestHeader('2', encodeURI(JSON.stringify(idworker)));

    request.onload = () => {
        let myresult = JSON.parse(request.response);
        if (myresult.security !== undefined) {
            securitydisp.innerHTML = `<div><span>תאריך חתימה: ${myresult.security.date.split("-").reverse().join("-")}</span></div>
                                 <div><p>חתימה:</p><img src="" alt="חתימה" id="securitysign"><div> `

            document.getElementById('securitysign').src = myresult.security.signature;
        }
        else
            securitydisp.innerHTML = `<h2>העובד לא חתם על אבטחת מידע</h2>`;

        if (myresult.items !== undefined && myresult.items.length > 0) {
            let signid = 0;

            myresult.items.forEach((itemss) => {
                console.log(itemss);
                let pic = '';
                switch (parseInt(itemss.items)) {
                    case 1:
                        item = 'אוזניות אלחוטיות';
                        pic = '../Items-Pictures/jabra.png';
                        break;
                    case 2:
                        item = 'אוזניות חוטיות';
                        pic = '../Items-Pictures/headphones.png';
                        break;
                    case 3:
                        item = `מחשב נייד מסוג ${itemss.describedItem}`;
                        pic = '../Items-Pictures/Laptop.png';
                        break;
                    case 4:
                        item = `טלפון מסוג ${itemss.describedItem}`;
                        pic = '../Items-Pictures/phone.png';
                        break;
                    case 5:
                        item = 'נטסטיק לגלישה סלולרית';
                        pic = '../Items-Pictures/netstick.png';
                        break;
                    case 6:
                        item = 'דיסק און קי';
                        pic = '../Items-Pictures/usb.png';
                        break;
                    case 7:
                        item = 'תיק';
                        pic = '../Items-Pictures/bag.png';
                        break;
                    case 8:
                        item = 'מטען';
                        pic = '../Items-Pictures/charger.png';
                        break;
                    case 9:
                        item = itemss.describedItem;
                        break;
                    case 10:
                        item = 'מצלמה';
                        pic = '../Items-Pictures/camera.png';
                        break;

                }
                display.innerHTML += `<div class="item">
                <div class="wrapper">
                <div class="content">
                <input type="checkbox" class="items" value="${itemss.id}">
                  <div class="item_img" style="background-image:url(${pic})"></div>
                  <div class="details">
                    <div class="title">${item}</div>
                    <div class="sub-title">${itemss.date.split("-").reverse().join("-")}</div>
                  </div>
                  <div class="btn">
                    <button class="deleteBtn" onclick="deleteItem()" value = "${itemss.id}">מחק</button>
                  </div>
                </div>
              </div>
            </div> `


                display.innerHTML += `<div class = "item-view">
                <h3>פרטים:</h3>
            <div><span>תאריך חתימה: ${itemss.date.split("-").reverse().join("-")}</span></div>
            <div><p>מחתים: ${itemss.itworker}</p></div>
            <div><p>חתימה:</p><img src="" alt="חתימה" id="securitysignitem${signid}"><div>
            </div> `;
                document.getElementById(`securitysignitem${signid}`).src = itemss.sign;
                signid++;
            })



            //delte item event
            document.querySelectorAll('.deleteBtn').forEach(btn => {
                btn.addEventListener('click', async () => {
                    await fetch('http://localhost:8080', {
                        method: 'GET',
                        headers: {
                            '1': '6',
                            '2': encodeURI(JSON.stringify(btn.value))
                        }
                    }).then(location.reload())
                })
            });

            //click item to open details
            document.querySelectorAll('.details').forEach((item, index) => {
                item.addEventListener('click', () => {
                    if (!document.querySelectorAll('.item-view')[index].classList.contains('show'))
                        document.querySelectorAll('.item-view')[index].classList.add('show')
                    else
                        document.querySelectorAll('.item-view')[index].classList.remove('show')
                })
            })
            document.querySelectorAll('.item_img').forEach((item, index) => {
                item.addEventListener('click', () => {
                    if (!document.querySelectorAll('.item-view')[index].classList.contains('show'))
                        document.querySelectorAll('.item-view')[index].classList.add('show')
                    else
                        document.querySelectorAll('.item-view')[index].classList.remove('show')
                })
            })

        }
        else {
            display.innerHTML = `<h2>העובד לא חתום על ציוד</h2>`

            document.getElementById('delte-items').style.display = 'none';
        }
    }
    request.send()
}


//delete all checked items function
let deleteItems = async () => {
    let deleteItems = []
    let selectedItems = document.querySelectorAll('.items:checked');
    console.log(selectedItems);
    if (selectedItems.length !== 0) {

        selectedItems.forEach(item => {
            deleteItems.push(item.value);
        })
        await fetch('http://localhost:8080', {
            method: 'GET',
            headers: {
                '1': '6',
                '2': encodeURI(JSON.stringify(deleteItems))
            }
        }).then(location.reload())
    }
}



//Onclick save user and send request to insert in database
function saveSignature() {
    let dataURL = canvas.toDataURL("image/png");

    let date = document.getElementById('date').value;
    let itworker = document.getElementById('itworker').value;
    let items = document.querySelectorAll('.items:checked');
    let computer = document.getElementById('computer').value;
    let phone = document.getElementById('phone').value;
    let other = document.getElementById('other').value;

    let arrItems = [];
    if (validation(date, itworker, items, computer, phone, other, arrItems)) {
        arrItems = JSON.stringify(arrItems);
        let workerobj = { idworker: ID, workername: NAME, date, department: DEPARTMENT, itworker, arrItems, computer, phone, other, dataURL, onlyitems: true };
        insertUser(workerobj);
    }

}

//connect to database and insert a user
function insertUser(myWorker) {
    console.log(JSON.stringify(myWorker));

    fetch('http://localhost:8080', {
        method: 'GET',
        headers: {
            '1': '2',
            '2': encodeURI(JSON.stringify(myWorker))
        }
    }).then(location.reload())
}


//validate inputs and return true if inputs are corrctly inserted
function validation(date, itworker, items, computer, phone, other, arrItems) {

    if (date === '' || (/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/.test(date))) {
        alert('נא להזין תאריך חתימה');
        return false;
    }

    if (itworker.length < 2 || (!/^[א-ת\s]*$/.test(itworker))) {
        alert('מחתים לא תקין');
        return false;
    }

    if (items[0] === undefined) {
        alert('בחר את הציוד להחתמה');
        return false;
    }

    let itemFlag = true;

    if (computer.value === '')
        computer.value = null;

    if (phone.value === '')
        phone.value = null;

    if (other.value === '')
        other.value = null;


    items.forEach((item) => {
        arrItems.push(item.value);
        switch (item.value) {
            case '3':
                if (computer.length < 2) {
                    alert('אזור מחשב לא תקין');
                    itemFlag = false;
                }
                break;
            case '4':
                if (phone.length < 2) {
                    alert('אזור פלאפון לא תקין');
                    itemFlag = false;
                }
                break;
            case '9':
                if (other.length < 2) {
                    alert('אחר לא תקין');
                    itemFlag = false;
                }
                break;
        }
    })

    if (!itemFlag)
        return false;

    if (signaturePad.isEmpty()) {
        alert('נא לחתום על מהסמך');
        return false;
    }

    return true;
}