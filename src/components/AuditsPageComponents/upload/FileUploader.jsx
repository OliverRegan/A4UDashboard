import { useMsal } from "@azure/msal-react";
import useGetToken from "../../utility/Auth/useGetToken";

import axios from "axios";

import { FilePond } from "react-filepond";

import { Button, Link } from "@mui/material";

const FileUploader = (props) => {

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
            })

                .then((response) => {
                    props.dispatchAudit(response);
                    load(response.data);
                })
                .catch((err) => {
                    console.log(err);
                    abort();
                });
        })


        // onload: (res) => {
        //     url: process.env.REACT_APP_BACKEND_URL + "/audit/excel",
        //      
    }

    function formatBytes(bytes, decimals) {
        if (bytes == 0) return '0 Bytes';
        var k = 1024,
            dm = decimals || 2,
            sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    return (
        props.audit.accounts.length === 0 ?
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
            :
            <div className='card'>
                <div className='card-body '>
                    <div className='w-100 text-center mb-8'>
                        <h2 className='text-2xl'>Uploaded File</h2>
                    </div>
                    <div className='w-1/2 flex justify-around mx-auto'>
                        <div className='text-center w-1/2'>
                            <h4 className='my-2 text-xl'>File Name:</h4>
                            <p>{props.audit.file.fileName}</p>
                        </div>
                        <div className='text-center w-1/2'>
                            <h4 className='my-2 text-xl'>File Size</h4>
                            <p>{formatBytes(props.audit.file.fileSize, 0)}</p>
                        </div>
                    </div>
                    <div className=' grid grid-cols-4 gap-2 w-1/2 mx-auto mt-4'>
                        <div className='col-span-2'>
                            <Button
                                component={Link}
                                to="/accounts"
                                variant="contained"
                                color='success'
                                sx={{
                                    width: 1,
                                    "&:hover": {
                                        color: "#fff"
                                    }
                                }}>Select Accounts</Button>
                        </div>
                        <div className='col-span-2'>
                            <Button
                                onClick={props.validateFileRemoval}
                                // onClick={}
                                variant="contained"
                                color='error'
                                sx={{
                                    width: 1,
                                }}>Clear File</Button>
                        </div>
                    </div>

                </div>
            </div>
    )

}

export default FileUploader