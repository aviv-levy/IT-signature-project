
//get ID worker from url
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('worker');


requestItemsFromDatabase(id);


function requestItemsFromDatabase(idworker) {
    const request = new XMLHttpRequest();
    let display = document.getElementById('display');
    let securitydisp = document.getElementById('securitydisp');
    request.open('GET', 'http://localhost:8080',);
    //request.open('GET', 'http://localhost:8080',);
    request.setRequestHeader('1', '3');
    request.setRequestHeader('2',encodeURI(JSON.stringify(idworker))); 

    request.onload = () => {
        let myresult = JSON.parse(request.response);
        console.log(myresult.items);
        if(myresult.security !== undefined){
        securitydisp.innerHTML = `<div><span>תאריך חתימה: ${myresult.security.date.split("-").reverse().join("-")}</span></div>
                                 <div><p>חתימה:</p><img src="" alt="חתימה" id="securitysign"><div> `

        document.getElementById('securitysign').src = myresult.security.signature;
        }
        else
             securitydisp.innerHTML = `<h2>העובד לא חתם על אבטחת מידע</h2>`;

        
        if(myresult.items !== undefined){
            let signid = 0;
            myresult.items.forEach((itemss)=>{
            let workerData = JSON.parse(itemss.items);
            workerData.forEach((item)=>{
                switch (parseInt(item)) {
                    case 1:
                        item = 'אוזניות אלחוטיות';
                        break;
                    case 2:
                        item = 'אוזניות חוטיות';
                        break;
                    case 3:
                        item = `מחשב נייד מסוג ${itemss.computer}`;
                        break;
                    case 4:
                        item = `טלפון מסוג ${itemss.phone}`;
                        break;
                    case 5:
                        item = 'נטסטיק לגלישה סלולרית';
                        break;
                    case 6:
                        item = 'דיסק און קי';
                        break;
                    case 7:
                        item = 'תיק';
                        break;
                    case 8:
                        item = 'מטען';
                        break;
                    case 9:
                        item = itemss.other;
                        break;
                    case 10:
                        item = 'מצלמה';
                        break;
                        
                }
                display.innerHTML+=`<div>${item}</div> <hr>`
            })
            display.innerHTML += `<h3>פרטים:</h3>
            <div><span>תאריך חתימה: ${itemss.date.split("-").reverse().join("-")}</span></div>
            <div><p>מחתים: ${itemss.itworker}</p></div>
            <div><p>חתימה:</p><img src="" alt="חתימה" id="securitysignitem${signid}"><div> `;
            document.getElementById(`securitysignitem${signid}`).src = itemss.sign;
            signid++;
        })
        }
        else
            display.innerHTML = `<h2>העובד לא חתום על ציוד</h2>`
    }
    request.send()
}
