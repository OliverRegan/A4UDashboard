// import auditMapper from "./auditMapper"
import axios from 'axios';

function Export(audit, type, getToken) {
    let URL = process.env.REACT_APP_BACKEND_URL + "/export/" + type
    let body = JSON.stringify(audit);
    getToken.then((jwt) => {
        console.log(audit)
        axios.post(URL, body, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'arraybuffer',
                'Authorization': `Bearer ${jwt}`
            },
            responseType: 'arraybuffer', // Set the responseType to 'arraybuffer' to handle binary data

        })
            .then((response) => {
                if (response.status != 200) {
                    console.log(response)
                    throw new Error("Network response was not ok");
                }
                console.log(response)
                return response;
            })
            .then(response => {
                if (type === "pdf") {
                    console.log(response)
                    const pdfData = new Uint8Array(response.data);
                    // Create a Blob with the binary PDF data
                    const blob = new Blob([response.data], { type: 'application/pdf' });
                    console.log(blob)
                    const url = (window.URL || window.webkitURL).createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = (audit.auditDetails.auditName === "" ? "New Audit" : audit.auditDetails.auditName) + ".pdf";
                    document.body.appendChild(a);
                    a.click();
                    a.remove(); // Clean up the temporary anchor element
                }
                else if (type === "xlsx") {
                    console.log(audit)
                    const excelData = new Uint8Array(response.data);
                    // Create a Blob with the binary Excel data
                    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                    // Create a temporary URL for the Blob and trigger the download
                    const url = (window.URL || window.webkitURL).createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = (audit.auditDetails.auditName === "" ? "New Audit" : audit.auditDetails.auditName) + ".xlsx";
                    document.body.appendChild(a);
                    a.click();
                    a.remove(); // Clean up the temporary anchor element
                }
            })
            .catch(err => console.log(err))
    })
}
export default Export