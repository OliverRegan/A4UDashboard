import { Button } from "@mui/material";
import { useEffect, useState } from "react";

const UploadDetails = ({ audit, formatBytes, handleImportRemoval }) => {

    const [detailsType, setDetailsType] = useState("")

    useEffect(() => {
        if (audit.importData.file.fileName != "" && audit.importData.file.fileSize != "") {
            setDetailsType("file");
        } else if (audit.importData.xero.connectionName != "" && audit.importData.xero.connectionId != "") {
            setDetailsType("xero");
        }
    }, [audit])

    return (


        <>
            <div className='card'>
                <div className='card-body '>
                    {
                        detailsType === "file" ?
                            <div>
                                <div className='w-100 text-center mb-8'>
                                    <h2 className='text-2xl'>Uploaded File</h2>
                                </div>
                                <div className='w-1/2 flex justify-around mx-auto'>
                                    <div className='text-center w-1/2'>
                                        <h4 className='my-2 text-xl'>File Name:</h4>
                                        <p>{audit.importData.file.fileName}</p>
                                    </div>
                                    <div className='text-center w-1/2'>
                                        <h4 className='my-2 text-xl'>File Size</h4>
                                        <p>{formatBytes(audit.importData.file.fileSize, 0)}</p>
                                    </div>
                                </div>
                            </div>
                            :
                            <></>
                    }
                    {
                        detailsType === "xero" ?
                            <div>
                                <div className='w-100 text-center mb-8'>
                                    <h2 className='text-2xl'>Connected to:</h2>
                                </div>
                                <div className='flex mx-auto justify-center'>
                                    <div className='text-center'>
                                        <p>{audit.importData.xero.connectionName}</p>
                                    </div>
                                </div>
                            </div>
                            :
                            <></>
                    }
                    <div className=' grid grid-cols-4 gap-2 w-1/2 mx-auto mt-4'>
                        <div className='col-span-2 col-start-2'>
                            <Button
                                onClick={handleImportRemoval}
                                // onClick={}
                                variant="contained"
                                color='error'
                                sx={{
                                    width: 1,
                                }}>Clear Import</Button>
                        </div>
                    </div>
                </div>
            </div>

        </>


    )


}
export default UploadDetails;