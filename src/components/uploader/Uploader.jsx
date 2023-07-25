// Import React FilePond
import { FilePond } from 'react-filepond'

// Import FilePond styles
import 'filepond/dist/filepond.min.css'
const Uploader = (props) => {
    return (
        <FilePond
            onupdatefiles={(file) => { props.setFiles(file) }}
            onRemoveFile={() => { props.clear() }}
            dropOnElement
            labelInvalidField
            server={{
                url: process.env.REACT_APP_BACKEND_URL + "/audit/excel",
                process: {
                    onload: (res) => { props.handleUpload(res) },
                }
            }}
            name="file"
            labelIdle='<p>Drag & Drop your files or <span class="filepond--label-action">Browse</span><br />Only accepts .xlsx files</p>'
        />
    )
}

export default Uploader