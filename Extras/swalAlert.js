export function errorAlertMessage(title, message) {
    Swal.fire({
        icon: 'error',
        title: title,
        text: message
    })
}


export function successAlertMessage(title, message) {
    Swal.fire(
        title,
        message,
        'success'
    )
}

export async function deleteAlertMessage(deleteTextBtn, confirmMessage, resetFunc) {

    Swal.fire({
        title: '?Are you sure',
        text: "!You won't be able to revert this",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: deleteTextBtn
    }).then((result) => {
        if (result.isConfirmed) {
            resetFunc();
            Swal.fire(
                '!Reset',
                confirmMessage,
                'success'
            )
        }
    })
}
