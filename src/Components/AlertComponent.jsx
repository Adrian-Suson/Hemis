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
};

export default AlertComponent;
