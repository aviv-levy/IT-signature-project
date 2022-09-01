let workersDisplay = document.getElementById('workerDisplay');
const request = new XMLHttpRequest();





request.open('GET', 'http://localhost:8080',);
request.setRequestHeader('1','1');

request.onload = ()=>{
    console.log(request.response);
   let myresult = JSON.parse(request.response);
   workersDisplay.innerHTML= `        <table border="1">
                                    <thead>
                                        <tr>
                                            <td></td> <td>שם עובד</td> <td>מחלקה</td> <td>מספר עובד</td>
                                        </tr>
                                    </thead>

                                    <tbody id="workerstable">


                                    </tbody>

                                    </table>`;

    let workerstable = document.getElementById('workerstable');
    myresult.forEach(worker => {
        workerstable.innerHTML+=` <tr>
        <td></td> <td>${worker.name}</td> <td>${worker.department}</td> <td>${worker.id}</td>
    </tr>`
    });
   //document.getElementById("saveSignature").src = myresult[2].workerscol ; Insert signature

}
request.send()