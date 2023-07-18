// Import React FilePond
import { FilePond } from 'react-filepond'

// Import FilePond styles
import 'filepond/dist/filepond.min.css'
import { useEffect } from 'react'
const Uploader = (props) => {
    return (
        <FilePond
            onupdatefiles={(file) => { props.setFiles(file) }}
            onRemoveFile={() => { props.clear() }}
            beforeRemoveFile={() => props.validateFileRemoval().then((result) => {

                // File removal confirmed, proceed with removing the file
                props.setIsOpen(false)
                return true;

            }).catch((error) => {
                props.setIsOpen(false)
                // Error occurred during file removal validation
                console.log('Error occurred during file removal validation:', error);
            })}

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