
//get ID worker from url
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('worker');


requestItemsFromDatabase(id);











function requestItemsFromDatabase(idworker) {
    const request = new XMLHttpRequest();
    let display = document.getElementById('display');
    request.open('GET', 'http://localhost:8080',);
    request.setRequestHeader('1', '3');

    request.onload = () => {
        console.log(request.response);
        let myresult = JSON.parse(request.response);
        display.innerHTML = `  `;
        console.log(myresult);
    //     let workerstable = document.getElementById('workerstable');
    //     myresult.forEach(worker => {
    //         workerstable.innerHTML += ` <tr>
    //     <td></td> <td><a href="workerdetails.html?worker=${worker.id}">${worker.name}</a></td> <td>${worker.department}</td> <td>${worker.id}</td>
    // </tr>`
    //     });
        //document.getElementById("saveSignature").src = myresult[2].workerscol ; Insert signature

    }
    request.send()
}
