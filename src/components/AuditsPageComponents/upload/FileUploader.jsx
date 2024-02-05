import { useMsal } from "@azure/msal-react";
import axios from "axios";
import { FilePond } from "react-filepond";
import { useDispatch, useSelector } from "react-redux";
import { setAudit } from "../../../redux/reducers/SaveAudit";
import useGetToken from "../../utility/Auth/useGetToken";



const FileUploader = (props) => {
    const dispatch = useDispatch()
    const audit = useSelector((state) => state.SaveAudit)
    const { instance } = useMsal()
    const getToken = useGetToken(instance);

    const processFile = (fieldName, file, metadata, load, error, progress, abort) => {
        const formData = new FormData();
        formData.append(fieldName, file, file.name);

        getToken.then((jwt) => {
            axios.post(process.env.REACT_APP_BACKEND_URL + "/audit/excel", formData, {
                headers: {
                    'Authorization': `Bearer ${jwt}`,
                },
                onUploadProgress: (e) => {
                    progress(e.lengthComputable, e.loaded, e.total);
                }
            }).then((response) => {
                props.dispatchAudit(response, {
                    type: 'file',
                    data: {
                        fileName: response.data.fileName,
                        fileSize: response.data.fileSize
                    }
                });
                load(response.data);
            })
                .catch((err) => {
                    console.log(err);
                    abort();
                });
        })
    }







    return (
        <div className="">
            <FilePond
                onRemoveFile={() => { props.clear() }}
                dropOnElement
                labelInvalidField
                server={{
                    process: processFile,
                }}
                name="file"
                labelIdle='<p>Drag & Drop your files or <span class="filepond--label-action">Browse</span><br />Only accepts .xlsx files</p>'
            />
        </div>




    )

}

export default FileUploader