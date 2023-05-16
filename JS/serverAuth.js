
// function getTokenFromCookie(token) {
//     const cDecoded = decodeURIComponent(document.cookie);
//     const cArray = cDecoded.split("; ")
//     let result = null;
//     cArray.forEach(element => {
//         if (element.indexOf(token) === 0)
//             result = element.substring(token.length + 1)
//     })
//     return result;
// }

// // async function tokenAuth(token, loadpage) {

// //     await fetch('http://localhost:8080/checkAuth', {
// //         method: 'POST',
// //         headers: { "Content-Type": "application/json",
// //                     "Authentication": 'Bearer '+ token},
// //         body: JSON.stringify({ token: token })
// //     }).then((response) => {
// //         if (response.status === 200) {
// //             document.getElementById('root').style.display = 'block';
// //             loadpage();
// //         }
// //     }).catch(error => console.log(error))
// // }

// export async function isConnected(loadfunc) {
//     window.addEventListener('load', async ()=>{
//         const loader = document.querySelector('.loader');

//         loader.classList.add('loader-hidden');
//         const AuthToken = getTokenFromCookie('token');
//         AuthToken ? tokenAuth(AuthToken, loadfunc) :  document.location.href = '/login'
//         loader.addEventListener('transitionend', ()=>{
//             loader.parentNode.removeChild(loader)
//         })
//     })
// }