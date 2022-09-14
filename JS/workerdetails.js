
//get ID worker from url
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('worker');


requestItemsFromDatabase(id);


function requestItemsFromDatabase(idworker) {
    const request = new XMLHttpRequest();
    let display = document.getElementById('display');
    let securitydisp = document.getElementById('securitydisp');
    request.open('GET', 'http://192.168.50.52:8080',);
    //request.open('GET', 'http://localhost:8080',);
    request.setRequestHeader('1', '3');
    request.setRequestHeader('2',encodeURI(JSON.stringify(idworker))); 

    request.onload = () => {
        let myresult = JSON.parse(request.response);

        securitydisp.innerHTML = `<div><span>תאריך חתימה: ${myresult[0].date.split("-").reverse().join("-")}</span></div>
                                 <div><p>חתימה:</p><img src="" alt="חתימה" id="securitysign"><div> `

        document.getElementById('securitysign').src = myresult[0].signature;
        console.log(myresult[0].date);
    }
    request.send()
}
