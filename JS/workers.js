
import { successAlertMessage, errorAlertMessage } from "../Extras/swalAlert.js";
import { displayModal } from "./modal.js"

let workerstable = document.getElementById('workerstable');
let sum = document.getElementById('sum');
let search = document.getElementById('search');
let department = document.getElementById('department');
let myresult, myfilteredworkers;
//#####
//client request for all workers
//#####
fetch('/workers', {
    method: 'GET',
    headers: { "Content-Type": "application/json" }
})
    .then((response) => response.json())
    .then((result) => {
        myresult = result;
        myfilteredworkers = myresult;
        console.log('Success:', result);
        filterWorkers();

    })
    .catch((error) => {
        console.error('Error:', error);
    });

//#####
//Department filter search
//#####
department.addEventListener('change', () => {
    filterWorkers(2);
})


//#####
//Worker search event
//#####
search.addEventListener("input", () => {
    filterWorkers(1);
})
//#####
//Delete function for selected checkboxes
//#####
document.getElementById('deleteBtn').addEventListener('click', () => {
    deleteSelected();
})
let deleteSelected = async () => {
    let deleteUsers = [];
    let allusers = document.querySelectorAll('.checkUsers:checked');
    if (allusers.length !== 0) {

        allusers.forEach(user => deleteUsers.push(JSON.parse(user.value).id))

        await fetch('/delete-workers', {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ workers_ID: deleteUsers })
        }).then(location.reload())
    }
}

//#####
//Send emails function for selected checkboxes
//#####
document.getElementById('sendMailBtn').addEventListener('click', () => {
    sendMail();
})
let sendMail = async () => {
    const emailUsers = [];
    let checkedusers = document.querySelectorAll('.checkUsers:checked');
    if (checkedusers.length !== 0) {

        checkedusers.forEach(user => emailUsers.push(JSON.parse(user.value).email));


        await fetch('/sendMail', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ emails: emailUsers })
        }).then(location.reload())
    }
}

//#####
//Check all checkboxes
//#####
document.getElementById('checkAllBtn').addEventListener('click', () => {
    checkAll();
})
let checkAll = () => {
    let checkedusers = document.querySelectorAll('.checkUsers');
    checkedusers.forEach(user => user.checked = true)
}

//#####
//Remove check from all checkboxes
//#####
document.getElementById('clearAllBtn').addEventListener('click', () => {
    clearAll();
})
let clearAll = () => {
    let checkedusers = document.querySelectorAll('.checkUsers');
    checkedusers.forEach(user => user.checked = false)
}

//#####
//Edit worker Details
//#####
document.getElementById('editbtn').addEventListener('click', () => {
    editWorker();
})
let editWorker = async () => {
    let form = document.getElementById('modal-form');

    let { workerName, idworker, modalDepartment, email } = form.elements;

    let workerobj = { workername: workerName.value, newIdworker: idworker.value, department: modalDepartment.value, email: email.value, currentIdworker: document.getElementById('idworker').getAttribute('data-originalID') };

    if (validation(workerName.value, idworker.value, email.value)) {
        document.getElementById("myModal").style.display = "none";
        document.querySelector('.loader').classList.remove('loader-hidden');
        await fetch('/editDetails', {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(workerobj)
        }).then((result) => {
            console.log(result);
            document.querySelector('.loader').classList.add('loader-hidden');
            if (result.status === 202) {
                successAlertMessage('עבודה טובה!', 'הפרטים עודכנו בהצלחה')
                document.querySelectorAll('.swal2-confirm')[0].addEventListener('click', () => {
                    location.reload();
                })
            }

            else if (result.status === 409)
                errorAlertMessage('User ID already exist', 'Try another ID')

            else if (result.status === 500)
                errorAlertMessage('ERROR 500', ' ')

        }).catch((err) => {
            document.querySelector('.loader').classList.add('loader-hidden');
            errorAlertMessage('Oops...', 'Something went wrong!\n' + err.message)
        })
    }
}

//#####
//Filter Workers function
// 1- filter workers by search input
// 2- filter workers by department select
//#####
function filterWorkers(type = 0) {
    if (type === 1)
        if (department.value === 'בחר מחלקה')
            filterResults(myresult, search, 'name');

        else if ((department.value !== 'בחר מחלקה' && search.value === ''))
            filterResults(myresult, department, 'department');

        else
            filterResults(myfilteredworkers, search, 'name');

    else if (type === 2) {
        if (department.value === 'בחר מחלקה' && search.value === '') {
            myfilteredworkers = myresult;
        } else if (department.value === 'בחר מחלקה' && search.value !== '')
            filterResults(myresult, search, 'name')

        else
            filterResults(myresult, department, 'department');

    }
    let count = 0;
    workerstable.innerHTML = ``;
    myfilteredworkers.forEach(worker => {
        let securitysigned = '';
        worker.securitysign ? securitysigned = `<td class='text-success'>חתום</td>` : securitysigned = `<td class='text-danger'>לא חתום</td>`

        workerstable.innerHTML += ` <tr>
    <td><input class="checkUsers" type="checkbox" value='${JSON.stringify(worker)}'></td><td><i class="fa-regular fa-pen-to-square fa-xs edit-icon"></i></td> <td><a href="/panel/workerDetails?worker=${worker.id}&name=${worker.name}&department=${worker.department}">${worker.name}</a></td> <td>${worker.department}</td> <td>${worker.email}</td> <td>${worker.id}</td>${securitysigned}
</tr>`
        count++;
    });
    sum.innerHTML = ` <span class="text-light">סה"כ: ${count}</span>`

    function filterResults(filteredArray, element, key) {
        myfilteredworkers = filteredArray.filter((worker) => {
            if (worker[`${key}`].trim().includes(element.value.trim()))
                return worker;
        })

    }

    document.querySelectorAll('.edit-icon').forEach((icon, index) => {
        icon.addEventListener('click', () => {
            document.getElementById('idworker').value = myfilteredworkers[index].id
            document.getElementById('idworker').setAttribute('data-originalID', document.getElementById('idworker').value)
            document.getElementById('workerName').value = myfilteredworkers[index].name
            document.getElementById('email').value = myfilteredworkers[index].email
            document.getElementById('modal-department').value = myfilteredworkers[index].department
        })
    })
    displayModal('', '.edit-icon')
}

//validate inputs and return true if inputs are corrctly inserted
function validation(worker, idworker, email) {

    if (worker.length < 2 || (!/^[א-ת\s]*$/.test(worker))) {
        errorAlertMessage('Oops...', 'שם עובד לא תקין');
        return false;
    }

    if (idworker.length < 3 || idworker.length > 4 || (!/^\d+$/.test(idworker))) {
        errorAlertMessage('Oops...', 'מספר עובד חייב להיות 3 או 4 ספרות');
        return false;
    }

    if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
        errorAlertMessage('Oops...', 'מייל לא תקין');
        return false;
    }

    return true;
}