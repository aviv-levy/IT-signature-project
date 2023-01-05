let workerstable = document.getElementById('workerstable');
let sum = document.getElementById('sum');
let search = document.getElementById('search');
let myresult;
//#####
//client request for all workers
//#####
fetch('http://localhost:8080', {
    method: 'GET',
    headers: { '1': '1' }
})
    .then((response) => response.json())
    .then((result) => {
        let count = 0;
        myresult = result;
        console.log('Success:', result);
        result.forEach(worker => {
            let securitysigned = '';
            worker.securitysign ? securitysigned = `<td class='signed'>חתום</td>` : securitysigned = `<td class='not-signed'>לא חתום</td>`

            workerstable.innerHTML += ` <tr>
        <td><input class="checkUsers" type="checkbox" value="${worker.id}"> </td> <td><a href="workerdetails.html?worker=${worker.id}&name=${worker.name}&department=${worker.department}">${worker.name}</a></td> <td>${worker.department}</td> <td>${worker.email}</td> <td>${worker.id}</td>${securitysigned}
    </tr>`
            count++;
        });
        sum.innerHTML = ` <span>סה"כ: ${count}</span>`
    })
    .catch((error) => {
        console.error('Error:', error);
    });

//#####
//Worker search event
//#####
search.addEventListener("input", () => {
    let myfilteredworkers = myresult.filter((worker) => {
        if (worker.name.trim().includes(search.value.trim())) {
            return worker;
        }
    })
    let count = 0;
    workerstable.innerHTML = ``;
    myfilteredworkers.forEach((worker) => {
        let securitysigned = '';
        worker.securitysign ? securitysigned = `<td class='signed'>חתום</td>` : securitysigned = `<td class='not-signed'>לא חתום</td>`
        workerstable.innerHTML += ` <tr>
        <td><input class="checkUsers" type="checkbox" value="${worker.id}"> </td> <td><a href="workerdetails.html?worker=${worker.id}&name=${worker.name}&department=${worker.department}">${worker.name}</a></td> <td>${worker.department}</td> <td>${worker.email}</td> <td>${worker.id}</td>${securitysigned}
    </tr>`;
        count++;
    })
    sum.innerHTML = ` <span>סה"כ: ${count}</span>`

})
//#####
//delete function for selected checkboxes
//#####
let deleteSelected = async () => {
    let deleteUsers = [];
    let allusers = document.querySelectorAll('.checkUsers:checked');
    if (allusers.length !== 0) {

        allusers.forEach(user => {
            deleteUsers.push(user.value);
        })

        await fetch('http://localhost:8080', {
            method: 'GET',
            headers: {
                '1': '5',
                '2': encodeURI(JSON.stringify(deleteUsers))
            }
        }).then(location.reload())
    }
}
