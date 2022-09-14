let workerstable = document.getElementById('workerstable');
let search = document.getElementById('search');
let myresult;
//const request = new XMLHttpRequest();


fetch('http://192.168.50.52:8080', {
    method: 'PUT',
    headers: { '1': '1' }
})
    .then((response) => response.json())
    .then((result) => {
        myresult = result;
        console.log('Success:', result);
        result.forEach(worker => {
            workerstable.innerHTML += ` <tr>
        <td></td> <td><a href="workerdetails.html?worker=${worker.id}">${worker.name}</a></td> <td>${worker.department}</td> <td>${worker.id}</td>
    </tr>`
        });
    })
    .catch((error) => {
        console.error('Error:', error);
    });


search.addEventListener("input", () => {
    let myfilteredworkers = myresult.filter((worker)=>{
        if(worker.name.trim().includes(search.value.trim())){
            return worker;
        }
    })
    workerstable.innerHTML = ``;
    myfilteredworkers.forEach((worker)=>{
        workerstable.innerHTML += ` <tr>
        <td></td> <td><a href="workerdetails.html?worker=${worker.id}">${worker.name}</a></td> <td>${worker.department}</td> <td>${worker.id}</td>
    </tr>`;
    })
    console.log(search.value);
    // myresult.forEach((worker)=>{
    //     if(worker.name.trim().includes(search.value.trim())){
    //         console.log('yay');
    //     }
    // })
})

// fetch('http://192.168.50.52:8080',{credentials: 'include','1':'1'})
//   .then((response) => response.json())
//   .then((data) => console.log(data));


// request.open('GET', 'http://192.168.50.52:8080',);
// request.withCredentials = true
// request.setRequestHeader('1','1');

// request.onload = ()=>{
//     console.log(request.response);
//    let myresult = JSON.parse(request.response);
//    workersDisplay.innerHTML= `        <table border="1">
//                                     <thead>
//                                         <tr>
//                                             <td></td> <td>שם עובד</td> <td>מחלקה</td> <td>מספר עובד</td>
//                                         </tr>
//                                     </thead>

//                                     <tbody id="workerstable">


//                                     </tbody>

//                                     </table>`;

//     let workerstable = document.getElementById('workerstable');
//     myresult.forEach(worker => {
//         workerstable.innerHTML+=` <tr>
//         <td></td> <td><a href="workerdetails.html?worker=${worker.id}">${worker.name}</a></td> <td>${worker.department}</td> <td>${worker.id}</td>
//     </tr>`
//     });

// }
// request.send()