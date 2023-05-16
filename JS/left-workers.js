
let workerstable = document.getElementById('workerstable');
let sum = document.getElementById('sum');
let search = document.getElementById('search');
let department = document.getElementById('department');
let myresult, myfilteredworkers;
//#####
//client request for all workers
//#####
fetch('/left-workers', {
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
        worker.securitysign ? securitysigned = `<td class='signed'>חתום</td>` : securitysigned = `<td class='not-signed'>לא חתום</td>`

        workerstable.innerHTML += ` <tr>
    <td><input class="checkUsers" type="checkbox" value='${JSON.stringify(worker)}'> </td> <td><a href="/retiredWorkers/workerDetails?worker=${worker.id}">${worker.name}</a></td> <td>${worker.department}</td> <td>${worker.email}</td> <td>${worker.id}</td>
</tr>`
        count++;
    });
    sum.innerHTML = ` <span class='text-light'>סה"כ: ${count}</span>`

    function filterResults(filteredArray, element, key) {
        myfilteredworkers = filteredArray.filter((worker) => {
            if (worker[`${key}`].trim().includes(element.value.trim()))
                return worker;
        })

    }
}