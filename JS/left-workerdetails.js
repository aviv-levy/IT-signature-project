import { URL } from "../Extras/serverurl.js";


//get parmas of worker from url
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const ID = urlParams.get('worker');
var canvas = document.getElementById("signature-pad");
let signedItems, returnedItems;
var signaturePad;

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
async function requestItemsFromDatabase(idworker) {
    let display = document.getElementById('display');
    let displayReturn = document.getElementById('displayReturn');
    let securitydisp = document.getElementById('securitydisp');

    await fetch(URL + '/items', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idworker })
    })
        .then((response) => response.json())
        .then((result) => {
            if (result.security !== undefined) {
                securitydisp.innerHTML = `<div><span>תאריך חתימה: ${result.security.date.split("-").reverse().join("-")}</span></div>
                                 <div><p>חתימה:</p><img src="" alt="חתימה" id="securitysign"><div> `

                document.getElementById('securitysign').src = result.security.signature;
            }
            else
                securitydisp.innerHTML = `<h2>העובד לא חתם על אבטחת מידע</h2>`;

            signedItems = result.items.filter((item) => {
                if (item.returned === 0)
                    return item;
            })
            returnedItems = result.items.filter((item) => {
                if (item.returned === 1)
                    return item;
            })
            let signid = 0;
            if (signedItems !== undefined && signedItems.length > 0) {

                signedItems.forEach((itemss) => {
                    console.log(itemss);
                    let pic = '';
                    let item = '';
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
                        await fetch(URL + '/delete-items', {
                            method: 'DELETE',
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ ids: btn.value, isMoreItems: false })

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


            //Returned Items display
            if (returnedItems !== undefined && returnedItems.length > 0) {
                returnedItems.forEach((itemss) => {
                    console.log(itemss);
                    let pic = '';
                    let item = '';
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
                    displayReturn.innerHTML += `<div class="item">
                                <div class="wrapper">
                                <div class="content">
                                  <div class="item_img" style="background-image:url(${pic})"></div>
                                  <div class="details">
                                    <div class="title">${item}</div>
                                    <div class="sub-title">${itemss.date.split("-").reverse().join("-")}</div>
                                  </div>
                                </div>
                              </div>
                            </div> `


                    displayReturn.innerHTML += `<div class = "item-view">
                                <h3>פרטים:</h3>
                            <div><span>תאריך חתימה: ${itemss.date.split("-").reverse().join("-")}</span></div>
                            <div><p>מחתים: ${itemss.itworker}</p></div>
                            <div><p>חתימה:</p><img src="" alt="חתימה" id="securitysignitem2${signid}"><div>
                            </div> `;
                    document.getElementById(`securitysignitem2${signid}`).src = itemss.sign;
                    signid++;
                })

                //delte item event
                document.querySelectorAll('.deleteBtn').forEach(btn => {
                    btn.addEventListener('click', async () => {
                        await fetch(URL + '/delete-items', {
                            method: 'DELETE',
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ ids: btn.value, isMoreItems: false })

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
            else
                displayReturn.innerHTML = `<h2>לעובד אין ציוד מזוכה</h2>`

        });
}


//delete all checked items function
document.getElementById('delte-items').addEventListener('click', () => {
    deleteItems();
})
let deleteItems = async () => {
    let deleteItems = []
    let selectedItems = document.querySelectorAll('.items:checked');
    console.log(selectedItems);
    if (selectedItems.length !== 0) {

        selectedItems.forEach(item => {
            deleteItems.push(item.value);
        })
        await fetch(URL + '/delete-items', {
            method: 'DELETE',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: deleteItems })
        }).then(location.reload())
    }
}


//connect to database and insert a user
async function insertUser(myWorker) {
    console.log(JSON.stringify(myWorker));

    await fetch(URL + '/sign', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(myWorker)
    }).then(location.reload())
}
