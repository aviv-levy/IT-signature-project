let workerstable = document.getElementById('workerstable');
let search = document.getElementById('search');
let myresult;

fetch('http://localhost:8080', {
    method: 'GET',
    headers: { '1': '1' }
})
    .then((response) => response.json())
    .then((result) => {
        myresult = result;
        console.log('Success:', result);
        result.forEach(worker => {
            workerstable.innerHTML += ` <tr>
        <td><input class="checkUsers" type="checkbox" value="${worker.id}"></td> <td><a href="workerdetails.html?worker=${worker.id}">${worker.name}</a></td> <td>${worker.department}</td> <td>${worker.id}</td>
    </tr>`
        });
    })
    .catch((error) => {
        console.error('Error:', error);
    });


search.addEventListener("input", () => {
    let myfilteredworkers = myresult.filter((worker) => {
        if (worker.name.trim().includes(search.value.trim())) {
            return worker;
        }
    })
    workerstable.innerHTML = ``;
    myfilteredworkers.forEach((worker) => {
        workerstable.innerHTML += ` <tr>
        <td><input class="checkUsers" type="checkbox" value="${worker.id}"></td> <td><a href="workerdetails.html?worker=${worker.id}">${worker.name}</a></td> <td>${worker.department}</td> <td>${worker.id}</td>
    </tr>`;
    })
})

let deleteSelected = async () => {
    let deleteUsers = [];
    let allusers = document.querySelectorAll('.checkUsers:checked');
    if (allusers.length !== 0) {
      
        allusers.forEach(user =>{
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
