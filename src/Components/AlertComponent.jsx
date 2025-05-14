import Swal from "sweetalert2";

const AlertComponent = {
    showAlert: (message, severity) => {
        Swal.fire({
            title:
                severity === "error"
                    ? "Error"
                    : severity === "success"
                    ? "Success"
                    : "Info",
            text: message,
            icon: severity,
            confirmButtonText: "OK",
            timer: 3000,
            timerProgressBar: true,
        });
    },

    showConfirmation: (message, confirmCallback, cancelCallback) => {
        Swal.fire({
            title: "Are you sure?",
            text: message,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, proceed",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                confirmCallback();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                if (cancelCallback) cancelCallback();
            }
        });
    },
};

export default AlertComponent;
