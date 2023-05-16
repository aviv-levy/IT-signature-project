import { errorAlertMessage } from "../Extras/swalAlert.js";

//Press Enter option to click login button
for (let i = 0; i < document.getElementsByTagName('input').length; i++) {
    document.getElementsByTagName('input')[i].addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();

            document.getElementById('loginbtn').click();
        }
    })
}

document.getElementById('loginbtn').addEventListener('click', () => {
    login();
})
//Login function send username and password to validate if true
let login = async () => {
    let form = document.getElementById('my-form');

    let { username, password } = form.elements;

    const User = { username: username.value, password: password.value }

    await fetch('/login', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(User)
    }).then((result) => {
        //setCookie('token', result.token, result.expires);
        if (result.status === 200) {
            result.json().then(((data) => {
                document.location.href = `/${data.page}`;
            }));
        }
        if (result.status === 401)
            errorAlertMessage('Oops...', 'Not Authorized')

    }).catch((error) => {
        alert(error.message)
    })

};
function getTokenFromCookie(token) {
    const cDecoded = decodeURIComponent(document.cookie);
    const cArray = cDecoded.split("; ")
    let result = null;
    cArray.forEach(element => {
        if (element.indexOf(token) === 0)
            result = element.substring(token.length + 1)
    })
    return result;
}

function setCookie(key, value, expires) {
    document.cookie = `${key}=${value}; ${expires.toUTCString}; path =/`
}