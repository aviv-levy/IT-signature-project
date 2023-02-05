import { isConnected } from "./serverAuth.js";

isConnected(loadPage);

function loadPage() {
    const URL = 'http://localhost:8080';
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
        backgroundColor: 'rgba(0, 0, 0, 0.18)'
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

        let arrItems = [];
        if (validation(idworker, workername, date, department, itworker, email, items, computer, phone, other, arrItems)) {
            arrItems = JSON.stringify(arrItems);
            let workerobj = { idworker, workername, date, department, itworker, email, arrItems, computer, phone, other, dataURL, onlyitems: false };
            insertUser(workerobj);
        }

    }

    //connect to database and insert a user
    async function insertUser(myWorker) {
        document.querySelector('.loader').classList.remove('loader-hidden');
        await fetch(URL + '/sign', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(myWorker)
        }).then(() => {
            document.querySelector('.loader').classList.add('loader-hidden');
            Swal.fire(
                'עבודה טובה!',
                'חתימתך נרשמה',
                'success'
            )
        }).catch((err) => {
            document.querySelector('.loader').classList.add('loader-hidden');
            alertMessage('Oops...','Something went wrong');
        })
    }

    function alertMessage(title,message){
        Swal.fire({
            icon: 'error',
            title: title,
            text: message
        })
    }

    //validate inputs and return true if inputs are corrctly inserted
    function validation(idworker, worker, date, department, itworker, email, items, computer, phone, other, arrItems) {

        if (idworker.length < 3 || idworker.length > 4 || (!/^\d+$/.test(idworker))) {
            alertMessage('Oops...','מספר עובד חייב להיות 3 או 4 ספרות');
            return false;
        }
        if (worker.length < 2 || (!/^[א-ת\s]*$/.test(worker))) {
            alertMessage('Oops...','שם עובד לא תקין');
            return false;
        }

        if (date === '' || (/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/.test(date))) {
            alertMessage('Oops...','נא להזין תאריך חתימה');
            return false;
        }

        if (department === 'בחר מחלקה') {
            alertMessage('Oops...','מחלקה לא תקינה');
            return false;
        }

        if (itworker.length < 2 || (!/^[א-ת\s]*$/.test(itworker))) {
            alertMessage('Oops...','מחתים לא תקין');
            return false;
        }
        if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            alertMessage('Oops...','מייל לא תקין');
            return false;
        }

        if (items[0] === undefined) {
            alertMessage('Oops...','בחר את הציוד להחתמה');
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
                        alertMessage('Oops...','אזור מחשב לא תקין');
                        itemFlag = false;
                    }
                    break;
                case '4':
                    if (phone.length < 2) {
                        alertMessage('Oops...','אזור פלאפון לא תקין');
                        itemFlag = false;
                    }
                    break;
                case '9':
                    if (other.length < 2) {
                        alertMessage('Oops...','אחר לא תקין');
                        itemFlag = false;
                    }
                    break;
            }
        })

        if (!itemFlag)
            return false;

        if (signaturePad.isEmpty()) {
            alertMessage('Oops...','נא לחתום על מהסמך');
            return false;
        }

        return true;
    }
}