let workerstable = document.getElementById('workerstable');
let sum = document.getElementById('sum');
let search = document.getElementById('search');
let myresult, myfilteredworkers;
//#####
//client request for all workers
//#####
fetch('/hr/getWorkers', {
    method: 'GET',
    headers: { "Content-Type": "application/json" }
})
    .then((response) => response.json())
    .then((result) => {
        myresult = JSON.parse(result);
        myfilteredworkers = myresult;
        console.log('Success:', myresult);
        filterWorkers();

    })
    .catch((error) => {
        console.error('Error:', error);
    });

//#####
//Worker search event
//#####
search.addEventListener("input", () => {
    filterWorkers();
})

//#####
//Filter Workers function
//#####
function filterWorkers() {
    filterResults(myresult, search, 'name');

    let count = 0;
    workerstable.innerHTML = ``;
    myfilteredworkers.forEach(worker => {
        let securitysigned = '';
        worker.securitysign ? securitysigned = `<td class='signed'>חתום</td>` : securitysigned = `<td class='not-signed'>לא חתום</td>`
        workerstable.innerHTML += ` <tr>
    <td></td> <td>${worker.name}</a></td> <td>${worker.id}</td> <td><a href='https://localhost/createPDF/${worker.id}'><i class="fa-solid fa-file-pdf fa-xl"></a></td> <td><a href='https://localhost/createPDF_Vacation/${worker.id}'><i class="fa-solid fa-file-pdf fa-xl"></i></a></td>
</tr>`
        count++;
    });
    sum.innerHTML = ` <span>סה"כ: ${count}</span>`

    function filterResults(filteredArray, element, key) {
        myfilteredworkers = filteredArray.filter((worker) => {
            if (worker[`${key}`].trim().includes(element.value.trim()))
                return worker;
        })

    }
}

document.getElementById('addWorker').addEventListener('click', ()=>{
    location.href= '/HR/secretForm'
})