

let login = () => {
    let form = document.getElementById('my-form');

    let { username, password } = form.elements;

    const User = { username: username.value, password: password.value }

    fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(User)
    }).then((response) => response.json())
        .then((result) => {
            setCookie('token', result.token, result.expires);
            document.location.href = 'myworkers.html';
        }).catch((error) => {
            alert('Bad Login')
        })

};


function setCookie(key, value, expires) {
    document.cookie = `${key}=${value}; ${expires.toUTCString}; path =/`
}