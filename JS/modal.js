export function displayModal(btnID, btnClass) {
  // Get the modal
  var modal = document.getElementById("myModal");

  // Get the button that opens the modal
  if (btnID !== '') {
    let btn = document.querySelector(btnID)
    // When the user clicks on the button, open the modal
    btn.onclick = function () {
      modal.style.display = "block";
    }
  }

  else {
    let btns = document.querySelectorAll(btnClass)
    // When the user clicks on the button, open the modal
    btns.forEach(btn => {
      btn.onclick = function () {
        modal.style.display = "block";
      }
    })
  }

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}