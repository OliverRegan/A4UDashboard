// import auditMapper from "./auditMapper"
import Axios from 'axios';

function ExportPDF(audit) {
    console.log(audit)
    let URL = process.env.REACT_APP_BACKEND_URL + "/export/pdf"
    let body = JSON.stringify(audit);
    Axios.post(URL, body, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((res) => console.log(res))
        .then(data => {
            // do stuff
        })
        .catch(err => console.log(err))
}
export default ExportPDF